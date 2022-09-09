const fs = require('fs');
const path = require('node:path');

const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Lists all available commands'),
    async execute(interaction) {
        let str = "All Avalible Commands: \n"

        const commandPath = path.join(__dirname,'..','commands');
        const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const filePath = path.join(commandPath, file);
            const command = require(filePath);
            str += "```Name: " + command.data.name + "\nDesc: " + command.data.description + ".```";
        }

        return interaction.reply({
            content: str,
            ephemeral: true,
        });
    },
};