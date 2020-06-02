import { AddAccount, AddAccountModel, AccountModel, Encrypter, AddAccountRepository } from './dbAddAccountProtocols'

export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter
  private readonly addAccountRepository: AddAccountRepository

  constructor (encrypter: Encrypter, addAccountRepository: AddAccountRepository) {
    this.encrypter = encrypter
    this.addAccountRepository = addAccountRepository
  }

  async add (account: AddAccountModel): Promise<AccountModel> {
    const hashedSenha = await this.encrypter.encrypt(account.senha)
    await this.addAccountRepository.add({ ...account, senha: hashedSenha })
    return null
  }
}
