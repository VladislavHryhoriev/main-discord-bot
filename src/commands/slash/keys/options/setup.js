const { deleteKey } = require('../utils/deleteKey');
const { getFile } = require('../utils/getFile');

let timeoutTimer;
let intervalTimer;

const sendKeyInChat = async (channel) => {
	try {
		const { fileData } = getFile();

		if (fileData.length - 1 > 0) {
			const key = fileData[fileData.length - 1];
			deleteKey();
			await channel.send(`${key}`);
		} else {
			clearTimers();

			await channel.send('Пустая база, раздача остановлена');
		}
	} catch (e) {
		console.log(e);
	}
};

const scheduleNextRun = (interaction, channel) => {
	timeoutTimer = setTimeout(() => {
		sendKeyInChat(interaction, channel);

		intervalTimer = setInterval(() => sendKeyInChat(channel), 5000);
	}, timeUntilNextRun(interaction));
};

const timeUntilNextRun = (interaction) => {
	const now = new Date();
	const nextRun = new Date(now);
	nextRun.setHours(
		interaction.options.getNumber('hours'),
		interaction.options.getNumber('minutes'),
		0,
		0
	);

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
