import { AccountModel } from '@/domain/models/account'
import { AddAccount, AddAccountModel } from '@/domain/usecases/add-account'
import { Encrypter } from '@/data/protocols'

export class DbAddAccount implements AddAccount {
  constructor (private readonly encrypter: Encrypter) {}

  async execute (addModel: AddAccountModel): Promise<AccountModel> {
    const { name, email } = addModel

    const password = await this.encrypter.encrypt(addModel.password)

    return {
      id: 'some_id',
      name,
      email,
      password
    }
  }
}
