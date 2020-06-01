import { HttpResponse, HttpRequest, EmailValidator, Controller } from '../protocols'
import { InvalidParamError, MissingParamError } from '../errors'
import { badRequest, serverError } from '../helpers/httpHelper'
import { AddAccount } from '../../domain/usecases/addAccount'

class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount

  constructor (emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = ['nome', 'email', 'senha', 'confirmacaoSenha']

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const { nome, senha, confirmacaoSenha, email } = httpRequest.body

      if (senha !== confirmacaoSenha) {
        return badRequest(new InvalidParamError('confirmacaoSenha'))
      }

      const isValid = this.emailValidator.isValid(email)

      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }

      this.addAccount.add({
        nome,
        email,
        senha
      })
    } catch (error) {
      return serverError()
    }
  }
}

export default SignUpController
