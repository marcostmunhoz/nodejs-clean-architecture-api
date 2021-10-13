// istanbul ignore file

import env from '@/main/config/env'
import MongoHelper from '@/infra/db/mongodb/helpers/mongo-helper'

void (async () => {
  MongoHelper.setUrl(env.mongoUrl)

  await MongoHelper.getInstance().connect()

  const app = (await import('./config/app')).default

  app.listen(env.port, () => console.log(`Server running at http://localhost:${env.port}`))
})()
