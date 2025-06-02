const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const User = require('./User');

class Car extends Model { }

Car.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descricao: {
        type: DataTypes.STRING,
        allowNull: false
    },
    preco: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    foto: {
        type: DataTypes.STRING,
        allowNull: true
    },
    available: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    idVendedor: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: 'CASCADE'
    }
}, {
    sequelize,
    modelName: 'Car',
    tableName: 'cars',
    timestamps: true
});

module.exports = Car;
