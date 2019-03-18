const {
    Command
} = require('discord.js-commando');
var moment = require('moment-timezone');
var fs = require('fs');

moment.tz("America/Chicago").format();

module.exports = class DailyGachaCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'dailygacha',
            group: 'characters',
            memberName: 'dailygacha',
            description: 'Rolls your daily gacha.',
            examples: ['dailygacha']
        });
    }

    run(msg) {
        var creditsJson = readJson("../../credits.json");
        var user = msg.author;
        var finalRandom;
        var rarity;
        for (var i = 0; i < creditsJson.length; i++) {
            if (creditsJson[i].id == user.id) {
                if (creditsJson[i].lastGacha != moment.tz("America/Chicago").format('L')) {
                    creditsJson[i].lastGacha = moment.tz("America/Chicago").format('L');
                    fs.writeFileSync(require.resolve('../../credits.json'), JSON.stringify(creditsJson));
                    msg.channel.send({
                        embed: {
                            author: {
                                name: "Daily Gatcha"
                            },
                            color: 7419530,
                            description: "Rolling...",
                            image: {
                                url: charactersJson[Math.floor(Math.random() * charactersJson.length)].imageURL
                            }
                        }
                    }).then((message) => setTimeout(function () {
                        var trollRandom = 0;
                        for (var i = 0; i < creditsJson.length; i++) {
                            if (creditsJson[i].id == user.id) {
                                if (creditsJson[i].wishlist.length > 3) {
                                    trollRandom = creditsJson[i].wishlist[Math.floor(Math.random() * creditsJson[i].wishlist.length)];
                                } else {
                                    trollRandom = Math.floor(Math.random() * charactersJson.length);
                                }
                            }
                        }
                        message.edit({
                            embed: {
                                author: {
                                    name: "Daily Gatcha"
                                },
                                color: 7419530,
                                description: "Rolling...",
                                image: {
                                    url: charactersJson.find(f => f.name.toLowerCase() == charactersJson[trollRandom].name.toLowerCase()).imageURL
                                }
                            }
                        }).then((message) => setTimeout(function () {
                            if (Math.floor(Math.random() * 250 + 1) == 1) {
                                var rareCharacters = charactersJson.filter(f => f.rare);
                                var ran = Math.floor(Math.random() * rareCharacters.length);
                                var spunCharacter = charactersJson.findIndex(f => f.name.toLowerCase() == rareCharacters[ran].name.toLowerCase());
                                rarity = global.getRaritySymbol(Math.floor(Math.random() * 200) + 1);
                                //console.log("Rarity: " + rarity);
                                creditsJson = readJson("../../credits.json");
                                for (var i = 0; i < creditsJson.length; i++) {
                                    if (creditsJson[i].id == user.id) {
                                        creditsJson[i].characters.push({
                                            "id": spunCharacter,
                                            "rarity": rarity,
                                            "category": "",
                                            "working": false,
                                            "workStart": "",
                                            "workCooldown": "",
                                            "affection": 0,
                                            "lastInteract": ""
                                        });
                                    }
                                }
                            } else {
                                var notRareCharacters = charactersJson.filter(f => !f.rare);
                                var ran = Math.floor(Math.random() * notRareCharacters.length);
                                var spunCharacter = charactersJson.findIndex(f => f.name.toLowerCase() == notRareCharacters[ran].name.toLowerCase());
                                rarity = global.getRaritySymbol(Math.floor(Math.random() * 200) + 1);
                                //console.log("Rarity: " + rarity);
                                creditsJson = readJson("../../credits.json");
                                for (var i = 0; i < creditsJson.length; i++) {
                                    if (creditsJson[i].id == user.id) {
                                        creditsJson[i].characters.push({
                                            "id": spunCharacter,
                                            "rarity": rarity,
                                            "category": "",
                                            "working": false,
                                            "workStart": "",
                                            "workCooldown": "",
                                            "affection": 0,
                                            "lastInteract": ""
                                        });
                                    }
                                }
                            }
                            fs.writeFileSync(require.resolve('../../credits.json'), JSON.stringify(creditsJson));
                            message.edit({
                                embed: {
                                    author: {
                                        name: "Daily Gatcha"
                                    },
                                    color: 7419530,
                                    description: "Congrats <@" + user.id + "> ! You used your daily spin and got...\n\n[" + rarity + "] " + charactersJson[spunCharacter].name,
                                    image: {
                                        url: charactersJson[spunCharacter].imageURL
                                    }
                                }
                            })
                        }, 3000));
                    }, 3000));
                } else {
                    return msg.say({
                        embed: {
                            color: 7419530,
                            description: "You already claimed your daily gacha! Wait until tomorrow to try again."
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