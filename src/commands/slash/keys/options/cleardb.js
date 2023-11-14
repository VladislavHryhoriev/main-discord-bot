const { client } = require('../../../../mongodb/setupClient');

const cleardb = async (interaction) => {
	try {
		await client.connect();
		const db = client.db('csgo-keys').collection('keys');

		await db.deleteMany({});

		await interaction.reply({
			content: `Все ключи удалены`,
			ephemeral: true,
		});
	} catch (e) {
		console.dir(e);
	} finally {
		await client.close();
	}
};

module.exports = { cleardb };
