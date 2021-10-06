import request from 'supertest'
import app from '../config/app'

describe('Content Type Middleware', () => {
  test('Should return default content type as JSON', async () => {
    app.get('/test_content_type_json', (req, res) => {
      res.send()
    })

    await request(app)
      .get('/test_content_type_json')
      .expect('content-type', /json/)
  })

  test('Should return XML content type when explicitly set', async () => {
    app.get('/test_content_type_xml', (req, res) => {
      res.type('xml').send()
    })

    await request(app)
      .get('/test_content_type_xml')
      .expect('content-type', /xml/)
  })
})
