import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcryptAdapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return 'hash'
  }
}))

const bcryptSalt = 12

const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(bcryptSalt)
}

describe('bcryptAdapter', () => {
  test('deve chamar o bcrypt com o valor correto', async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')

    await sut.encrypt('senha')
    expect(hashSpy).toHaveBeenCalledWith('senha', bcryptSalt)
  })

  test('deve retornar a hash gerada no bcrypt', async () => {
    const sut = makeSut()
    const hash = await sut.encrypt('senha')

    expect(hash).toBe('hash')
  })
})
