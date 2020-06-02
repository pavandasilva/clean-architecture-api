import { DbAddAccount } from './dbAddAccount'
import {
  Encrypter,
  AddAccountModel,
  AccountModel,
  AddAccountRepository
} from './dbAddAccountProtocols'

interface SutTypes {
  sut: DbAddAccount
  encrypterStube: Encrypter
  addAccountRepositoryStub: AddAccountRepository
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return 'password_encriptografada'
    }
  }
  return new EncrypterStub()
}

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (account: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: 'id_valido',
        name: 'name_valido',
        email: 'email_valido',
        password: 'password_criptografada'
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
  test('deve chamar o encrypter com uma password correta', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')

    const accountData = {
      name: 'namevalido',
      email: 'emailvalido',
      password: 'passwordvalida'
    }
    await sut.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith('passwordvalida')
  })

  test('deve retornar uma excessão se o Encrypter tiver uma excessão', async () => {
    const { sut, encrypterStub } = makeSut()
    jest
      .spyOn(encrypterStub, 'encrypt')
      .mockReturnValueOnce(Promise.reject(new Error()))

    const accountData = {
      name: 'namevalido',
      email: 'emailvalido',
      password: 'passwordvalida'
    }
    const promise = sut.add(accountData)
    await expect(promise).rejects.toThrow()
  })

  test('deve chamar AddAccountRepository com os valores corretos', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')

    const accountData = {
      name: 'namevalido',
      email: 'emailvalido',
      password: 'passwordvalida'
    }

    await sut.add(accountData)

    expect(addSpy).toHaveBeenCalledWith({
      name: 'namevalido',
      email: 'emailvalido',
      password: 'password_encriptografada'
    })
  })

  test('deve retornar uma excessão se o addAccountRepositoryStub tiver uma excessão', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest
      .spyOn(addAccountRepositoryStub, 'add')
      .mockReturnValueOnce(Promise.reject(new Error()))

    const accountData = {
      name: 'namevalido',
      email: 'emailvalido',
      password: 'passwordvalida'
    }
    const promise = sut.add(accountData)
    await expect(promise).rejects.toThrow()
  })

  test('deve retornar o account cadastrado', async () => {
    const { sut } = makeSut()

    const accountData = {
      name: 'name_valido',
      email: 'email_valido',
      password: 'password_valida'
    }
    const account = await sut.add(accountData)

    expect(account).toEqual({
      id: 'id_valido',
      name: 'name_valido',
      email: 'email_valido',
      password: 'password_criptografada'
    })
  })
})
