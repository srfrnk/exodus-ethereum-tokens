'use strict'
const test = require('tape')
const fs = require('fs')
const path = require('path')
const assets = require('../')

const getLogoPNG = (name) => path.join(__dirname, '..', 'logos', name + '.png')
const getLogoSVG = (name) => path.join(__dirname, '..', 'logos', name + '.svg')

test('logos', (t) => {
  for (const asset of assets) {
    t.true(fs.existsSync(getLogoPNG(asset.name)) || fs.existsSync(getLogoSVG(asset.name)), `${asset.name} logo exists`)
  }

  t.end()
})
