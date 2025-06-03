const UserService = require('../services/userService');
const User = require('../models/User');
const Car = require('../models/Car');
const bcrypt = require('bcrypt');
const PermissionError = require('../utils/errors/PermissionError');
const NotFoundError = require('../utils/errors/NotFoundError');
const path = require('path');

jest.mock('../models/User');
jest.mock('../models/Car');
jest.mock('../utils/encryptPassword');
jest.mock('bcrypt');

describe('UserService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('update: deve lançar NotFoundError se o usuário não existir', async () => {
        User.findByPk.mockResolvedValue(null);

        await expect(UserService.update(999, { name: 'Novo Nome' }))
            .rejects
            .toThrow(NotFoundError);
        expect(User.findByPk).toHaveBeenCalledWith(999);
    });


    test('updatePassword: deve lançar PermissionError se a senha atual não corresponde', async () => {
        const mockUser = { id: 1, senha: 'existingEncryptedPassword', save: jest.fn() };
        User.findByPk.mockResolvedValue(mockUser);
        bcrypt.compare.mockResolvedValue(false); // senha não corresponde

        const body = { id: 1, atual: 'wrongPassword', nova: 'newPassword' };

        await expect(UserService.updatePassword(body)).rejects.toThrow(PermissionError);
        expect(bcrypt.compare).toHaveBeenCalledWith('wrongPassword', 'existingEncryptedPassword');
        expect(mockUser.save).not.toHaveBeenCalled();
    });

    test('findById: deve retornar o usuário se existir', async () => {
        const mockUser = { id: 1, name: 'Jane' };
        User.findByPk.mockResolvedValue(mockUser);

        const result = await UserService.findById(1);
        expect(User.findByPk).toHaveBeenCalledWith(1);
        expect(result).toEqual(mockUser);
    });

    test('getPhoto: deve retornar o caminho da foto do usuário se existir', async () => {
        const mockUser = { id: 1, foto: 'images/userphoto.jpg' };
        User.findByPk.mockResolvedValue(mockUser);

        const photoPath = await UserService.getPhoto(1);
        expect(User.findByPk).toHaveBeenCalledWith(1);
        expect(photoPath).toBe(path.join('images/userphoto.jpg'));
    });

    test('getAllCars: deve retornar lista de carros do usuário se existirem, caso contrário lança NotFoundError', async () => {
        const mockUser = { id: 2, name: 'User2' };
        const mockCars = [{ id: 10, name: 'Vectra', idVendedor: 2, available: true }];

        User.findByPk.mockResolvedValue(mockUser);
        Car.findAll.mockResolvedValue(mockCars);

        const result = await UserService.getAllCars(2);
        expect(User.findByPk).toHaveBeenCalledWith(2);
        expect(Car.findAll).toHaveBeenCalledWith({
            where: {
                idVendedor: 2,
                available: true
            }
        });
        expect(result).toEqual(mockCars);
    });

});
