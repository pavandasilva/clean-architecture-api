import SignUpController from '../../presentation/controllers/signup/signup'
import { EmailValidatorAdapter } from '../../utils/emailValidatorAdapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/accountRepository/acccount'
import { DbAddAccount } from '../../data/usecases/addaccount/dbAddAccount'
import { BcryptAdapter } from '../../infra/criptography/bcryptAdapter'

export const makeSignUpController = (): SignUpController => {
  const salt = 12
  const emailValidatorAdapter = new EmailValidatorAdapter()
  const bcryptAdapter = new BcryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository)

  return new SignUpController(emailValidatorAdapter, dbAddAccount)
}
