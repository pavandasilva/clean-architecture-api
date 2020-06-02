import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcryptAdapter'

describe('bcryptAdapter', () => {
  test('deve chamar o bcrypt com o valor correto', async () => {
    const bcryptSalt = 12
    const sut = new BcryptAdapter(bcryptSalt)
    const hashSpy = jest.spyOn(bcrypt, 'hash')

    await sut.encrypt('senha')
    expect(hashSpy).toHaveBeenCalledWith('senha', bcryptSalt)
  })
})
