const { codeBlock } = require('discord.js');
const { getFile } = require('../utils/getFile');
const { wait } = require('../utils/wait');

const list = async (interaction) => {
	const { fileData } = getFile();

	const textarea = codeBlock('fix', fileData.join('\n') || '0');

	await interaction.reply({
		content: `Кол-во ключей: ${fileData.length}\n${textarea}`,
		ephemeral: true,
	});
	await wait(10000);
	await interaction.deleteReply({ ephemeral: true });
};

module.exports = { list };
