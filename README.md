# Video Game Price-Checker

Takes a list of games from a text file and creates a csv with all of their current prices.

(requires node >= 8)

```bash
npm install
node app.js TEXT_FILE -c CONSOLE_NAME
```

- TEXT_FILE: Location of text file (please include .txt extension)
  - list of games separated by a new line
- CONSOLE_NAME: Short Name of the console
  - See list below

## Console Names

### Nintendo

- GB, GBA, GBC, GameCube, NES, 3DS, N64, NDS, Switch, SNES, Virtual_Boy, Wii, WiiU

### Sega

- 32X, SCD, Dreamcast, GameGear, Genesis, SMS, Saturn

### TODO

- [x] NES and SNES Support
- [x] Display Totals
- [x] Display Totals over time
- [x] Save Totals to compare over time
- [x] Natural language instead of console number
- [x] Pretty Print Totals
- [x] Show which games have lost or gained value
- [x] More Console Support
- [x] Revamped command-line arguments
- [ ] Add spinners and better console logs
- [ ] Add option for verbose
- [ ] Google Sheets integration
