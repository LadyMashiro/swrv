import hash from './hash'
import { keyInterface } from '../types'
interface ICacheItem {
  data: any,
  createdAt: number,
  expiresAt: number
}

export default class SWRVCache {
  private ttl: number
  private items: Map<string, ICacheItem>

  constructor (ttl = 0) {
    this.items = new Map()
    this.ttl = ttl
  }

  /**
   * Get cache item while evicting
   */
  get (k: keyInterface): ICacheItem {
    const [_key] = this.serializeKey(k)
    return this.items.get(_key)
  }

  set (k: keyInterface, v: any, ttl: number) {
    const timeToLive = ttl || this.ttl
    const now = Date.now()
    const [_key] = this.serializeKey(k)
    const item = {
      data: v,
      createdAt: now,
      expiresAt: timeToLive ? now + timeToLive : Infinity
    }

    timeToLive && setTimeout(() => {
      const current = Date.now()
      const hasExpired = current >= item.expiresAt
      if (hasExpired) this.delete(_key)
    }, timeToLive)

    this.items.set(_key, item)
  }

  delete (k: keyInterface) {
    const [_key] = this.serializeKey(k)
    this.items.delete(_key)
  }

  serializeKey (key: keyInterface): [string, any, string] {
    let args = null
    if (typeof key === 'function') {
      try {
        key = key()
      } catch (err) {
        // dependencies not ready
        key = ''
      }
    }

    if (Array.isArray(key)) {
      // args array
      args = key
      key = hash(key)
    } else {
      // convert null to ''
      key = String(key || '')
    }

    const errorKey = key ? 'err@' + key : ''

    return [key, args, errorKey]
  }
}
