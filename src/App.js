import "./App.css";
import Reader from "./Reader";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

function App() {
  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 4 }}>
        <Card sx={{ minWidth: 275 }} variant="outlined">
          <CardContent>
            <Typography variant="h4" component="h1" gutterBottom>
              RDPVis
            </Typography>
            <Typography variant="body1" gutterBottom>
              RDPVis is a tool to visualize RDP events from Windows Event Logs.
              It takes a JSON input file from ChainSaw.
            </Typography>
            <Typography variant="body1" gutterBottom>
              Use the following command to get that file:
            </Typography>
            <Typography sx={{ mb: 1.5 }} component="pre" color="text.secondary">
              ./chainsaw hunt [INPUT_FOLDER_CONTAINING_EVTX_FILES] --mapping
              mappings/sigma-event-logs-all.yml -r rules/rdp_attacks/ -o
              [OUTPUT_FILE].json -j
            </Typography>
          </CardContent>
        </Card>
        <Reader />
      </Box>
    </Container>
  );
}

export default App;
