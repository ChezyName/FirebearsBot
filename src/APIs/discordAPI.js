const { Client, SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, GatewayIntentBits, ActionRow, ModalAssertions, ModalBuilder } = require("discord.js")
const { REST } = require('@discordjs/rest');

class DiscordBot{
    constructor(apiKey,channelID,onReadyFunc,baseurl){
        this.key = apiKey;
        this.matchNumber = 0;
        this.url = baseurl;
        this.client = new Client({intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildMessages,
        ]});

        this.client.login(apiKey);

        //rest api of discord for commands
        this.rest = new REST({ version: '10' }).setToken(apiKey);

        let onClientLoaded = () => {
            console.log('Bot Has Loaded Up...');
            this.client.user.setActivity("For Matches!", { type: "WATCHING"})
            this.client.user.setStatus("idle");
            this.channel = this.client.channels.cache.get(channelID);
            this.hasLoaded = true;
            this.client.user.setPresence({
                game: { name: 'Watching For TBA Api Changes...' },
                status: 'idle',
            });
            onReadyFunc();
        }

        this.client.on('ready', onClientLoaded.bind(this))
    }

    async createButtonsFromMatch(matchNum,matchData){
        let bTeam = matchData["blue"];
        let rTeam = matchData["red"];
        let baseUrl = this.url;

        this.matchNumber = matchNum;

        const blueRow = new ActionRowBuilder()
        const redRow = new ActionRowBuilder()

        for(var i = 0; i < bTeam.length; i++){
            let r = rTeam[i];
            let b = bTeam[i];

            redRow.addComponents(
                new ButtonBuilder()
                    .setCustomId(r['key'])
                    .setLabel(r['nickname'])
                    .setStyle(ButtonStyle.Danger)
            )

            blueRow.addComponents(
                new ButtonBuilder()
                    .setCustomId(b['key'])
                    .setLabel(b['nickname'])
                    .setStyle(ButtonStyle.Primary)
            )
        }

        let msg = await this.channel.send({ content: `Scouting Teams For Match #${matchNum}`, components: [blueRow,redRow] });
        const buttonFilter = (btnInt) => {
            return btnInt.user.id == btnInt.user.id;
        }

        let onButtonClicked = async (buttonInteraction) => {
            //console.log(buttonInteraction.customId);
            await buttonInteraction.reply({content: `${this.url}/?team=${buttonInteraction.customId}&match=${matchNum}`,ephemeral: true});

            for(var i = 0; i < redRow.components.length; i++){
                let rButton = redRow.components[i];
                let bButton = blueRow.components[i];

                if(rButton.data['custom_id'] == buttonInteraction.customId){
                    //console.log("Button Found: " + rButton.data['custom_id']);
                    redRow.components[i].setDisabled(true);
                    redRow.components[i].setLabel(`Taken: @${buttonInteraction.user.username}`);
                }
                else if(bButton.data['custom_id'] == buttonInteraction.customId){
                    //console.log("Button Found: " + bButton.data['custom_id']);
                    blueRow.components[i].setDisabled(true);
                    blueRow.components[i].setLabel(`Taken: @${buttonInteraction.user.username}`);
                }
            }

            msg.edit({ content: `Scouting Teams For Match #${matchNum}`, components: [blueRow,redRow] });
        }

        const collector = this.channel.createMessageComponentCollector({buttonFilter, max: 250, time: 1000 * 45});
        collector.on('collect', onButtonClicked.bind(this));

        console.log("Created Buttons For Match #" + matchNum);
    }
}

module.exports = {DiscordBot}