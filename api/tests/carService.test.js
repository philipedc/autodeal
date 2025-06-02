
const CarService = require('../../services/carService');
const Car = require('../../models/Car');
const NotFoundError = require('../../utils/errors/NotFoundError');
const path = require('path');

jest.mock('../../models/Car');

describe('CarService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('create: deve criar um carro com dados válidos', async () => {
        const mockBody = {
            nome: 'Fiat Uno',
            descricao: 'Carro econômico',
            preco: 15000,
            ano: 2015,
            quilometragem: 50000,
            idVendedor: 1
        };
        const mockFotoPath = 'uploads/carro1.jpg';
        const mockCreatedCar = { id: 1, ...mockBody, foto: mockFotoPath };

        Car.create.mockResolvedValue(mockCreatedCar);

        const result = await CarService.create(mockBody, mockFotoPath);

        expect(Car.create).toHaveBeenCalledWith({
            foto: mockFotoPath,
            ...mockBody
        });
        expect(result).toEqual(mockCreatedCar);
    });

    test('create: deve lançar erro se o ano for inválido', async () => {
        const mockBody = {
            nome: 'Fusca',
            descricao: 'Antigo',
            preco: 5000,
            ano: 1800,
            quilometragem: 100000,
            idVendedor: 1
        };
        const mockFotoPath = null;

        await expect(CarService.create(mockBody, mockFotoPath))
            .rejects
            .toThrow("Ano inválido: informe um valor entre 1886 e " + new Date().getFullYear());
    });

    test('create: deve lançar erro se a quilometragem for inválida', async () => {
        const mockBody = {
            nome: 'Celta',
            descricao: 'Compacto',
            preco: 12000,
            ano: 2010,
            quilometragem: -100,
            idVendedor: 1
        };
        const mockFotoPath = null;

        await expect(CarService.create(mockBody, mockFotoPath))
            .rejects
            .toThrow("Quilometragem inválida: deve ser um número positivo.");
    });

    test('getAllCars: deve retornar todos os carros disponíveis', async () => {
        const mockCars = [
            { id: 1, nome: 'Uno', available: true },
            { id: 2, nome: 'Gol', available: true }
        ];

        Car.findAll.mockResolvedValue(mockCars);

        const result = await CarService.getAllCars();

        expect(Car.findAll).toHaveBeenCalledWith({ where: { available: true } });
        expect(result).toEqual(mockCars);
    });

    test('getCarById: deve retornar o carro quando encontrado', async () => {
        const mockCar = { id: 1, nome: 'Palio' };

        Car.findByPk.mockResolvedValue(mockCar);

        const result = await CarService.getCarById(1);

        expect(Car.findByPk).toHaveBeenCalledWith(1);
        expect(result).toEqual(mockCar);
    });

    test('getCarById: deve lançar NotFoundError quando o carro não for encontrado', async () => {
        Car.findByPk.mockResolvedValue(null);

        await expect(CarService.getCarById(999))
            .rejects
            .toThrow(NotFoundError);
    });

    test('getPhoto: deve retornar o caminho completo da foto do carro', async () => {
        const mockCar = { id: 1, foto: 'uploads/carro1.jpg' };
        const expectedPath = path.join('uploads/carro1.jpg');

        Car.findByPk.mockResolvedValue(mockCar);

        const result = await CarService.getPhoto(1);

        expect(Car.findByPk).toHaveBeenCalledWith(1);
        expect(result).toEqual(expectedPath);
    });

    test('getPhoto: deve lançar NotFoundError quando o carro não tiver uma foto ou não for encontrado', async () => {
        Car.findByPk.mockResolvedValue(null);

        await expect(CarService.getPhoto(999))
            .rejects
            .toThrow(NotFoundError);
    });
});
