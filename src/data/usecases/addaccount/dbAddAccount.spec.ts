import { DbAddAccount } from './dbAddAccount'
import { Encrypter, AddAccountModel, AccountModel, AddAccountRepository } from './dbAddAccountProtocols'

interface SutTypes {
  sut: DbAddAccount
  encrypterStube: Encrypter
  addAccountRepositoryStub: AddAccountRepository
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return 'senha_encriptografada'
    }
  }
  return new EncrypterStub()
}

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (account: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: 'id_valido',
        nome: 'nome_valido',
        email: 'email_valido',
        senha: 'senha_criptografada'
      }

      return fakeAccount
    }
  }
  return new AddAccountRepositoryStub()
}

const makeSut = (): any => {
  const encrypterStub = makeEncrypter()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub)

  return {
    sut,
    encrypterStub,
    addAccountRepositoryStub
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

  test('deve retornar uma excessão se o Encrypter tiver uma excessão', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(Promise.reject(new Error()))

    const accountData = {
      nome: 'nomevalido',
      email: 'emailvalido',
      senha: 'senhavalida'
    }
    const promise = sut.add(accountData)
    await expect(promise).rejects.toThrow()
  })

  test('deve chamar AddAccountRepository com os valores corretos', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')

    const accountData = {
      nome: 'nomevalido',
      email: 'emailvalido',
      senha: 'senhavalida'
    }

    await sut.add(accountData)

    expect(addSpy).toHaveBeenCalledWith({
      nome: 'nomevalido',
      email: 'emailvalido',
      senha: 'senha_encriptografada'
    })
  })

  test('deve retornar uma excessão se o addAccountRepositoryStub tiver uma excessão', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(Promise.reject(new Error()))

    const accountData = {
      nome: 'nomevalido',
      email: 'emailvalido',
      senha: 'senhavalida'
    }
    const promise = sut.add(accountData)
    await expect(promise).rejects.toThrow()
  })

  test('deve retornar o account cadastrado', async () => {
    const { sut } = makeSut()

    const accountData = {
      nome: 'nome_valido',
      email: 'email_valido',
      senha: 'senha_valida'
    }
    const account = await sut.add(accountData)

    expect(account).toEqual({
      id: 'id_valido',
      nome: 'nome_valido',
      email: 'email_valido',
      senha: 'senha_criptografada'
    })
  })
})
