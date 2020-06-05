export class ServerError extends Error {
  constructor (stack: string) {
    super('Erro desconhecido no servidor')
    this.name = 'ServerError'
    this.stack = stack
  }
}
