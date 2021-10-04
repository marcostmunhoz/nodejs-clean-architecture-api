import { Collection, MongoClient } from 'mongodb'

export const MongoHelper = {
  // @ts-expect-error
  client: null as MongoClient,

  async connect (url: string): Promise<void> {
    this.client = await MongoClient.connect(url)
  },

  async disconnect (): Promise<void> {
    await this.client.close()
  },

  getCollection (name: string): Collection {
    return this.client.db().collection(name)
  },

  mapToEntity<T>(document: any): T {
    const { _id, ...documentWithoutId } = document

    return Object.assign({}, documentWithoutId, { id: _id }) as T
  }
}
