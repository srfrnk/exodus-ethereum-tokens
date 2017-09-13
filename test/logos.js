'use strict'
const test = require('tape')
const fs = require('fs')
const path = require('path')
const assets = require('../')

const getLogo = (name) => path.join(__dirname, '..', 'logos', name + '.png')

test('logos', (t) => {
  for (const asset of assets) {
    t.true(fs.existsSync(getLogo(asset.name)), `${asset.name} logo exists`)
  }

  t.end()
})
