import { DbAddAccount } from './dbAddAccount'

describe('dbAddAccount UseCase', () => {
  test('deve chamar o encrypter com uma senha correta', async () => {
    class EncrypterStub {
      async encrypt (value: string): Promise<string> {
        return 'senha_encriptografada'
      }
    }

    const encrypterStub = new EncrypterStub()
    const dbAccount = new DbAddAccount(encrypterStub)
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')

    const accountData = {
      nome: 'nomevalido',
      email: 'emailvalido',
      senha: 'senhavalida'
    }
    await dbAccount.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith('senhavalida')
  })
})
