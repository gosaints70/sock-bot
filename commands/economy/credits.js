const { Command } = require('discord.js-commando');
var fs = require('fs');

module.exports = class CreditsCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'credits',
            group: 'economy',
            memberName: 'credits',
            description: 'Shows the amount of credits you currently have.',
            examples: ['credits'],
            args: [
                {
                    key: 'member',
                    prompt: 'Whose balance would you like to see?',
                    type: 'member',
                    default: 'noinput'
                }
            ]
        });
    }

    async run(msg, args) {
        var creditsJson = readJson("../../credits.json");
        var member = null;
        var user = null;
        if (args.member == "noinput") {
            user = msg.author;
        }
        else {
            member = args.member;
            user = member.user;
        }
        var currentCredits = -1;
        for (var i = 0; i < creditsJson.length; i++) {
            if (creditsJson[i].id == user.id) {
                currentCredits = creditsJson[i].credits;
            }
        }
        if (currentCredits == -1) {
            creditsJson.push({
                "id": user.id,
                "credits": 0,
                "nextDaily": 0
            });
            fs.writeFileSync(require.resolve('../../credits.json'), JSON.stringify(creditsJson));
        }
        creditsJson = readJson("../../credits.json");
        var currentCredits = -1;
        for (var i = 0; i < creditsJson.length; i++) {
            if (creditsJson[i].id == user.id) {
                currentCredits = creditsJson[i].credits;
            }
        }
        if (currentCredits == -1) {
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
                description: user.username + " has " + currentCredits + " credits."
            }
        });
    }
};

var readJson = (path) => {
    return JSON.parse(fs.readFileSync(require.resolve(path)));
  }