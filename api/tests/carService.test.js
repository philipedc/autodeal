const path = require('path');

const CarService = require('../services/carService');
const NotFoundError = require('../utils/errors/NotFoundError');
const Car = require('../models/Car');

jest.mock('../models/Car');

describe('CarService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create()', () => {
    const currentYear = new Date().getFullYear();

    it('deve criar um carro quando os dados forem válidos', async () => {
      const fotoPath = 'uploads/car1.jpg';
      const body = {
        ano: '2022',
        quilometragem: '15000',
        nome: 'Fiesta',
        preco: 20000,
      };

      const carCreated = {
        id: 1,
        foto: fotoPath,
        ano: 2022,
        quilometragem: 15000,
        nome: 'Fiesta',
        preco: 20000,
      };
      Car.create.mockResolvedValue(carCreated);

      const resultado = await CarService.create(body, fotoPath);

      expect(Car.create).toHaveBeenCalledWith({
        foto: fotoPath,
        ano: 2022,
        quilometragem: 15000,
        nome: 'Fiesta',
        preco: 20000,
      });
      expect(resultado).toBe(carCreated);
    });

    it('deve lançar erro quando o ano não for numérico', async () => {
      const body = { ano: 'abcd', quilometragem: '1000', nome: 'Uno', preco: 15000 };
      await expect(CarService.create(body, 'img.jpg')).rejects.toThrow(
        `Ano inválido: informe um valor entre 1900 e ${currentYear + 1}`
      );
    });

    it('deve lançar erro quando o ano for menor que 1900', async () => {
      const body = { ano: '1899', quilometragem: '1000', nome: 'Uno', preco: 15000 };
      await expect(CarService.create(body, 'img.jpg')).rejects.toThrow(
        `Ano inválido: informe um valor entre 1900 e ${currentYear + 1}`
      );
    });

    it('deve lançar erro quando o ano for maior que currentYear+1', async () => {
      const body = { ano: String(currentYear + 2), quilometragem: '1000', nome: 'Uno', preco: 15000 };
      await expect(CarService.create(body, 'img.jpg')).rejects.toThrow(
        `Ano inválido: informe um valor entre 1900 e ${currentYear + 1}`
      );
    });

    it('deve lançar erro quando a quilometragem não for numérica', async () => {
      const body = { ano: '2020', quilometragem: 'xyz', nome: 'Ka', preco: 25000 };
      await expect(CarService.create(body, 'img.jpg')).rejects.toThrow(
        'Quilometragem inválida: deve ser um número positivo.'
      );
    });

    it('deve lançar erro quando a quilometragem for negativa', async () => {
      const body = { ano: '2020', quilometragem: '-5', nome: 'Ka', preco: 25000 };
      await expect(CarService.create(body, 'img.jpg')).rejects.toThrow(
        'Quilometragem inválida: deve ser um número positivo.'
      );
    });
  });

  describe('getAllCars()', () => {
    it('deve retornar todos os carros disponíveis', async () => {
      const carros = [
        { id: 1, available: true },
        { id: 2, available: true },
      ];
      Car.findAll.mockResolvedValue(carros);

      const resultado = await CarService.getAllCars();

      expect(Car.findAll).toHaveBeenCalledWith({ where: { available: true } });
      expect(resultado).toBe(carros);
    });
  });

  describe('getCarById()', () => {
    it('deve retornar o carro quando encontrado', async () => {
      const carro = { id: 42, nome: 'Corolla' };
      Car.findByPk.mockResolvedValue(carro);

      const resultado = await CarService.getCarById(42);

      expect(Car.findByPk).toHaveBeenCalledWith(42);
      expect(resultado).toBe(carro);
    });

    it('deve lançar NotFoundError quando não encontrar o carro', async () => {
      Car.findByPk.mockResolvedValue(null);

      await expect(CarService.getCarById(999)).rejects.toThrow(NotFoundError);
    });
  });

  describe('getPhoto()', () => {
    it('deve retornar o caminho da foto quando existir', async () => {
      const carro = { id: 7, foto: 'uploads/car7.png' };
      Car.findByPk.mockResolvedValue(carro);

      const resultado = await CarService.getPhoto(7);

      expect(Car.findByPk).toHaveBeenCalledWith(7);
      expect(resultado).toBe(path.join(carro.foto));
    });

    it('deve lançar NotFoundError quando o carro não existir', async () => {
      Car.findByPk.mockResolvedValue(null);

      await expect(CarService.getPhoto(123)).rejects.toThrow(NotFoundError);
    });

    it('deve lançar NotFoundError quando o carro existir, mas não tiver foto', async () => {
      const carroSemFoto = { id: 8, foto: null };
      Car.findByPk.mockResolvedValue(carroSemFoto);

      await expect(CarService.getPhoto(8)).rejects.toThrow(NotFoundError);
    });
  });
});
