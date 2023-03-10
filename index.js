const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { dbConnection } = require('./db/config');

//Crear servidor express
const app = express();

//Base de datos
dbConnection();

//CORS
app.use(cors());

//Directorio público
app.use(express.static('public'));

//Lectura y parseo del body
app.use(express.json());

//Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));

//Escuchar peticiones
app.listen(process.env.PORT, () => {
	console.log('Se levanto en el puerto 4000');
});

app.get('*', (req, res) => {
	res.sendFile(__dirname + '/public/index.html');
});
