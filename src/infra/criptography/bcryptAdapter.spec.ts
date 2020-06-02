import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcryptAdapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return 'hash'
  }
}))

describe('bcryptAdapter', () => {
  test('deve chamar o bcrypt com o valor correto', async () => {
    const bcryptSalt = 12
    const sut = new BcryptAdapter(bcryptSalt)
    const hashSpy = jest.spyOn(bcrypt, 'hash')

    await sut.encrypt('senha')
    expect(hashSpy).toHaveBeenCalledWith('senha', bcryptSalt)
  })

  test('deve retornar a hash gerada no bcrypt', async () => {
    const bcryptSalt = 12
    const sut = new BcryptAdapter(bcryptSalt)

    const hash = await sut.encrypt('senha')
    expect(hash).toBe('hash')
  })
})
