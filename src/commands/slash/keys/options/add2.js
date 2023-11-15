const { client } = require('../../../../mongodb/setupClient');

const addKeys = async (interaction) => {
	const file = interaction.options.getAttachment('keys');

	try {
		await client.connect();
		const db = client.db('csgo-keys').collection('keys');

		const data = arr.map((item) => {
			return { key: item };
		});

		await db.insertMany(data);

		await interaction.reply({
			content: `Добавленные ключи:\n ${response}...`,
			ephemeral: true,
		});
	} catch (e) {
		console.dir(e);
	} finally {
		await client.close();
	}
};

module.exports = { addKeys };
