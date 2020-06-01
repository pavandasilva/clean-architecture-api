import { DbAddAccount } from './dbAddAccount'
import { Encrypter } from '../../protocols/encrypter'

interface SutTypes {
  sut: DbAddAccount
  encrypterStube: Encrypter
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return 'senha_encriptografada'
    }
  }
  return new EncrypterStub()
}

const makeSut = (): any => {
  const encrypterStub = makeEncrypter()
  const sut = new DbAddAccount(encrypterStub)

  return {
    sut,
    encrypterStub
  }
}

describe('dbAddAccount UseCase', () => {
  test('deve chamar o encrypter com uma senha correta', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')

    const accountData = {
      nome: 'nomevalido',
      email: 'emailvalido',
      senha: 'senhavalida'
    }
    await sut.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith('senhavalida')
  })
})
