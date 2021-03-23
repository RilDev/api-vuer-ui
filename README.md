# API Vuer

The friendly robot that searches APIs for you!

## Todo

- [x] store recent history in localStorage: `{search, result, date}`
- [x] don't take into account `search === ''`
- [x] limit history to 20 searches
- [x] display recent history. `line-through` and `bg-gray-200` for searches with no results
- [x] delete element from recent history
- [x] on clear search, focus on the search-input
- [x] on delete history log stop event propagation
- [x] load on click as if it was a regular search, with the message "Data retrieved from memory!"
- [x] adjust history design to make is fit no matter the number of logs
- [x] add tutorial when user has no favorite
- [ ] add random funny messages to the robot when performing actions like `add to favorite`, `remove from favorite`, `delete log`...
- [x] convert all component to `.vue` single file components
- [ ] test
- [ ] convert components to composition API
- [ ] convert project to TypeScript project
- [ ] make app PWA
- [ ] add offline mode where the robot says "Can't connect to the network!", disable inputs, gray them off
