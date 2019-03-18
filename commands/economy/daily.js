const { Command } = require("discord.js-commando");
var moment = require("moment-timezone");
var fs = require("fs");
var dailyAmount = 100;

moment.tz("America/Chicago").format();

module.exports = class DailyCommand extends Command {
    constructor(client) {
        super(client, {
            name: "daily",
            group: "economy",
            memberName: "daily",
            description: "Gives you your daily credits.",
            examples: ["daily"]
        });
    }

    async run(msg) {
        var creditsJson = readJson("../../credits.json");
        var user = msg.author;
        for (var i = 0; i < creditsJson.length; i++) {
            if (creditsJson[i].id == user.id) {
                if (creditsJson[i].nextDaily != moment.tz("America/Chicago").format("L")) {
                    creditsJson[i].credits += dailyAmount;
                    creditsJson[i].nextDaily = moment.tz("America/Chicago").format("L");
                    fs.writeFileSync(require.resolve("../../credits.json"), JSON.stringify(creditsJson));
                    return msg.say({
                        embed:{
                            color: 7419530,
                            description: "Recieved **" + dailyAmount + "** credits!"
                        }
                    });
                }
                else
                {
                    return msg.say({
                        embed:{
                            color: 7419530,
                            description: "You already claimed your daily credits! Wait until tomorrow to try again."
                        }
                    });
                }
            }
        }
    }
};

var readJson = (path) => {
    return JSON.parse(fs.readFileSync(require.resolve(path)));
}