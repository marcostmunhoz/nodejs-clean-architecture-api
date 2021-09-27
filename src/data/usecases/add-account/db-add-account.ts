import { AccountModel, AddAccount, AddAccountModel, Encrypter, AddAccountRepository } from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly encrypter: Encrypter,
    private readonly addAccountRepository: AddAccountRepository
  ) {}

  async execute (addModel: AddAccountModel): Promise<AccountModel> {
    const { name, email } = addModel

    const hashedPassword = await this.encrypter.encrypt(addModel.password)
    const model = await this.addAccountRepository.create({
      name,
      email,
      password: hashedPassword
    })

    return model
  }
}
