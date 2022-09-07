const DiscordJS = require("discord.js")
const {DiscordBot} = require("./src/APIs/discordAPI");
const dotenv = require("dotenv");

dotenv.config();
const {DiscordTOKEN,DiscordBotChannel,TBA,TEAMNUM} = process.env;

const client = new DiscordBot(DiscordTOKEN,DiscordBotChannel,main)

function main(){
    console.log("Main Function Loaded...");
    client.createButton();
}