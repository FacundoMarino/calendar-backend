const { response } = require('express');
const Events = require('../models/Events');

const getEvents = async (req, resp = response) => {
	const eventos = await Events.find().populate('user', 'name');

	return resp.json({
		ok: true,
		eventos,
	});
};

const createEvents = async (req, resp = response) => {
	const evento = new Events(req.body);

	try {
		evento.user = req.uid;

		const eventoDB = await evento.save();

		return resp.json({
			ok: true,
			evento: eventoDB,
		});
	} catch (error) {
		console.log(error);
		return resp.status(500).json({
			ok: false,
			msg: 'Counicarse con el administrador',
		});
	}
};

const refreshEvents = async (req, resp = response) => {
	const eventId = req.params.id;

	try {
		const evento = await Events.findById(eventId);

		if (!evento) {
			return resp.status(404).json({
				ok: false,
				msg: 'Evento no existe por ese ID',
			});
		}

		if (evento.user.toString() !== req.uid) {
			return resp.status(401).json({
				ok: false,
				msg: 'No tiene permisos para editar este elemento',
			});
		}

		const newEvent = {
			...req.body,
			user: req.id,
		};

		const refreshEvent = await Events.findByIdAndUpdate(eventId, newEvent, {
			new: true,
		});

		return resp.json({
			ok: true,
			event: refreshEvent,
		});
	} catch (error) {
		console.log(error);
		resp.status(500).json({
			ok: false,
			msg: 'Comunicarse con el Administrador',
		});
	}

	return resp.json({
		ok: true,
		eventoId: eventId,
	});
};

const deleteEvents = async (req, resp = response) => {
	const eventId = req.params.id;

	try {
		const evento = await Events.findById(eventId);

		if (!evento) {
			return resp.status(404).json({
				ok: false,
				msg: 'Evento no existe por ese ID',
			});
		}

		if (evento.user.toString() !== req.uid) {
			return resp.status(401).json({
				ok: false,
				msg: 'No tiene permisos para editar este elemento',
			});
		}

		await Events.findByIdAndDelete(eventId);

		return resp.json({
			ok: true,
			msg: 'El evento ha sido removido',
		});
	} catch (error) {
		console.log(error);
		resp.status(500).json({
			ok: false,
			msg: 'Comunicarse con el Administrador',
		});
	}
};

module.exports = {
	getEvents,
	createEvents,
	refreshEvents,
	deleteEvents,
};
