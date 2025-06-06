const encryptPassword = require('../utils/encryptPassword');
const bcrypt = require('bcrypt');

jest.mock('bcrypt');

describe('encryptPassword util', () => {
    test('deve chamar bcrypt.hash com a senha e o salt fixo', async () => {
        bcrypt.hash.mockResolvedValue('senhaCriptografada');

        const result = await encryptPassword('minhaSenha');

        expect(bcrypt.hash).toHaveBeenCalledWith('minhaSenha', 10);
        expect(result).toBe('senhaCriptografada');
    });
});
