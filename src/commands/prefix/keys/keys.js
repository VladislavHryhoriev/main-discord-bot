const { Message, PermissionFlagBits } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri =
	'mongodb+srv://looming:Mcf3FugKUSGGcVP1@cluster0.fnp4bka.mongodb.net/?retryWrites=true&w=majority';

const client = new MongoClient(uri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
});

const sendKey = async (channel) => {
	try {
		await client.connect();
		const db = client.db('csgo-keys').collection('keys');
		key = await db.findOne().then((item) => item.key);
		await db.deleteOne({ key: key });

		channel.send(key);
	} finally {
		await client.close();
	}
};

function scheduleNextRun(channel) {
	// Устанавливаем таймер для следующего запуска через 24 часа
	setTimeout(() => {
		sendKey(channel);
		// После первого запуска устанавливаем интервал каждые 24 часа
		// setInterval(() => sendKey(channel), 24 * 60 * 60 * 1000);
		setInterval(() => sendKey(channel), 24 * 60 * 60 * 1000);
	}, timeUntilNextRun());
}

function timeUntilNextRun() {
	// Вычисляем время до следующего запуска относительно текущего времени
	const now = new Date();
	const nextRun = new Date(now);
	const hour = 15;
	const minutes = 22;
	nextRun.setHours(hour, minutes, 0, 0); // Устанавливаем время следующего запуска в 24:00:00

	// Если текущее время уже прошло время следующего запуска для сегодня, то добавляем 24 часа
	if (now > nextRun) {
		nextRun.setDate(nextRun.getDate() + 1);
	}

	return nextRun - now;
}

module.exports = {
	structure: {
		name: 'senderKeysOn',
		description: '',
		aliases: ['sk'],
		permissions: null,
	},

	run: async (client, message, args) => {
		const CHANNEL_ID = '418179683952099334';
		const channel = await client.channels.fetch(CHANNEL_ID);

		scheduleNextRun(channel);
		return message.reply(``);
	},
};
