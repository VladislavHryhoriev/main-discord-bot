const { client } = require('../../../../mongodb/setupClient');

let timeoutTimer;
let intervalTimer;

const sendKey = async (channel) => {
	try {
		await client.connect();
		const db = client.db('csgo-keys').collection('keys');

		if ((await db.countDocuments()) > 0) {
			key = await db.findOne().then((item) => item.key);

			channel.send(key);

			await db.deleteOne({ key: key });
		} else {
			channel.send('Пустая база, раздача остановлена');
			clearTimers();
		}
	} catch (e) {
		console.log(e);
	} finally {
		await client.close();
	}
};

const scheduleNextRun = (interaction, channel) => {
	// Устанавливаем таймер для следующего запуска через 24 часа
	timeoutTimer = setTimeout(() => {
		sendKey(interaction, channel);

		// const timer = setInterval(() => sendKey(), 24 * 60 * 60 * 1000);
		intervalTimer = setInterval(() => sendKey(channel), 5000);
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
	// sendKey(channel);
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
