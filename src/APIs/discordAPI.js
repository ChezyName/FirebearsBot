const { Client, SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, GatewayIntentBits, ActionRow } = require("discord.js")
const { REST } = require('@discordjs/rest');

let redAllienceButton = new ButtonBuilder()
    .setCustomId("ID")
    .setLabel("RedButton")
    .setStyle(ButtonStyle.Danger);

let blueAllienceButton = new ButtonBuilder()
    .setCustomId("ID")
    .setLabel("BlueButton")
    .setStyle(ButtonStyle.Primary);

class DiscordBot{
    constructor(apiKey,channelID,onReadyFunc){
        this.key = apiKey;
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
        
        this.client.once('ready', onClientLoaded.bind(this));
    }

    async createModalWindow(teamName,teamNumber,matchNumber){
        const modal = new ModalBuilder()
            .setCustomId(teamNumber+'-'+matchNumber)
            .setTitle('Team ' + teamName + " Scouting Confirm?");
    }

    async createButtonsFromMatch(matchNum,matchData,website){
        let bTeam = matchData["blue"];
        let rTeam = matchData["red"];

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

        this.channel.send({ content: `Scouting Teams For Match #${matchNum}`, components: [blueRow,redRow] });
    }
}

module.exports = {DiscordBot}