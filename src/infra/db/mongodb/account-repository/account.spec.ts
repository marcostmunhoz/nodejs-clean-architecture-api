import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account'

const makeSut = (): AccountMongoRepository => {
  return new AccountMongoRepository()
}

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    // @ts-expect-error
    await MongoHelper.connect(global.__MONGO_URI__ as string)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const collection = MongoHelper.getCollection('accounts')
    await collection.deleteMany({})
  })

  test('Should return an account on success', async () => {
    // given
    const sut = makeSut()
    const data = {
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    }

    // when
    const account = await sut.create(data)

    // then
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe(data.name)
    expect(account.email).toBe(data.email)
    expect(account.password).toBe(data.password)
  })
})
