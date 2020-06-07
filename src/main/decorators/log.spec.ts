import { LogControllerDecorator } from './log'
import { HttpResponse, HttpRequest, Controller } from '../../presentation/protocols'
import { serverError } from '../../presentation/helpers/httpHelper'
import { LogErrorRepository } from '../../data/protocols/logErrorRepository'

interface SutTypes {
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository
}

const makeLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async log (stack: string): Promise<void> {
      return Promise.resolve()
    }
  }

  return new LogErrorRepositoryStub()
}

const makeSut = (): any => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      const httpResponse: HttpResponse = {
        statusCode: 200,
        body: {
          name: 'myname',
          email: 'myemail@email.com',
          password: '1234',
          passwordConfirmation: '1234'
        }
      }
      return httpResponse
    }
  }

  const controllerStub = new ControllerStub()
  const logErrorRepositoryStub = makeLogErrorRepository()

  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)

  return {
    sut,
    controllerStub,
    logErrorRepositoryStub
  }
}

describe('LogController Decorator', () => {
  test('deve repassar a mesma chamada para o controller', async () => {
    const { controllerStub, sut } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')

    const httpRequest = {
      body: {
        name: 'myname',
        email: 'myemail@email.com',
        password: 'mypassword',
        passwordConfirmation: 'mypassword'
      }
    }
    await sut.handle(httpRequest)
    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })

  test('deve retornar o mesmo resultado do controller', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'myname'
      }
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual({
      statusCode: 200,
      body: {
        name: 'myname',
        email: 'myemail@email.com',
        password: '1234',
        passwordConfirmation: '1234'
      }
    })
  })

  test('', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
    const fakeError = new Error()
    fakeError.stack = 'my_error'

    const error = serverError(fakeError)
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'log')

    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(Promise.resolve(error))

    const httpRequest = {
      body: {
        name: 'myname'
      }
    }

    await sut.handle(httpRequest)
    expect(logSpy).toHaveBeenCalledWith(fakeError.stack)
  })
})
