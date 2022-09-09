const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

class TBA_API{
    constructor(TBAKEY,TeamKey){
        this.key = TBAKEY;
        this.team = TeamKey;
    }

    async getData(path=""){
        const response = await await fetch('https://www.thebluealliance.com/api/v3'+path, {
            method: 'get',
            headers: {'X-TBA-Auth-Key': this.key}
        });
        return await response.json();
    }

    async getCurrentEvent(){
        let year = new Date().getFullYear();
        //console.log("Current Year is " + year);
        let events = await this.getData("/team/"+this.team+"/events/"+year+"/simple");
        //console.log("\n our current events for "+year+" are:")
        //console.log(events);
        //console.log("\n");
        return events[0];
    }

    async getYearEvents(){
        let year = new Date().getFullYear();
        //console.log("Current Year is " + year);
        let events = await this.getData("/team/"+this.team+"/events/"+year+"/simple");
        //console.log("\n our current events for "+year+" are:")
        //console.log(events);
        //console.log("\n");
        return events;
    }

    async getMatches(eventKey){
        let allMatches = this.getData("/event/"+eventKey+"/matches/simple");
        return allMatches;
    }

    async getTeamInfo(teamKey){
        let teamData = await this.getData("/team/" + teamKey + "/simple");
        return teamData;
    }

    async getTeamDataFromMatch(matchData){
        let blue = matchData["alliances"]["blue"]["team_keys"];
        let red = matchData["alliances"]["red"]["team_keys"];

        let nBlue = [];
        let nRed = [];

        for(var i = 0; i < blue.length; i++){
            let b = await this.getTeamInfo(blue[i]);
            let r = await this.getTeamInfo(red[i]);

            nBlue.push(b);
            nRed.push(r);
        }

        return {blue: nBlue, red: nRed};
    }
}

module.exports = {TBA_API}