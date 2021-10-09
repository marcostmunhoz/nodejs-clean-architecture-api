// istanbul ignore file

import env from '@/main/config/env'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'

void (async () => {
  await MongoHelper.connect(env.mongoUrl)

  const app = (await import('./config/app')).default

  app.listen(env.port, () => console.log(`Server running at http://localhost:${env.port}`))
})()
