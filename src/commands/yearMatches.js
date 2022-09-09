const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('getyearmatches')
		.setDescription('Shows All Our Matches For ' + new Date().getFullYear + " Year."),
	async execute(interaction,TBAAPI) {
		let events = await TBAAPI.getYearEvents();
        let msg = "Our Matches For " + new Date().getFullYear() + "\n";
        events.forEach(event => {
            msg = msg + "```" + event["name"] + "\n" + "Dates: " + event['start_date'] + " - " 
            + event["end_date"] + "\n"
            + "Key: " + event["event_code"] + "```"
        });
        await interaction.reply({content: msg, ephemeral: false});
	},
};