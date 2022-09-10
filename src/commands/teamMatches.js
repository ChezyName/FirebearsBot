const { SlashCommandBuilder } = require('discord.js');

function compare( a, b ) {
    if ( a["match_number"] < b["match_number"] ){
      return -1;
    }
    if ( a["match_number"] > b["match_number"] ){
      return 1;
    }
    return 0;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('geteventmatches')
		.setDescription('Shows All Of Our Matches For The Event Given.')
        .addStringOption(option =>
            option.setName('eventkey')
                .setDescription('The Event Key In Order To Find Our Matches.')
                .setRequired(true)),
	async execute(interaction,TBAAPI) {
        let eventKey = interaction.options.data[0].value;
        let data = await TBAAPI.getOurMatches(eventKey);
        data.sort(compare);
        //console.log(data);
        
        let matches = "Total Matches For Our Team [" + data.length + "]\n";
        matches += "Event: " + eventKey + "\n"
        await interaction.reply(matches);

        for(var i = 0; i < data.length; i++){
            let Match = data[i]
            matches += "```" + "Match #" + Match["match_number"] + ", Level: " + Match["comp_level"] + ".\n";
            
            for(var bt = 0; bt < Match['alliances']['blue']["team_keys"].length; bt++){
                let team = Match['alliances']['blue']["team_keys"][bt]
                let t = await TBAAPI.getTeamInfo(team);
                matches += t["key"] + " - " + t["nickname"] + "\n";
            }


            matches += "\n" + "Red Alliance: \n"
            for(var rt = 0; rt < Match['alliances']['red']["team_keys"].length; rt++){
                let team = Match['alliances']['red']["team_keys"][rt]
                let t = await TBAAPI.getTeamInfo(team);
                matches += t["key"] + " - " + t["nickname"] + "\n";
            }

            matches += "```";
            if(matches.length >= 1){
                matches = "";
            }
            else{
                await interaction.editReply(matches);
            }
        };
	},
};