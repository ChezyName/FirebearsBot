const DiscordJS = require("discord.js")
const {DiscordBot} = require("./src/APIs/discordAPI");
const {TBA_API} = require("./src/APIs/tbaAPI");
const dotenv = require("dotenv");

dotenv.config();
const {DiscordTOKEN,DiscordBotChannel,TBA,TEAMNUM,SITE,DiscordAppID} = process.env;

const tba = new TBA_API(TBA,TEAMNUM);
const client = new DiscordBot(DiscordTOKEN,DiscordBotChannel,main,SITE,DiscordAppID,tba);

async function displayCurrentMatch(){
    let event = await tba.getCurrentEvent();
    let matches = await tba.getMatches(event['key']);
    let teamData = await tba.getTeamDataFromMatch(matches[0]);
    client.createButtonsFromMatch(matches[0]["match_number"],teamData);
}

async function main(){
    console.log("Main Function Loaded...");
    while(true) displayCurrentMatch();
}
