const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong! With [DATA A]'),
	async execute(interaction,TBAAPI) {
		await interaction.reply('Pong! by @ ' + data);
	},
};