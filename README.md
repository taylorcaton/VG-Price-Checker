# VG-Price-Checker

This takes a list of games (text file) and creates a csv with all of their current prices.

```bash
npm install
node app.js TEXT_FILE CONSOLE_NAME
```

- TEXT_FILE: Location of text file (include .txt extension)
  - list of games separated by a new line
- CONSOLE_NAME: Short Name of the console
  - See list below

## Console Names

### Nintendo

- GB, GBA, GBC, GameCube, NES, 3DS, N64, NDS, Switch, SNES, Virtual_Boy, Wii, WiiU

### TODO

- [x] NES and SNES Support
- [x] Display Totals
- [x] Display Totals over time
- [x] Save Totals to compare over time
- [ ] More Console Support
- [x] Natural language instead of console number
- [ ] Google Sheets integration
