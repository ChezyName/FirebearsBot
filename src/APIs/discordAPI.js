const { Client, SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, GatewayIntentBits } = require("discord.js")
const { REST } = require('@discordjs/rest');

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

    
    async createButton() {
        const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('primary')
                .setLabel('Click me!')
                .setStyle(ButtonStyle.Primary),
        );
        await this.channel.send({ content: 'I think you should,', components: [row] });
    }
}

module.exports = {DiscordBot}