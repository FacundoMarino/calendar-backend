/*
    Events:
    host + /api/events

*/

const { Router } = require('express');
const { check } = require('express-validator');
const {
	getEvents,
	createEvents,
	refreshEvents,
	deleteEvents,
} = require('../controllers/events');
const { isDate } = require('../helpers/isDate');
const { fieldValidator } = require('../middlewares/field-validator');
const { validationJWT } = require('../middlewares/jwt-validator');

const router = Router();

router.use(validationJWT);

router.get('/', getEvents);

router.post(
	'/',
	[
		check('title', 'El título es necesario').not().isEmpty(),
		check('start', 'Start es necesario').custom(isDate),
		check('end', 'End es necesario').custom(isDate),
		fieldValidator,
	],
	createEvents
);

router.put(
	'/:id',
	[
		check('title', 'El título es necesario').not().isEmpty(),
		check('start', 'Start es necesario').custom(isDate),
		check('end', 'End es necesario').custom(isDate),
		fieldValidator,
	],
	refreshEvents
);

router.delete('/:id', deleteEvents);

module.exports = router;
