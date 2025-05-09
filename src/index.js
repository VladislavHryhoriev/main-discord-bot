require('dotenv').config();
const ExtendedClient = require('./class/ExtendedClient');

const client = new ExtendedClient();

client.start();

process.on('unhandledRejection', console.error);
process.on('uncaughtException', console.error);

client.once('ready', async () => {
	console.log('\n' + `[READY] ${client.user.tag} is up and ready to go.`);
});
