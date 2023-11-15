const fs = require('fs');
const path = require('path');

const getFile = () => {
	try {
		const filePath = path.join(__dirname, '../../../../keys.txt');
		const file = fs.readFileSync(filePath, 'utf-8');
		const fileData = file.split('\n');

		return { fileData, filePath };
	} catch (e) {
		console.log(e);
	}
};

module.exports = { getFile };
