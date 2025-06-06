const UserService = require('../services/userService');
const User = require('../models/User');
const Car = require('../models/Car');
const bcrypt = require('bcrypt');
const PermissionError = require('../utils/errors/PermissionError');
const NotFoundError = require('../utils/errors/NotFoundError');
const path = require('path');
const encryptPasswordUtil = require('../utils/encryptPassword');

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

    test('create: deve criar um novo usuário com senha criptografada', async () => {
        const body = { name: 'João', email: 'joao@email.com', senha: '123456', fotoPath: 'path/to/photo.jpg' };
        const mockEncrypted = 'encrypted123';
        const createdUser = { id: 1, ...body, senha: mockEncrypted };

        encryptPasswordUtil.mockResolvedValue(mockEncrypted);
        User.create.mockResolvedValue(createdUser);

        const result = await UserService.create(body);

        expect(encryptPasswordUtil).toHaveBeenCalledWith('123456');
        expect(User.create).toHaveBeenCalledWith({
            name: 'João',
            email: 'joao@email.com',
            foto: 'path/to/photo.jpg',
            fotoPath: 'path/to/photo.jpg',
            senha: mockEncrypted
        });
        expect(result).toEqual(createdUser);
        expect(result.senha).toBe(mockEncrypted);
    });

    test('updatePassword: deve atualizar a senha se a atual estiver correta', async () => {
        const mockUser = { id: 1, senha: 'encryptedOld', save: jest.fn() };
        const novaSenhaCriptografada = 'novaSenhaCripto';

        User.findByPk.mockResolvedValue(mockUser);
        bcrypt.compare.mockResolvedValue(true);
        encryptPasswordUtil.mockResolvedValue(novaSenhaCriptografada);

        const body = { id: 1, atual: 'senhaAtual', nova: 'senhaNova' };
        await UserService.updatePassword(body);

        expect(bcrypt.compare).toHaveBeenCalledWith('senhaAtual', 'encryptedOld');
        expect(mockUser.senha).toBe(novaSenhaCriptografada);
        expect(mockUser.save).toHaveBeenCalled();
    });

    test('updatePassword: deve lançar NotFoundError se o usuário não existir', async () => {
        User.findByPk.mockResolvedValue(null);

        const body = {
            id: 999,
            atual: 'senhaQualquer',
            nova: 'novaSenha123'
        };

        await expect(UserService.updatePassword(body))
            .rejects
            .toThrow(NotFoundError);

        expect(User.findByPk).toHaveBeenCalledWith(999);
    });



    test('updatePhoto: deve atualizar a foto do usuário', async () => {
        const mockUser = { update: jest.fn(), id: 1 };
        User.findByPk.mockResolvedValue(mockUser);

        const result = await UserService.updatePhoto(1, 'fotos/nova.jpg');

        expect(User.findByPk).toHaveBeenCalledWith(1);
        expect(mockUser.update).toHaveBeenCalledWith({ foto: 'fotos/nova.jpg' });
        expect(result).toBe(mockUser);
    });

    test('updatePhoto: deve lançar NotFoundError se o usuário não existir', async () => {
        User.findByPk.mockResolvedValue(null);

        await expect(UserService.updatePhoto(999, 'foto/nova.jpg'))
            .rejects
            .toThrow(NotFoundError);
    });

    test('getPhoto: deve lançar NotFoundError se o usuário não existir ou não tiver foto', async () => {
       User.findByPk.mockResolvedValue(null);
       await expect(UserService.getPhoto(1)).rejects.toThrow(NotFoundError);

       User.findByPk.mockResolvedValue({ id: 1, foto: null });
       await expect(UserService.getPhoto(1)).rejects.toThrow(NotFoundError);
    });

    test('update: deve atualizar os dados do usuário exceto senha', async () => {
        const mockUser = { update: jest.fn(), id: 1 };
        User.findByPk.mockResolvedValue(mockUser);

        const result = await UserService.update(1, { name: 'Novo Nome', senha: 'naoDeveAtualizar' });

        expect(User.findByPk).toHaveBeenCalledWith(1);
        expect(mockUser.update).toHaveBeenCalledWith({ name: 'Novo Nome' });
        expect(result).toBe(mockUser);
    });



});
