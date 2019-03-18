const {
    Command
} = require('discord.js-commando');
var moment = require('moment-timezone');
var fs = require('fs');

module.exports = class RetireCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'retire',
            group: 'characters',
            memberName: 'retire',
            description: 'Retires a character.',
            examples: ['retire 20'],
            args: [{
                key: 'index',
                prompt: 'What character do you want to send to work?',
                type: 'integer'
            }]
        });
    }

    async run(msg, args) {
        var creditsJson = readJson("../../credits.json");
        var charactersJson = readJson("../../characters.json");
        var user = msg.author;

        var rarityProfits = {
            "alpha": 40,
            "beta": 50,
            "gamma": 60,
            "delta": 65,
            "epsilon": 70,
            "zeta": 75
        }

        for (var i = 0; i < creditsJson.length; i++) {
            if (creditsJson[i].id == user.id && creditsJson[i].characters.length > args.index) {
                if (!creditsJson[i].characters[args.index].working) {
                    return msg.say("You can't retire a character that isn't working!");
                }

                if (creditsJson[i].characters[args.index].workStart == moment.tz("America/Chicago").format('L')) {
                    return msg.say("You can't claim this character's wages yet, wait until tomorrow.");
                }

                
                var currentRarity = global.rarityTexts[creditsJson[i].characters[args.index].rarity];
                
                var profits;

                if (charactersJson[creditsJson[i].characters[args.index].id].rare)
                    profits = 100;
                else
                    profits = Math.floor(Math.random() * 30) + rarityProfits[currentRarity];

                creditsJson[i].characters[args.index].working = false;
                creditsJson[i].characters[args.index].workCooldown = moment.tz("America/Chicago").format('L');
                creditsJson[i].credits += profits;

                msg.say(charactersJson[creditsJson[i].characters[args.index].id].interactionName + " came back from work with " + profits + " credits in profits.");

                fs.writeFileSync(require.resolve('../../credits.json'), JSON.stringify(creditsJson));
            }
        }
    }
};

var readJson = (path) => {
    return JSON.parse(fs.readFileSync(require.resolve(path)));
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}