import React from "react";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import Typography from "@mui/material/Typography";
import ConnectIcon from "@mui/icons-material/ScreenShare";
import DisconnectIcon from "@mui/icons-material/StopScreenShare";
import AuthSuccessIcon from "@mui/icons-material/GppGood";

const EvtTimeline = ({ events }) => {
  const timelineEvents = events ? (
    events.map((event) => (
      <TimelineItem key={event.timestamp}>
        <TimelineOppositeContent
          sx={{ m: "auto 0" }}
          align="right"
          variant="body2"
          color="text.secondary"
        >
          {event.nice_timestamp}
        </TimelineOppositeContent>
        <TimelineSeparator>
          <TimelineConnector />
          <TimelineDot
            variant="outlined"
            color={
              event.type === "connected"
                ? "success"
                : event.type === "disconnected"
                ? "warning"
                : "success"
            }
          >
            {event.type === "connected" ? (
              <ConnectIcon color="success" />
            ) : event.type === "disconnected" ? (
              <DisconnectIcon color="warning" />
            ) : (
              <AuthSuccessIcon color="success" />
            )}
          </TimelineDot>
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent sx={{ py: "12px", px: 2 }}>
          <Typography variant="h6" component="span">
            {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
          </Typography>
          <Typography>
            {event.source_ip}{" "}
            <Typography variant="span" sx={{ color: "text.info" }}>
              &rarr;
            </Typography>{" "}
            {event.destination}
          </Typography>
          <Typography color="secondary">
            {event.domain}\{event.user}
          </Typography>
        </TimelineContent>
      </TimelineItem>
    ))
  ) : (
    <></>
  );

  return <Timeline position="alternate">{timelineEvents}</Timeline>;
};

export default EvtTimeline;
