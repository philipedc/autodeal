const Sale = require('../models/Sale');
const Car = require('../models/Car');

const NotFoundError = require('../utils/errors/NotFoundError');

class SaleService {
    async purchase(body) {
        const car = await Car.findByPk(body.idCarro);
        if (car && car.available) {
            car.available = false;
            await car.save();
            const sale = await Sale.create(body);
            return sale;
        } else {
            throw new NotFoundError('Car not found');
        }
    }

    async findAll(id) {
        const sales = await Sale.findAll({
            where: {
                idVendedor: id
            }
        });
        const purchases = await Sale.findAll({
            where: {
                idComprador: id
            }
        });

        sales.forEach(sale => {
            sale.dataValues.sale = 1;
        });
        purchases.forEach(purchase => {
            purchase.dataValues.sale = 0;
        });

        const allSales = sales.concat(purchases);

        return allSales;
    }
}

module.exports = new SaleService;