# VG-Price-Checker

This takes a list of games (text file) and creates a csv with all of their current prices.

```bash
npm install
node app.js TEXT_FILE CONSOLE_NUM
```

- TEXT_FILE: Location of text file (include .txt extension)
  - list of games separated by a new line
- CONSOLE_NUM: Default `13` (NES)
  - 13 - NES
  - 17 - SNES

### TODO

- [x] NES and SNES Support
- [ ] More Console Support
- [ ] Natural language instead of console number
- [ ] Google Sheets integration
- [ ] Display Totals
- [ ] Display Totals over time
- [ ] Save Totals to compare over time
