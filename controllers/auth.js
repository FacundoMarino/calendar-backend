const { response } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generatedJWT } = require('../helpers/jwt');

const createUser = async (req, res = response) => {
	const { name, email, password } = req.body;

	try {
		let usuario = await User.findOne({ email });

		if (usuario) {
			return res.status(400).json({
				ok: false,
				msg: 'Ya existe un usuario registrado con ese email',
			});
		}

		usuario = new User(req.body);

		//Encriptar contraseña

		const salt = bcrypt.genSaltSync();
		usuario.password = bcrypt.hashSync(password, salt);

		await usuario.save();

		const token = await generatedJWT(usuario.id, usuario.name);

		res.status(201).json({
			ok: true,
			uid: usuario.id,
			name: usuario.name,
			token,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: 'Contactarse con el administrador',
		});
	}
};

const loginUser = async (req, res = response) => {
	const { email, password } = req.body;

	try {
		let usuario = await User.findOne({ email });

		if (!usuario) {
			return res.status(400).json({
				ok: false,
				msg: 'Usuario y contraseña incorrecto',
			});
		}

		const validPassword = bcrypt.compareSync(password, usuario.password);

		if (!validPassword) {
			return res.status(400).json({
				ok: false,
				msg: 'Password Incorrecto',
			});
		}

		const token = await generatedJWT(usuario.id, usuario.name);

		res.status(201).json({
			ok: true,
			uid: usuario.id,
			name: usuario.name,
			token,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: 'Contactarse con el administrador',
		});
	}
};

const renewToken = async (req, res = response) => {
	const { uid, name } = req;

	const token = await generatedJWT(uid, name);

	res.json({
		uid,
		name,
		ok: true,
		token,
	});
};

module.exports = {
	createUser,
	loginUser,
	renewToken,
};
