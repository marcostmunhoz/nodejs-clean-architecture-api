import request from 'supertest'
import app from '../config/app'

describe('SignUp Routes', () => {
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
