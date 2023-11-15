const { client } = require('../../../../mongodb/setupClient');
const { deleteKey } = require('../utils/deleteKey');
const { getFile } = require('../utils/getFile');

let timeoutTimer;
let intervalTimer;

const sendKeyInChat = async (channel) => {
	try {
		const { fileData } = getFile();

		console.log(fileData.length);

		if (fileData.length - 1 > 0) {
			const key = fileData[fileData.length - 1];
			console.log(key);
			await channel.send(`${key}`);
			deleteKey();
		} else {
			await channel.send('Пустая база, раздача остановлена');
			clearTimers();
		}
	} catch (e) {
		console.log(e);
	}
};

const scheduleNextRun = (interaction, channel) => {
	// Устанавливаем таймер для следующего запуска через 24 часа
	timeoutTimer = setTimeout(() => {
		sendKeyInChat(interaction, channel);

		// const timer = setInterval(() => sendKey(), 24 * 60 * 60 * 1000);
		intervalTimer = setInterval(() => sendKeyInChat(channel), 5000);
	}, timeUntilNextRun(interaction));
};

const timeUntilNextRun = (interaction) => {
	// Вычисляем время до следующего запуска относительно текущего времени
	const now = new Date();
	const nextRun = new Date(now);
	nextRun.setHours(
		interaction.options.getNumber('hours'),
		interaction.options.getNumber('minutes'),
		0,
		0
	);

	// Если текущее время уже прошло время следующего запуска для сегодня, то добавляем 24 часа
	if (now > nextRun) {
		nextRun.setDate(nextRun.getDate() + 1);
	}

	return nextRun - now;
};

const setup = async (interaction, channel) => {
	scheduleNextRun(interaction, channel);

	await interaction.reply({
		content: `Раздача запущена`,
		ephemeral: true,
	});
};

const clearTimers = () => {
	clearTimeout(timeoutTimer);
	clearInterval(intervalTimer);
};

module.exports = { setup, clearTimers };
