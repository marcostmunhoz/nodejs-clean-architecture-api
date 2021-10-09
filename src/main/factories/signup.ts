import { SignUpController } from '@/presentation/controllers/signup/signup'
import { EmailValidatorAdapter } from '@/utils/email-validator-adapter'
import { DbAddAccount } from '@/data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '@/infra/cryptography/bcrypt-adapter'
import { AccountMongoRepository } from '@/infra/db/mongodb/account-repository/account'

export const makeSignUpController = (): SignUpController => {
  const BCRYPT_SALT = 12

  const emailValidatorAdapter = new EmailValidatorAdapter()
  const addAccount = new DbAddAccount(
    new BcryptAdapter(BCRYPT_SALT),
    new AccountMongoRepository()
  )

  return new SignUpController(emailValidatorAdapter, addAccount)
}
