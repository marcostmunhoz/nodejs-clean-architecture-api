import MongoHelper, { MongoHelperSingleton, MongoHelperSingleton as sut } from './mongo-helper'

// @ts-expect-error
MongoHelper.setUrl(global.__MONGO_URI__ as string)

interface SampleEntity {
  id: string
  someProp: any
}

describe('Mongo Helper', () => {
  beforeAll(async () => await sut.connect())

  afterAll(async () => await sut.disconnect())

  afterEach(() => jest.clearAllMocks())

  test('Should reconnect if trying to get collection after disconnecting', async () => {
    // given
    const connectSpy = jest.spyOn(MongoHelperSingleton, 'connect')
    await MongoHelperSingleton.disconnect()

    // when
    await MongoHelperSingleton.getCollection('some_collection')

    // then
    expect(connectSpy).toHaveBeenCalled()
  })

  test('Should not reconnect if trying to get collection while connected', async () => {
    // given
    const connectSpy = jest.spyOn(MongoHelperSingleton, 'connect')

    // when
    await MongoHelperSingleton.getCollection('some_collection')

    // then
    expect(connectSpy).not.toHaveBeenCalled()
  })

  test('Should disconnect if connecting with forceReconnect = true', async () => {
    // given
    const disconnectSpy = jest.spyOn(MongoHelperSingleton, 'disconnect')

    // when
    await MongoHelperSingleton.connect(true)

    // then
    expect(disconnectSpy).toHaveBeenCalled()
  })

  test('Should map document to given type via mapToEntity', async () => {
    // given
    const document = {
      _id: 'some_random_id',
      someProp: 'some_value'
    }

    // when
    const mapped = MongoHelper.mapToEntity<SampleEntity>(document)

    // then
    expect(mapped.id).toEqual(document._id)
    expect(mapped.someProp).toEqual(document.someProp)
  })
})
