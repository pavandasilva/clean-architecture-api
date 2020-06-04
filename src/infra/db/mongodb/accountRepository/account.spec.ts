import { MongoHelper } from '../helpers/mongoHelper'
import { AccountMongoRepository } from './acccount'

describe('accountRepository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository()
  }

  test('deve retornar um account quando os dados forem inseridos', async () => {
    const sut = makeSut()

    const account = await sut.add({
      name: 'name',
      email: 'email',
      password: 'password'
    })

    const { id, name, email, password } = account

    expect(account).toBeTruthy()
    expect(id).toBeTruthy()
    expect(name).toBe('name')
    expect(email).toBe('email')
    expect(password).toBe('password')
  })
})
