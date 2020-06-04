
import { AddAccountModel } from '../../../../domain/usecases/addAccount'
import { AccountModel } from '../../../../domain/models/account'
import { AddAccountRepository } from '../../../../data/protocols/addAccountRepository'
import { MongoHelper } from '../helpers/mongoHelper'

export class AccountMongoRepository implements AddAccountRepository {
  async add (account: AddAccountModel): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(account)

    return MongoHelper.map(result.ops[0])
  }
}
