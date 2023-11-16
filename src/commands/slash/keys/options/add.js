const fs = require('fs');
const { getFile } = require('../utils/getFile');
const { wait } = require('../utils/wait');

const addKeys = async (interaction) => {
	const attachment = interaction.options.getAttachment('keys');

	try {
		const response = await fetch(attachment.url).then((data) => data.text());
		const attachmentData = response.split('\r\n');
		const { fileData, filePath } = getFile();

		const collection = new Set(fileData);
		let data = [];

		attachmentData.forEach((item) => collection.add(item));
		collection.forEach((item) => data.push(item));
		data = data.filter((el) => el != '');

		fs.writeFileSync(filePath, data.join('\n'), async (error) =>
			console.log(error)
		);

		await interaction.reply({
			content: `Added ${attachmentData.filter((el) => el != '').length} keys`,
			ephemeral: true,
		});
		await wait(5000);
		await interaction.deleteReply({ ephemeral: true });
	} catch (e) {
		console.dir(e);
	} finally {
	}
};

module.exports = { addKeys };
