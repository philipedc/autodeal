const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Define o diretório de destino
// Se este arquivo de configuração do Multer está em 'api/config/',
// e 'uploads' deve estar em 'api/uploads/', usamos '..' para subir um nível.
const uploadsDir = path.join(__dirname, '..', 'uploads'); // Ajustado para api/uploads/

// Garante que o diretório de uploads exista
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true }); // 'recursive: true' cria diretórios pais se necessário
    console.log(`Diretório criado: ${uploadsDir}`);
} else {
    console.log(`Diretório já existe: ${uploadsDir}`);
}

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, uploadsDir); // Usa o caminho absoluto para api/uploads/
    },
    filename: function(req, file, cb) {
        // Usar um timestamp e a extensão original é uma boa prática
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        // Opcional: Adicionar validação de tipo de arquivo
        const allowedTypes = /jpeg|jpg|png|gif/;
        const mimetype = allowedTypes.test(file.mimetype);
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Erro: Upload de arquivo suporta apenas os seguintes tipos: ' + allowedTypes));
    }
});

module.exports = upload;