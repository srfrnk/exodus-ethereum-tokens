'use strict'
const test = require('tape')
const eUtil = require('ethereumjs-util')
const fetch = require('node-fetch')
const assets = require('../')

function getJSON (url) {
  return fetch(url).then((res) => res.json())
}

async function getAssetDecimals (address) {
  const res = await getJSON(`https://api.etherscan.io/api?module=proxy&action=eth_call&to=${address}&data=0x313ce567`)
  return parseInt(res.result, 16)
}

test('assets', async (t) => {
  t.test('assets order', (t) => {
    const keys = Object.values(assets).map((asset) => asset.name)
    t.same(keys, Array.from(keys).sort(), 'assets defined in alphabetical order')

    t.end()
  })

  for (const asset of assets) {
    t.test(`validate ${asset.name}`, async (t) => {
      // name
      t.true(typeof asset.name === 'string' && asset.name.length > 0, 'checking name')

      // properName
      t.true(typeof asset.properName === 'string' && asset.properName.length > 0, 'checking properName')

      // decimals
      const decimals = await getAssetDecimals(asset.addresses.current)
      if (Number.isNaN(decimals)) t.skip('checking decimals')
      else t.equal(asset.decimals, decimals, 'checking decimals')

      // displayUnit
      t.true(typeof asset.displayUnit === 'string' && asset.displayUnit.length > 0, 'checking displayUnit')

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
