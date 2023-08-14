import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";

import { groupEvents, formatDuration } from "./utils/parser";

const columns = [
  { field: "source", headerName: "Source", flex: 1 },
  { field: "destination", headerName: "Destination", flex: 1 },
  { field: "user", headerName: "User", flex: 1 },
  { field: "domain", headerName: "Domain", flex: 1 },
  {
    field: "duration",
    headerName: "Duration",
    flex: 0.8,
    valueFormatter: (params: { value: any; }) => formatDuration(params.value),
  },
  {
    field: "connected_at",
    headerName: "Connected At",
    minWidth: 230,
    valueFormatter: (params: { value: { toUTCString: () => any; }; }) => params.value.toUTCString(),
  },
  {
    field: "disconnected_at",
    headerName: "Disconnected At",
    minWidth: 230,
    valueFormatter: (params: { value: { toUTCString: () => any; }; }) => params.value.toUTCString(),
  },
];

const RDPSessionsView = ({ events }: { events: any }) => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (events) {
      const grouped = groupEvents(events);

      let rows = grouped.map((session: { activityId: any; source: any; destination: any; user: any; domain: any; duration: any; connected_at: any; disconnected_at: any; }) => {
        return {
          id: session.activityId,
          source: session.source,
          destination: session.destination,
          user: session.user,
          domain: session.domain,
          duration: session.duration,
          connected_at: session.connected_at,
          disconnected_at: session.disconnected_at,
        };
      });
      setRows(rows);
    }
  }, [events]);

  return (
    <div style={{ height: 900, width: "100%" }}>
      <DataGrid rows={rows} columns={columns} />
    </div>
  );
};

export default RDPSessionsView;
