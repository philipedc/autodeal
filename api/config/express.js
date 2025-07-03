const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const userRoutes = require('../routes/userRoutes');
const carRoutes = require('../routes/carRoutes');
const saleRoutes = require('../routes/saleRoutes');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

const app = express();

const options = {
    origin: process.env.CORS_ORIGIN || 'http://localhost:8080',
    credentials: true
};
app.use(cors(options));

app.use(cookieParser())
app.use(bodyParser.json())

app.use(express.urlencoded({
    extended: true,
}));


app.use('/users', userRoutes)
app.use('/cars', carRoutes)
app.use('/sales', saleRoutes)

app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Bem-vindo à API Autodeal!'
    });
});

const staticUploadsPath = path.join(__dirname, '..', 'uploads');
console.log(`Servindo arquivos estáticos de: ${staticUploadsPath}`);
app.use('/uploads', express.static(staticUploadsPath));


module.exports = app;