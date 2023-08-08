import React, { useEffect, useState } from "react";
import EvtTimeline from "./EvtTimeline";

import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import OutlinedInput from "@mui/material/OutlinedInput";
import Chip from "@mui/material/Chip";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import { parseEventLog } from "./utils/parser";
import RDPSessionsView from "./RDPSessionsView";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{my:2}}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const FileReaderComponent = () => {
  const [fileContent, setFileContent] = useState({});
  const [eventsFilters, setEventsFilters] = useState([]);
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);
  const [selectedView, setSelectedView] = useState(0);

  // When eventsFilters or events changes, filter events
  useEffect(() => {
    setFilteredEvents(
      events.filter((event) => eventsFilters.includes(event.type))
    );
  }, [eventsFilters, events]);

  // When events change, get unique event types
  useEffect(() => {
    // Get unique event types
    let types = events.map((event) => event.type);
    types = [...new Set(types)];
    setEventTypes(types);
    if (eventsFilters.length === 0) {
      setEventsFilters(types);
    }
  }, [events, eventsFilters.length]);

  // When file content changes, parse it and set events
  useEffect(() => {
    const ev = parseEventLog(fileContent);
    if (ev) {
      setEvents(ev);
    }
  }, [fileContent]);

  const handleFileRead = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        setFileContent(json);
      } catch (err) {
        console.error("Error parsing JSON: ", err);
      }
    };

    reader.onerror = (event) => {
      console.error("File could not be read: ", event.target.error);
    };

    reader.readAsText(file);
  };

  return (
    <Box sx={{ width: "100%", my:2 }}>
      <Box component="form">
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          {/* <InputLabel id="input-file-label">Select file</InputLabel> */}
          <OutlinedInput
            id="input-file"
            type="file"
            onChange={handleFileRead}
            input={<OutlinedInput id="input-file" label="Select file" />}
          />
        </FormControl>

        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <InputLabel id="event-type-filter-select">Events type</InputLabel>
          <Select
            labelId="event-type-filter-select"
            id="event-type-filter"
            value={eventsFilters}
            multiple
            input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
            label="Events type"
            onChange={(e) => {
              setEventsFilters(e.target.value);
            }}
          >
            {eventTypes.map((name) => (
              <MenuItem key={name} value={name}>
                {name.charAt(0).toUpperCase() + name.slice(1)}{" "}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={selectedView}
            onChange={(event, newValue) => setSelectedView(newValue)}
            aria-label="basic tabs example"
          >
            <Tab label="Sessions" {...a11yProps(0)} />
            <Tab label="Timeline" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={selectedView} index={0}>
          <RDPSessionsView events={filteredEvents} />
        </CustomTabPanel>
        <CustomTabPanel value={selectedView} index={1}>
          <EvtTimeline events={filteredEvents} />
        </CustomTabPanel>
      </Box>
    </Box>
  );
};

export default FileReaderComponent;
