'use strict'
const test = require('tape')
const eUtil = require('ethereumjs-util')
const fetch = require('node-fetch')
const assets = require('../')

test('assets', (t) => {
  t.test('assets order', (t) => {
    const keys = Object.values(assets).map((asset) => asset.name)
    t.same(keys, Array.from(keys).sort(), 'assets defined in alphabetical order')

    t.end()
  })

  fetch('https://shapeshift.io/getcoins').then((res) => res.json()).then((coins) => {
    for (const asset of assets) {
      t.test(`validate ${asset.name}`, (t) => {
        // name
        t.true(typeof asset.name === 'string' && asset.name.length > 0, 'checking name')

        // properName
        t.true(typeof asset.properName === 'string' && asset.properName.length > 0, 'checking properName')

        // decimals
        t.true(Number.isFinite(asset.decimals) && asset.decimals >= 0, 'checking decimals')

        // displayUnit
        t.true(typeof asset.displayUnit === 'string' && asset.displayUnit.length > 0, 'checking displayUnit')

        // shapeShiftUnit
        t.true(typeof asset.shapeShiftUnit === 'string', 'checking shapeShiftUnit')
        if (asset.shapeShiftUnit !== '') {
          const coin = coins[asset.shapeShiftUnit.toUpperCase()]
          t.ok(coin, 'shapeShiftUnit should exist')
        }

        // contract
        t.true(typeof asset.addresses === 'object', 'checking addresses')
        t.true(eUtil.isValidChecksumAddress(asset.addresses.current), 'checking addresses.current')
        if (asset.addresses.previous) {
          t.true(Array.isArray(asset.addresses.previous), 'checking addresses.previous')
          for (const address of asset.addresses.previous) {
            t.true(eUtil.isValidChecksumAddress(address), `checking addresses.previous ${address}`)
          }
        }

        // color
        t.true(/#[0-9A-F]{6}/.test(asset.color), 'checking color')

        t.end()
      })
    }

    t.end()
  })
})
