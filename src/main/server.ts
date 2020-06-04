import app from './config/app'

const serverPort = 5050

app.listen(serverPort, () =>
  console.log(`Servidor rodando na porta ${serverPort}`)
)
