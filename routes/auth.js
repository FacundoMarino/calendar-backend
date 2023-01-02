/*
    Auth:
    host + /api/auth

*/

const { Router } = require('express');
const { check } = require('express-validator');

const router = Router();

const { createUser, loginUser, renewToken } = require('../controllers/auth');
const { fieldValidator } = require('../middlewares/field-validator');
const { validationJWT } = require('../middlewares/jwt-validator');

router.post(
	'/register',

	[
		check('name', 'El nombre es obligatorio').not().isEmpty(),
		check('email', 'El email es obligatorio').isEmail(),
		check('password', 'El password debe ser de 6 caracteres').isLength({
			min: 6,
		}),
		fieldValidator,
	],

	createUser
);

router.post(
	'/',
	[
		check('email', 'El email es obligatorio').isEmail(),
		check('password', 'El password debe ser de 6 caracteres').isLength({
			min: 6,
		}),
		fieldValidator,
	],
	loginUser
);

router.get('/renew', validationJWT, renewToken);

module.exports = router;
