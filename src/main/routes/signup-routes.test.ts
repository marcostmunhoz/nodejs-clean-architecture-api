import MongoHelper, { MongoHelperSingleton } from '@/infra/db/mongodb/helpers/mongo-helper'
import request from 'supertest'
import app from '../config/app'

// @ts-expect-error
MongoHelper.setUrl(global.__MONGO_URI__ as string)

describe('SignUp Routes', () => {
  beforeAll(async () => {
    await MongoHelperSingleton.connect()
  })

  afterAll(async () => {
    await MongoHelperSingleton.disconnect()
  })

  beforeEach(async () => {
    const collection = await MongoHelperSingleton.getCollection('accounts')
    await collection.deleteMany({})
  })

  test('Should return 201 on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'Marcos',
        email: 'marcos@teste.com',
        password: '12345678',
        passwordConfirmation: '12345678'
      })
      .expect(201)
  })
})
