# User Manual

# 2019 San Francisco Shock Overwatch League Playoff Highlights

## Background & Motivation
Always interested in some sort of sports, not necessarily mainstream sports like
basketball or football, esports was an enjoyment to watch in seeing skill and teamwork
at work. Specifically, the game Overwatch, a team based multiplayer first-person
shooter game. It assigns players in two teams of six and each player selects from a
large pool of characters with unique abilities. Teams work and battle to complete
map-specific objectives within a limited period of time. As for the Overwatch League,
the San Francisco Shock is one of the teams in the league and a favorite team of
mine. I want to be able to represent and highlight the SF Shock with all their successes
from this season.

## Website Link
Hosted on GitHub Pages: https://zethan88.github.io/sf-shock-owl-highlights/

## Data
- [Overatch League Website](https://overwatchleague.com/en-us/statslab)
- [Dash Reset San Francisco Shock](https://dashreset.com/team/San-Francisco-Shock/matches)

## Visualization Tools
- HTML, CSS, Javascript
- [D3.js](https://d3js.org/)
- [D3 SVG Legend By Susie Lu](https://d3-legend.susielu.com/#symbol)

## For Development
Libraries to Note: The usage.js Javascript file utilizes a `D3 V3`,
but the rest of the files utilizes `D3 V7`. Another graph also uses
Susie Lu's D3 SVG Legend.

### For Rebuilding
- Clone the project from the [GitHub Repo](https://github.com/zethan88/sf-shock-owl-highlights).
- Import the project into your IDE or editor and run the `index.html` file on a local live server.

### To Modify
- All visuals are implemented with D3.js. under the `assets/js/` folder.
- Everything else is written in HTML or styled with CSS.
  - HTML folder found in `html`.
  - CSS folder found in `assets/css/`.
- The website is a template from [HTML5UP](https://html5up.net/).

## Other Notes
When the browser window is resized, the visualizations would not resize, as
I have not accounted for readjustment/resizing during development.

## Questions?
Contact at `zethan88@gmail.com`