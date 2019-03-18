const {
    Command
} = require('discord.js-commando');
var moment = require('moment-timezone');
var fs = require('fs');

moment.tz("America/Chicago").format();

module.exports = class AddCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'add',
            group: 'characters',
            memberName: 'add',
            description: 'Adds a character to the specified users list.',
            examples: ['add 0 @Solaresque', 'add 0 @Solaresque beta'],
            args: [{
                    key: 'characterIndex',
                    prompt: 'Which character do you want to add?',
                    type: 'integer'
                },
                {
                    key: 'user',
                    prompt: 'Who do you want to give a character to?',
                    type: 'user'
                },
                {
                    key: 'rarity',
                    prompt: 'Which rarity would you like the character to be?',
                    type: 'string',
                    default: "random"
                }
            ]
        });
    }

    run(msg, args) {
        var creditsJson = readJson("../../credits.json");
        var charactersJson = readJson("../../characters.json");

        for (var i = 0; i < creditsJson.length; i++) {
            if (creditsJson[i].id == args.user.id) {
                var resultingRarity = "";

                switch (args.rarity.toLowerCase()) {
                    case "alpha":
                        resultingRarity = "❀";
                        break;
                    case "beta":
                        resultingRarity = "♬";
                        break;
                    case "gamma":
                        resultingRarity = "♡";
                        break;
                    case "delta":
                        resultingRarity = "✧";
                        break;
                    case "epsilon":
                        resultingRarity = "☆";
                        break;
                    case "zeta":
                        resultingRarity = "♛";
                        break;
                    case "random":
                        resultingRarity = global.getRaritySymbol(Math.floor(Math.random() * 200) + 1);
                        break;
                }
                creditsJson[i].characters.push({
                    id: args.characterIndex,
                    rarity: resultingRarity,
                    working: false,
                    workStart: "",
                    workCooldown: "",
                    affection: 0,
                    lastInteract: ""
                });
                fs.writeFileSync(require.resolve('../../credits.json'), JSON.stringify(creditsJson));
                msg.say("Added [" + resultingRarity + "] " + charactersJson[args.characterIndex].name + " to " + args.user.username + "'s list.");
            }
        }
    }
}

var readJson = (path) => {
    return JSON.parse(fs.readFileSync(require.resolve(path)));
}

function uppercaseFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}