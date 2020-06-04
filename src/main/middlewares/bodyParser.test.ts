import request from 'supertest'

import app from '../config/app'

describe('BodyParser Middleware', () => {
  test('deve parsear um json', async () => {
    app.post('/test_body_parser', (req, res) => {
      res.send(req.body)
    })

    await request(app)
      .post('/test_body_parser')
      .send({ name: 'name' })
      .expect({ name: 'name' })
  })
})
