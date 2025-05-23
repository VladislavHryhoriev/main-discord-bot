const {
	Client,
	Partials,
	Collection,
	GatewayIntentBits,
} = require('discord.js');
const config = require('../config');
const commands = require('../handlers/commands');
const events = require('../handlers/events');
const deploy = require('../handlers/deploy');
const mongoose = require('../handlers/mongoose');
const components = require('../handlers/components');
const { ActivityType } = require('discord.js');

module.exports = class extends Client {
	collection = {
		interactioncommands: new Collection(),
		prefixcommands: new Collection(),
		aliases: new Collection(),
		components: {
			buttons: new Collection(),
			selects: new Collection(),
			modals: new Collection(),
		},
	};
	applicationcommandsArray = [];

	constructor() {
		super({
			intents: [Object.keys(GatewayIntentBits)],
			partials: [Object.keys(Partials)],
			presence: {
				activities: [
					{
						name: 'Counter-Strike 3',
						type: ActivityType.Competing,
						state: '...',
						url: 'https://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/730/f75dd04fa12445a8ec43be65fa16ff1b8d2bf82e.jpg',
					},
				],
			},
		});
	}

	start = async () => {
		commands(this);
		events(this);
		components(this);
		if (config.handler.mongodb.toggle) mongoose();

		await this.login(process.env.CLIENT_TOKEN || config.client.token);

		if (config.handler.deploy) deploy(this, config);
	};
};
