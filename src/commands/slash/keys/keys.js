const {
	ChatInputCommandInteraction,
	SlashCommandBuilder,
	PermissionFlagsBits,
	ChannelType,
} = require('discord.js');

const { setup } = require('./options/setup');
const { addKeys } = require('./options/add');
const { deactive } = require('./options/deactive');
const { cleardb } = require('./options/cleardb');

const ExtendedClient = require('../../../class/ExtendedClient');
const allowedUserIds = ['425759039784484898', '324156252081094657'];

module.exports = {
	structure: new SlashCommandBuilder()
		.setName('keys')
		.setDescription('Запустить отправку ключей каждые 24 часа')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('setup')
				.setDescription('Настроить выдачу ключей')
				.addNumberOption((opt) =>
					opt
						.setName('hours')
						.setDescription('Укажите время для отправки (Часы)')
						.setRequired(true)
				)
				.addNumberOption((opt) =>
					opt
						.setName('minutes')
						.setDescription('Укажите время для отправки (Минуты)')
						.setRequired(true)
				)
				.addChannelOption((opt) =>
					opt
						.setName('channel')
						.setDescription(
							'Укажите id канала в который будут отправляться ключи'
						)
						.setRequired(true)
						.addChannelTypes(ChannelType.GuildText)
				)
		)

		.addSubcommand((subcommand) =>
			subcommand
				.setName('add')
				.setDescription('Добавить ключи')
				.addAttachmentOption((opt) =>
					opt
						.setName('keys')
						.setDescription('Добавьте файл с ключами')
						.setRequired(true)
				)
		)

		.addSubcommand((subcommand) =>
			subcommand.setName('deactive').setDescription('Выключить раздачу')
		)
		.addSubcommand((subcommand) =>
			subcommand.setName('clear').setDescription('Удалить все ключи')
		),

	/**
	 * @param {ExtendedClient} client
	 * @param {ChatInputCommandInteraction} interaction
	 */
	run: async (client, interaction) => {
		if (allowedUserIds.includes(interaction.user.id)) {
			if (interaction.options.getSubcommand() === 'add') {
				addKeys(interaction);
			}

			if (interaction.options.getSubcommand() === 'setup') {
				const id = interaction.options.getChannel('channel').id;
				const channel = client.channels.cache.get(id);

				await setup(interaction, channel);
			}

			if (interaction.options.getSubcommand() === 'deactive') {
				deactive(interaction);
			}

			if (interaction.options.getSubcommand() === 'clear') {
				cleardb(interaction);
			}
		} else {
			interaction.reply({ content: 'Недостаточно прав', ephemeral: true });
		}
	},
};
