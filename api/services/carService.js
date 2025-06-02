const Car = require('../models/Car');
const path = require('path');
const NotFoundError = require('../utils/errors/NotFoundError');

class CarService {
    async create(body, fotoPath) {
        const { ...carData } = body;
        const car = await Car.create({
            foto: fotoPath,
            ...carData
        });

        return car;
    }

    async getAllCars() {
        const cars = await Car.findAll({
            where: { available: true }
        });
        return cars;
    }

    async getCarById(id) {
        const car = await Car.findByPk(id);
        if (car) {
            return car;
        } else {
            throw new NotFoundError('Carro não encontrado.');
        }
    }

    async getPhoto(id) {
        const car = await Car.findByPk(id);
        if (car && car.foto) {
            const fullPath = path.join(car.foto);
            return fullPath;
        } else {
            throw new NotFoundError('Carro não encontrado.');
        }
    }
}

module.exports = new CarService();
