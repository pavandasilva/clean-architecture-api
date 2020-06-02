import { MongoHelper } from '../helpers/mongoHelper'
import { AccountMongoRepository } from './acccount'

describe('accountRepository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('deve retornar um account quando os dados forem inseridos ', async () => {
    const sut = new AccountMongoRepository()

    const account = await sut.add({
      nome: 'nome',
      email: 'email',
      senha: 'senha'
    })

    const { id, nome, email, senha } = account

    expect(account).toBeTruthy()
    expect(id).toBeTruthy()
    expect(nome).toBe('nome')
    expect(email).toBe('email')
    expect(senha).toBe('senha')
  })
})
