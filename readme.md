Get bodies from web pages
# Get a single body
```javascript
const { getBody } = require('body-snatchers')

const bodyString = getBody('https://news.ycombinator.com/', false)
```
# Multiple bodies
```javascript
const { getBodies } = require('body-snatchers')

const bodyStrings = getBodies([
  { url: 'https://news.ycombinator.com/' },
  { url: 'https://google.com/', js: true } // page that requires JavaScript
])
```

## Motivation
* Ease burden on CPU (requests pages one at a time)
* Work on Raspberry Pi (tested on 2, 3, 4<sup>[*](./blob/master/raspberry-pi-4-instructions.md)</sup>)
