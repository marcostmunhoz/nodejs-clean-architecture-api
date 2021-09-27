import { AccountModel, AddAccount, AddAccountModel, Encrypter } from './db-add-account-protocols'

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
