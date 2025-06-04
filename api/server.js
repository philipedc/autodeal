const app = require('./config/express');
require('dotenv').config();

PORT = process.env.PORT;
app.listen(PORT, async () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    try {
        const sequelize = require('./database/index'); 
        await sequelize.authenticate();
        console.log('Database conectada!');
    } catch (error) {
        console.error('Não foi possível conectar à database:', error);
    }
});
