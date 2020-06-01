import { HttpResponse, HttpRequest } from '../protocols/http'
import MissingParamError from '../errors/missingParamError'
import { badRequest } from '../helpers/httpHelper'

class SignUpController {
  handle (httpRequest: HttpRequest): HttpResponse {
    if (!httpRequest.body.nome) {
      return badRequest(new MissingParamError('nome'))
    }

    if (!httpRequest.body.email) {
      return badRequest(new MissingParamError('email'))
    }
  }
}

export default SignUpController
