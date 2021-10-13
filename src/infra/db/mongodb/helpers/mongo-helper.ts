import { Collection, MongoClient } from 'mongodb'

export default class MongoHelper {
  private static instance: MongoHelper
  private static url: string
  private client: MongoClient|null = null

  private constructor () {}

  private async ensureIsConnected (): Promise<void> {
    if (this.client) {
      return
    }

    await this.connect()
  }

  async connect (forceReconnect = false): Promise<void> {
    if (this.client && forceReconnect) {
      await this.disconnect()
    }

    this.client = await MongoClient.connect(MongoHelper.url)
  }

  async disconnect (): Promise<void> {
    await this.client?.close()
  }

  async getCollection (name: string): Promise<Collection> {
    await this.ensureIsConnected()

    // error ignored because the client wont be undefined after the ensureIsConnected method call
    // @ts-expect-error
    return this.client.db().collection(name)
  }

  static setUrl (url: string): void {
    this.url = url
  }

  static getInstance (): MongoHelper {
    if (!this.instance) {
      this.instance = new MongoHelper()
    }

    return this.instance
  }

  static mapToEntity<T>(document: any): T {
    const { _id, ...documentWithoutId } = document

    return Object.assign({}, documentWithoutId, { id: _id }) as T
  }
}

export const MongoHelperSingleton = MongoHelper.getInstance()
