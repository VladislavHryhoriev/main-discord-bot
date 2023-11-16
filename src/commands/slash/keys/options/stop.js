const { clearTimers } = require('./setup');

const { wait } = require('../utils/wait');


const stop = async (interaction) => {
	clearTimers();

	await interaction.reply({
		content: `Раздача остановлена`,
		ephemeral: true,
	});
	await wait(1000);
	await interaction.deleteReply({
		ephemeral: true,
	});
};

module.exports = { stop };
