// TODO: add possibility to manage hosts mapping from UI and save in localstorage
const hosts = [
  ["192.168.0.23", "SERVER2.CONTOSO.COM"],
  ["192.168.0.1", "SERVER1.CONTOSO.COM"],
];

const parseEventLog = (eventLogs: any) => {
  // If eventLogs is empty or not an array, return empty array
  if (!eventLogs || !Array.isArray(eventLogs)) {
    console.log("eventLogs is empty or not an array", eventLogs);
    return [];
  }

  // Filter eventLogs to only include events with group "rdp_attacks"
  eventLogs = eventLogs.filter((event) => event.group === "rdp_attacks");

  let events = eventLogs.map((event: any) => {
    const eventData = event.document.data.Event;
    const systemData = eventData.System;

    const eventId = systemData.EventID;

    const activityId =
      "Correlation_attributes" in systemData
        ? systemData.Correlation_attributes.ActivityID
        : null;

    let user = "";
    let domain = "";
    let source_ip = "";
    let type = "";

    if (eventId === 1149) {
      type = "authentication succeeded";
      const userData = eventData.UserData.EventXML;
      user = userData.Param1;
      domain = userData.Param2;
      source_ip = userData.Param3;
    } else if (eventId === 25 || eventId === 24) {
      type = eventId === 25 ? "connected" : "disconnected";
      const userData = eventData.UserData.EventXML;
      const splitUser = userData.User ? userData.User.split("\\") : ["", ""];
      user = splitUser[1];
      domain = splitUser[0];
      source_ip = userData.Address;
    } else if (eventId === 4624) {
      type = "RDP logon";
      user = eventData.EventData.TargetUserName;
      domain = eventData.EventData.TargetDomainName;
      source_ip = eventData.EventData.IpAddress;
    }

    const source = hosts.find((host) => host[0] === source_ip);
    const source_str = source ? source[1] : source_ip;

    // parse timestamp to Date object and format it
    const timestamp = new Date(event.timestamp);
    const nice_timestamp = timestamp.toUTCString();

    return {
      description: event.name,
      type,
      timestamp: timestamp,
      nice_timestamp: nice_timestamp,
      destination: systemData.Computer,
      user,
      domain,
      source: source_str,
      source_ip,
      activityId,
    };
  });

  // remove duplicates based on timestamp
  events = events.filter(
    (event: any, index: number, self: any) =>
      index ===
      self.findIndex(
        (e: any) => e.timestamp.toUTCString() === event.timestamp.toUTCString()
      )
  );

  // sort by timestamp
  events.sort((a: any, b: any) => a.timestamp - b.timestamp);

  return events;
};

const groupEvents = (events: any) => {
  // group by activityId
  let grouped_events = events.reduce((acc: any, event: any) => {
    let index = acc.findIndex((e: any) => e.activityId === event.activityId);
    if (index === -1) {
      acc.push({
        activityId: event.activityId,
        type: event.type,
        events: [event],
      });
    } else {
      acc[index].events.push(event);
    }
    return acc;
  }, []);

  // Calculate duration connected and disconnected events and add to grouped_events
  grouped_events = grouped_events.map((group: any) => {
    let connected = group.events.find(
      (event: any) => event.type === "connected"
    );
    let disconnected = group.events.find(
      (event: any) => event.type === "disconnected"
    );

    let duration = 0;
    if (!connected || !disconnected) {
      return {};
    }
    duration = disconnected.timestamp - connected.timestamp;

    return {
      ...group,
      duration,
      user: connected.user,
      domain: connected.domain,
      source: connected.source,
      source_ip: connected.source_ip,
      destination: connected.destination,
      connected_at: connected.timestamp,
      disconnected_at: disconnected.timestamp,
    };
  });

  // remove empty objects
  grouped_events = grouped_events.filter(
    (group: any) => Object.keys(group).length
  );
  return grouped_events;
};

const formatDuration = (ms: any) => {
  if (ms < 0) ms = -ms;
  const time = {
    d: Math.floor(ms / 86400000),
    h: Math.floor(ms / 3600000) % 24,
    m: Math.floor(ms / 60000) % 60,
    s: Math.floor(ms / 1000) % 60,
    ms: Math.floor(ms) % 1000,
  };
  return Object.entries(time)
    .filter((val) => val[1] !== 0)
    .map(([key, val]) => `${val} ${key}${val !== 1 ? "" : ""}`)
    .join(", ");
};

export { parseEventLog, formatDuration, groupEvents };
export default parseEventLog;
