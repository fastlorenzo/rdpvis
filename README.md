# RDPVis

Simple web app that allows to visualize RDP (Remote Desktop Protocol) sessions.

Once you run the app, you can import json output from [Chainsaw](https://github.com/WithSecureLabs/chainsaw).

_Disclaimer_: this is work in progress, so expect bugs and missing features.

## How to get the JSON output from Chainsaw

1. Get [Chainsaw](https://github.com/WithSecureLabs/chainsaw)
2. Run it with `./chainsaw hunt <INPUT_FOLDER_CONTAINING_EVTX_FILES> --mapping mappings/sigma-event-logs-all.yml  -r rules/rdp_attacks/ -o <OUTPUT_FILE>.json -j`
3. Import `<OUTPUT_FILE>.json` into RDPVis

## Credits

- [Chainsaw](https://github.com/WithSecureLabs/chainsaw) for the awesome work on the evtx parser
- [EVTX-ATTACK-SAMPLES](https://github.com/sbousseaden/EVTX-ATTACK-SAMPLES) for the sample evtx files
- [MUI](https://mui.com) for the UI React components
- [React](https://reactjs.org) for the UI framework
