import MongoHelper, { MongoHelperSingleton, MongoHelperSingleton as sut } from './mongo-helper'

// @ts-expect-error
MongoHelper.setUrl(global.__MONGO_URI__ as string)

describe('Mongo Helper', () => {
  beforeAll(async () => await sut.connect())

  afterAll(async () => await sut.disconnect())

  test('Should reconnect if trying to get collection after disconnecting', async () => {
    // given
    const connectSpy = jest.spyOn(MongoHelperSingleton, 'connect')
    await MongoHelperSingleton.disconnect()

    // when
    await MongoHelperSingleton.getCollection('some_collection')

    // then
    expect(connectSpy).toHaveBeenCalled()
  })
})
