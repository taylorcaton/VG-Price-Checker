# Video Game Price-Checker

Takes a list of games from a text file and creates a csv with all of their current prices.

(requires node >= 8)

```bash
npm install
node app.js TEXT_FILE -c CONSOLE_NAME -v
```

**REQUIRED:**

- TEXT_FILE: Location of text file (please include .txt extension)
  - list of games separated by a new line
- (-c) CONSOLE_NAME: Short Name of the console
  - See list below

**OPTIONAL:**

- (-v) Verbose

## Console Names

### Nintendo

- GB, GBA, GBC, GameCube, NES, 3DS, N64, NDS, Switch, SNES, Virtual_Boy, Wii, WiiU

### Sega

- 32X, SCD, Dreamcast, GameGear, Genesis, SMS, Saturn

### TODO

- [x] NES and SNES Support
- [x] Display totals
- [x] Display totals over time
- [x] Save totals to compare over time
- [x] Natural language instead of console number
- [x] Pretty print totals
- [x] Show which games have lost or gained value
- [x] More console support
- [x] Revamped command-line arguments
- [x] Add spinners and better console logs
- [x] Add option for verbose
- [ ] Quick search for a single game
- [ ] Google Sheets integration
