class ServerError extends Error {
  constructor () {
    super('Erro desconhecido no servidor')
    this.name = 'ServerError'
  }
}

export default ServerError
