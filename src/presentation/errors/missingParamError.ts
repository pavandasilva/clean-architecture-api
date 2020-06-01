class MissingParamError extends Error {
  constructor (paramName: string) {
    super(`Faltando o parâmetro ${paramName}`)
    this.name = 'MissingParamError'
  }
}

export default MissingParamError
