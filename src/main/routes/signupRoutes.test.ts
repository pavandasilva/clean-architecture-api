import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongoHelper'

describe('SignUp Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  test('deve cadastrar uma conta e retornar os dados', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'myname',
        email: 'myemail@emai.com',
        password: '1234',
        passwordConfirmation: '1234'
      })
      .expect(200)
  })
})
