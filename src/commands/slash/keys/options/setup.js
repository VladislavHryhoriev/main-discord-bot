const { codeBlock, time } = require('discord.js');
const { deleteKey } = require('../utils/deleteKey');
const { getFile } = require('../utils/getFile');
const { wait } = require('../utils/wait');

let timeoutTimer;
let intervalTimer;

const sendKeyInChat = async (client, interaction, channel, nextRunTime) => {
	try {
		const { fileData } = getFile();

		if (fileData.length - 1 < 4) {
			await client.users.send(
				'324156252081094657',
				`Ключи заканчиваются, нужно добавить новые. Осталось ${fileData.length} ключей`
			);
		}

		if (fileData.length - 1 > 0) {
			const key = fileData[fileData.length - 1];

			const embed = {
				color: 0xffaa00,
				title: 'Ежедневный VIP-ключ',
				url: 'https://discord.com/channels/344599230704254980/750681319414956052',
				thumbnail: {
					url: 'https://cdn.discordapp.com/attachments/418179683952099334/1174766837725151253/vip.png?ex=6568c9e0&is=655654e0&hm=1a39a0b9c7d4042781798b661c372be747f6ef038bf13a6496b527c2decdbfdf&',
				},
				fields: [
					{
						name: 'Вставь в консоль в игре находясь на сервере:',
						value: codeBlock('fix', `key ${key}`),
						inline: false,
					},
					{
						name: 'Следующий ключ: ' + time(new Date(nextRunTime), 'R'),
						value: ``,
					},
				],
			};

			deleteKey();
			await channel.send({ embeds: [embed] });
		} else {
			clearTimers();

			await client.users.send(
				'324156252081094657',
				'Ключей нет, раздача остановлена, для запуска повторно используй setup'
			);
		}
	} catch (e) {
		console.log(e);
	}
};

const scheduleNextRun = (client, interaction, channel) => {
	timeoutTimer = setTimeout(() => {
		sendKeyInChat(
			client,
			interaction,
			channel,
			timeUntilNextRun(interaction)[1]
		);

		intervalTimer = setInterval(() => {
			sendKeyInChat(
				client,
				interaction,
				channel,
				timeUntilNextRun(interaction)[1]
			);
			// }, 24 * 60 * 60 * 1000);
		}, 5000);
	}, timeUntilNextRun(interaction)[0]);
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
	return [nextRun - now, nextRun];
};

const setup = async (client, interaction, channel) => {
	scheduleNextRun(client, interaction, channel);

	await interaction.reply({
		content: `Раздача запущена`,
		ephemeral: true,
	});
	await wait(3000);
	await interaction.deleteReply();
};

const clearTimers = () => {
	clearTimeout(timeoutTimer);
	clearInterval(intervalTimer);
};

module.exports = { setup, clearTimers };
