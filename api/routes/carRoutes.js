const express = require('express');
const router = express.Router();
const upload = require('../config/multerConfig');
const path = require('path');
const CarService = require('../services/carService');

router.post('/', upload.single('foto'), async (req, res) => {
    try {
        const fotoPath = req.file ? req.file.path : null;
        const car = await CarService.create(req.body, fotoPath);
        res.status(200).send(car);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get('/', async (req, res) => {
    try {
        const cars = await CarService.getAllCars();
        res.send(cars);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const car = await CarService.getCarById(req.params.id);
        res.send(car);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get('/:id/photo', async (req, res) => {
    try {
        const fullPath = await CarService.getPhoto(req.params.id);
        res.sendFile(fullPath, { root: path.join(__dirname, '..') });
    } catch (error) {
        res.status(400).send({ message: 'Erro no servidor ao buscar a foto do carro!' });
    }
});

module.exports = router;
