import { HttpResponse, HttpRequest } from '../protocols/http'
import { EmailValidator } from '../protocols/emailValidator'
import { Controller } from '../protocols/controller'

import InvalidParamError from '../errors/invalidParamError'
import ServerError from '../errors/serverError'
import MissingParamError from '../errors/missingParamError'

import { badRequest } from '../helpers/httpHelper'

class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator

  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = ['nome', 'email', 'senha', 'confirmacao_senha']

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const isValid = this.emailValidator.isValid(httpRequest.body.email)

      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }
    } catch (error) {
      return {
        statusCode: 500,
        body: new ServerError()
      }
    }
  }
}

export default SignUpController
