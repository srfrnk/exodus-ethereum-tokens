'use strict'
const test = require('tape')
const fs = require('fs')
const path = require('path')

test('formatting', (t) => {
  const string = fs.readFileSync(path.join(__dirname, '../assets.json'), 'utf8')
  const expectedString = JSON.stringify(JSON.parse(string), null, 2) + '\n'
  t.equal(string, expectedString)
  t.end()
})
