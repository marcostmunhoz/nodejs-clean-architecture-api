import { AddAccountRepository } from '@/data/protocols'
import { AccountModel } from '@/domain/models/account'
import { AddAccountModel } from '@/domain/usecases/add-account'
import MongoHelper from '../helpers/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository {
  async create (addAccountModel: AddAccountModel): Promise<AccountModel> {
    const collection = await MongoHelper.getInstance().getCollection('accounts')

    const result = await collection.insertOne(addAccountModel)
    const document = await collection.findOne({ _id: result.insertedId })

    return MongoHelper.mapToEntity<AccountModel>(document)
  }
}
