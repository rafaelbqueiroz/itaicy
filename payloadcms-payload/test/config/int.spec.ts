import type { BlockField, Payload } from 'payload'

import path from 'path'
import { fileURLToPath } from 'url'

import type { NextRESTClient } from '../helpers/NextRESTClient.js'

import { initPayloadInt } from '../helpers/initPayloadInt.js'

let restClient: NextRESTClient
let payload: Payload

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

describe('Config', () => {
  beforeAll(async () => {
    ;({ payload, restClient } = await initPayloadInt(dirname))
  })

  afterAll(async () => {
    if (typeof payload.db.destroy === 'function') {
      await payload.db.destroy()
    }
  })

  describe('payload config', () => {
    it('allows a custom field at the config root', () => {
      const { config } = payload
      expect(config.custom).toEqual({
        name: 'Customer portal',
      })
    })

    it('allows a custom field in the root endpoints', () => {
      const [endpoint] = payload.config.endpoints

      expect(endpoint.custom).toEqual({
        description: 'Get the sanitized payload config',
      })
    })
  })

  describe('collection config', () => {
    it('allows a custom field in collections', () => {
      const [collection] = payload.config.collections
      expect(collection.custom).toEqual({
        externalLink: 'https://foo.bar',
      })
    })

    it('allows a custom field in collection endpoints', () => {
      const [collection] = payload.config.collections
      const [endpoint] = collection.endpoints || []

      expect(endpoint.custom).toEqual({
        examples: [{ type: 'response', value: { message: 'hi' } }],
      })
    })

    it('allows a custom field in collection fields', () => {
      const [collection] = payload.config.collections
      const [field] = collection.fields

      expect(field.custom).toEqual({
        description: 'The title of this page',
      })
    })

    it('allows a custom field in blocks in collection fields', () => {
      const [collection] = payload.config.collections
      const [, blocksField] = collection.fields

      expect((blocksField as BlockField).blocks[0].custom).toEqual({
        description: 'The blockOne of this page',
      })
    })
  })

  describe('global config', () => {
    it('allows a custom field in globals', () => {
      const [global] = payload.config.globals
      expect(global.custom).toEqual({ foo: 'bar' })
    })

    it('allows a custom field in global endpoints', () => {
      const [global] = payload.config.globals
      const [endpoint] = global.endpoints || []

      expect(endpoint.custom).toEqual({ params: [{ name: 'name', type: 'string', in: 'query' }] })
    })

    it('allows a custom field in global fields', () => {
      const [global] = payload.config.globals
      const [field] = global.fields

      expect(field.custom).toEqual({
        description: 'The title of my global',
      })
    })
  })

  describe('cors config', () => {
    it('includes a custom header in Access-Control-Allow-Headers', async () => {
      const response = await restClient.GET(`/pages`)
      expect(response.headers.get('Access-Control-Allow-Headers')).toContain('x-custom-header')
    })
  })
})
