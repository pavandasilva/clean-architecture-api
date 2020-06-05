import { MongoHelper } from '../infra/db/mongodb/helpers/mongoHelper'
import env from './config/env'

// eslint-disable-next-line @typescript-eslint/no-floating-promises
MongoHelper.connect(env.mongoUrl).then(async () => {
  const app = (await import('./config/app')).default
  app.listen(env.port, () =>
    console.log(`Servidor rodando na porta ${env.port}`)
  )
})
