const Car = require('../models/Car');
const path = require('path');
const NotFoundError = require('../utils/errors/NotFoundError');

class CarService {
    async create(body, fotoPath) {
        const { ano, quilometragem, ...carData } = body;

        const anoInt = parseInt(ano);
        const kmInt = parseInt(quilometragem);

        const currentYear = new Date().getFullYear();
        if (isNaN(anoInt) || anoInt < 1900 || anoInt > currentYear + 1) {
            throw new Error(`Ano inválido: informe um valor entre 1900 e ${currentYear + 1}`);
        }

        if (isNaN(kmInt) || kmInt < 0) {
            throw new Error("Quilometragem inválida: deve ser um número positivo.");
        }

        const car = await Car.create({
            foto: fotoPath,
            ano: anoInt,
            quilometragem: kmInt,
            ...carData
        });

        return car;
    }

    async getAllCars() {
        return await Car.findAll({ where: { available: true } });
    }

    async getCarById(id) {
        const car = await Car.findByPk(id);
        if (!car) throw new NotFoundError('Carro não encontrado.');
        return car;
    }

    async getPhoto(id) {
        const car = await Car.findByPk(id);
        if (car && car.foto) {
            return path.join(car.foto);
        }
        throw new NotFoundError('Carro não encontrado.');
    }

    async deleteCar(id) {
        const car = await Car.findByPk(id);
        if (!car) throw new NotFoundError('Carro não encontrado.');
        await car.destroy();
        return { message: 'Carro deletado com sucesso.' };
    }
}

module.exports = new CarService();
