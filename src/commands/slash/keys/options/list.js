const { getFile } = require('../utils/getFile');

const list = async (interaction) => {
	const { fileData } = getFile();

	const textarea = `\`\`\`${fileData.join('\n')}\`\`\``;

	await interaction.reply({
		content: `Кол-во ключей: ${fileData.length || 0}\n${textarea}`,
		ephemeral: true,
	});
};

module.exports = { list };
