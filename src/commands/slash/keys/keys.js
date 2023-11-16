const {
	ChatInputCommandInteraction,
	SlashCommandBuilder,
	PermissionFlagsBits,
	ChannelType,
	EmbedBuilder,
} = require('discord.js');

const ExtendedClient = require('../../../class/ExtendedClient');

const { setup } = require('./options/setup');
const { addKeys } = require('./options/add');
const { list } = require('./options/list');
const { clearKeys } = require('./options/clearKeys');
const { deleteKey } = require('./utils/deleteKey');
const { stop } = require('./options/stop');

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
			subcommand.setName('list').setDescription('Показать все ключи')
		)

		.addSubcommand((subcommand) =>
			subcommand.setName('delete').setDescription('Удалить один ключ')
		)

		.addSubcommand((subcommand) =>
			subcommand.setName('clear').setDescription('Удалить все ключи')
		)

		.addSubcommand((subcommand) =>
			subcommand.setName('stop').setDescription('Остановить раздачу')
		),

	/**
	 * @param {ExtendedClient} client
	 * @param {ChatInputCommandInteraction} interaction
	 */
	run: async (client, interaction) => {
		if (allowedUserIds.includes(interaction.user.id)) {
			console.log(
				`${
					interaction.user.globalName
				} - ${interaction.options.getSubcommand()}`
			);

			if (interaction.options.getSubcommand() === 'add') {
				addKeys(interaction);
			}

			if (interaction.options.getSubcommand() === 'setup') {
				const id = interaction.options.getChannel('channel').id;
				const channel = client.channels.cache.get(id);

				setup(client, interaction, channel);
			}

			if (interaction.options.getSubcommand() === 'list') {
				list(interaction);
			}

			if (interaction.options.getSubcommand() === 'delete') {
				deleteKey(interaction);
			}

			if (interaction.options.getSubcommand() === 'stop') {
				stop(interaction);
			}

			if (interaction.options.getSubcommand() === 'clear') {
				clearKeys(interaction);
			}
		} else {
			interaction.reply({ content: 'Недостаточно прав', ephemeral: true });
		}
	},
};
