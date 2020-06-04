import express from 'express'

const serverPort = 5050

const app = express()
app.listen(serverPort, () =>
  console.log(`Servidor rodando na porta ${serverPort}`)
)
