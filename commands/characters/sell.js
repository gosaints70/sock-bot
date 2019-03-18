const {
    Command
} = require('discord.js-commando');
var moment = require('moment-timezone');
var fs = require('fs');

moment.tz("America/Chicago").format();

module.exports = class SellCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'sell',
            group: 'characters',
            memberName: 'sell',
            description: 'Sells a character.',
            examples: ['sell 32'],
            args: [{
                key: 'index',
                prompt: 'Who do you wanna sell?',
                type: 'string',
                default: -1
            }]
        });
    }

    run(msg, args) {
        if (args.index == -1) {
            return msg.say({
                embed: {
                    color: 7419530,
                    fields: [{
                            name: "Gatcha",
                            value: "This is where you can sell your characters for cold hard cash. A character is worth a quarter as much as its rarity's buy price."
                        },
                        {
                            name: "Rarities",
                            value: "Type: Alpha [❀] | Price: 58 Credits\nType: Beta [♬] | Price: 82 Credits\nType: Gamma [♡] | Price: 128 Credits\nType: Delta [✧] | Price: 221 Credits\nType: Epsilon [☆] | Price: 407 Credits\nType: Zeta [♛] | Price: 779 Credits\nType: Rare | Price: 5000 Credits"
                        }
                    ]
                }
            });
        }
        var creditsJson = readJson("../../credits.json");
        var charactersJson = readJson("../../characters.json");
        var user = msg.author;
        /*var rarityPrices = {
            "alpha": 116,
            "beta": 163,
            "gamma": 256,
            "delta": 442,
            "epsilon": 814,
            "zeta": 1558
        }*/

        var rarityPrices = {
            "alpha": 58,
            "beta": 82,
            "gamma": 128,
            "delta": 221,
            "epsilon": 407,
            "zeta": 779
        }
        for (var i = 0; i < creditsJson.length; i++) {
            if (creditsJson[i].id == user.id && creditsJson[i].characters.length > args.index && args.index > -1) {
                if (creditsJson[i].lastSellsRefresh != moment.tz("America/Chicago").format('L')) {
                    creditsJson[i].lastSellsRefresh = moment.tz("America/Chicago").format('L');
                    creditsJson[i].sellsRemaining = 5;
                }

                var dupesList = creditsJson[i].characters.filter((el, _, arr) => {
                    return creditsJson[i].characters.filter(el2 => el2.id === el.id).length > 1
                });

                if (!dupesList.includes(creditsJson[i].characters[args.index])) {
                    if (creditsJson[i].sellsRemaining == 0) {
                        return msg.say({
                            embed: {
                                description: "You have no non-duplicate sells remaining for today."
                            }
                        });
                    }
                    creditsJson[i].sellsRemaining--;
                }
                    

                var currentRarity = global.rarityTexts[creditsJson[i].characters[args.index].rarity];
                var character = charactersJson[creditsJson[i].characters[args.index].id];
                var reward = 0;
                if (character.rare)
                    reward = 2500;
                else
                    reward = rarityPrices[currentRarity];

                creditsJson[i].credits += reward;
                msg.say("[" + creditsJson[i].characters[args.index].rarity + "] " + character.name + " has been sold to Server Host for " + reward + " credits. You now have ``" + creditsJson[i].credits + "``. I hope it was worth it.\nYou have " + creditsJson[i].sellsRemaining + " non-duplicate sells remaining for today.");
                creditsJson[i].characters.splice(args.index, 1);
                fs.writeFileSync(require.resolve('../../credits.json'), JSON.stringify(creditsJson));

                var imageURL = require.resolve('../../image0.jpg');

                //client.channels.find("id", "533085381894078484").send(boxURL);
          
                msg.say({
                  files: [{
                    attachment: imageURL,
                    name: "serverhost.png"
                  }]
                })
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
