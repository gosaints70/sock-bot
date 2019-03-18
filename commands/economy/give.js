const { Command } = require("discord.js-commando");
var fs = require("fs");

module.exports = class GiveCommand extends Command {
    constructor(client) {
        super(client, {
            name: "give",
            group: "economy",
            memberName: "give",
            description: "Transfers the specified user the specified amount of credits from your balance.",
            examples: ["give @glabadie 1000"],
            args: [
                {
                    key: "recipient",
                    prompt: "Who would you like to give credits to?",
                    type: "member"
                },
                {
                    key: "amount",
                    prompt: "How many credits would you like to give?",
                    type: "integer",
                    min: 1
                }
            ]
        });
    }

    async run(msg, args) {
        var creditsJson = readJson("../../credits.json");
        var member = null;
        var user = null;
        var foundUser = false;
        user = args.recipient.user;
        for (var i = 0; i < creditsJson.length; i++) {
            if (creditsJson[i].id == msg.author.id) {
                if (creditsJson[i].credits < args.amount) {
                    return msg.say({
                        embed:{
                            color: 7419530,
                            description: "You don't have enough credits to do that!"
                        }
                    });
                }
                creditsJson[i].credits -= args.amount;
            }
        }
        for (var i = 0; i < creditsJson.length; i++) {
            if (creditsJson[i].id == user.id) {
                foundUser = true;
                creditsJson[i].credits += args.amount;
            }
        }
        if (!foundUser) {
            creditsJson.push({
                "id": user.id,
                "credits": 0,
                "nextDaily": 0,
                "stats" : {
                    "combat" : 1,
                    "dexterity" : 1,
                    "intelligence" : 1,
                    "charisma" : 1,
                    "wisdom" : 1,
                    "creativity" : 1,
                    "cooking" : 1
                }
            });
            for (var i = 0; i < creditsJson.length; i++) {
                if (creditsJson[i].id == user.id) {
                    foundUser = true;
                    creditsJson[i].credits += args.amount;
                }
            }
        }
        fs.writeFileSync(require.resolve("../../credits.json"), JSON.stringify(creditsJson));
        if (!foundUser) {
            return msg.say({
                embed: {
                    color: 12320768,
                    description: "An unexpected error has occured..."
                }
            });
        }
        return msg.say({
            embed:{
                color: 7419530,
                description: msg.author.username + " just gave " + user.username + " " + args.amount + " credits!"
            }
        });
    }
};

var readJson = (path) => {
    return JSON.parse(fs.readFileSync(require.resolve(path)));
}