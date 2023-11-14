const { clearTimers } = require('./setup');

const deactive = async (interaction) => {
	clearTimers();
	await interaction.reply({
		content: `Раздача остановлена`,
		ephemeral: true,
	});
};

module.exports = { deactive };
