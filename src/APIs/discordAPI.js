const { Client, Collection, ActionRowBuilder, ButtonBuilder, ButtonStyle, GatewayIntentBits} = require("discord.js")
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

class DiscordBot{
    constructor(apiKey,channelID,onReadyFunc,baseurl,appID,TBAAPI){
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
        this.rest = new REST({ version: '10' }).setToken(apiKey);
        this.TBA = TBAAPI;

        //Commands all from ./commands folder
        this.commands = [];
        this.commandsExe = new Collection();
        const commandsPath = path.join(__dirname,'..','commands');
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
        console.log("\n\nLoading All Bot Commands...")
        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            const command = require(filePath);
            console.log("-Loaded " + command.data.name);
            this.commands.push(command.data.toJSON());
            this.commandsExe.set(command.data.name,command);
        }

        let onCommand = async (interaction) => {
            if (!interaction.isChatInputCommand()) return;
        
            //console.log("looking for @ " + interaction.commandName);
            const command = this.commandsExe.get(interaction.commandName);
        
            if (!command) return;
        
            try {
                await command.execute(interaction,this.TBA);
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        }

        this.client.on('interactionCreate', onCommand.bind(this));

        //console.log("Commands Length: " + this.commands);
        this.rest.put(Routes.applicationCommands(appID), { body: this.commands })
            .then((data) => console.log(`Successfully registered ${data.length} application command(s).`))
            .catch(console.error);

        console.log("\n");

        //Final Loadings
        let onClientLoaded = () => {
            console.log('Bot Has Loaded Up...');
            this.client.user.setActivity("For Matches!", { type: "WATCHING"})
            this.client.user.setStatus("idle");
            this.channel = this.client.channels.cache.get(channelID);
            this.hasLoaded = true;
            this.client.user.setPresence({
                game: { name: 'Watching For TBA API Changes...' },
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
        const blueLabels = [];
        const redLabels = [];

        for(var i = 0; i < bTeam.length; i++){
            let r = rTeam[i];
            let b = bTeam[i];

            let bName = b['key'].replace("frc","");
            let rName = r['key'].replace("frc","");

            redRow.addComponents(
                new ButtonBuilder()
                    .setCustomId(r['key'])
                    .setLabel(r['nickname'] + ":" + rName)
                    .setStyle(ButtonStyle.Danger)
            )
            

            blueRow.addComponents(
                new ButtonBuilder()
                    .setCustomId(b['key'])
                    .setLabel(b['nickname'] + ":" + bName)
                    .setStyle(ButtonStyle.Primary)
            )

            blueLabels.push(b['nickname']);
            redLabels.push(r["nickname"]);
        }

        let msg = await this.channel.send({ content: `Scouting Teams For Match #${matchNum}`, components: [blueRow,redRow] });
        const buttonFilter = (btnInt) => {
            return btnInt.user.id == btnInt.user.id;
        }

        let onButtonClicked = async (buttonInteraction) => {
            //console.log(buttonInteraction.customId);
            await buttonInteraction.reply({content: `${this.url}/?team=${(buttonInteraction.customId.replace("frc",""))}&match=${matchNum}`,ephemeral: true});

            for(var i = 0; i < redRow.components.length; i++){
                let rButton = redRow.components[i];
                let bButton = blueRow.components[i];

                if(rButton.data['custom_id'] == buttonInteraction.customId){
                    //console.log("Button Found: " + rButton.data['custom_id']);
                    redRow.components[i].setDisabled(true);
                    let label = redLabels[i];
                    redRow.components[i].setLabel(label + ` - ${buttonInteraction.user.username}`);
                }
                else if(bButton.data['custom_id'] == buttonInteraction.customId){
                    //console.log("Button Found: " + bButton.data['custom_id']);
                    blueRow.components[i].setDisabled(true);
                    let label = blueLabels[i];
                    blueRow.components[i].setLabel(label + ` - ${buttonInteraction.user.username}`);
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