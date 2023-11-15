const { getFile } = require('../utils/getFile');
const fs = require('fs');

const clearKeys = async (interaction) => {
	const { fileData, filePath } = getFile();

	fs.writeFileSync(filePath, '', async (error) => console.log(error));

	await interaction.reply({
		content: `Deleted: ${fileData.length} keys`,
		ephemeral: true,
	});
};

module.exports = { clearKeys };
