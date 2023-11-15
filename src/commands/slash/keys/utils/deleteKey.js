const { getFile } = require('./getFile');
const fs = require('fs');

const deleteKey = async (interaction) => {
	const { fileData, filePath } = getFile();

	const key = fileData.pop();

	fs.writeFileSync(filePath, fileData.join('\n'), async (error) =>
		console.log(error)
	);
};

module.exports = { deleteKey };
