const {
    Command
} = require("discord.js-commando");
var moment = require("moment-timezone");
var fs = require("fs");

moment.tz("America/Chicago").format();

module.exports = class GachaCommand extends Command {
    constructor(client) {
        super(client, {
            name: "gacha",
            group: "characters",
            memberName: "gacha",
            description: "Rolls a gacha.",
            examples: ["gacha"],
            args: [{
                key: "type",
                prompt: "What type of gacha would you like to roll?",
                type: "string",
                default: ""
            }]
        });
    }

    run(msg, args) {
        var creditsJson = readJson("../../credits.json");
        var user = msg.author;

        switch (args.type.toLowerCase()) {
            case "alpha":
                if (creditsJson.find(f => f.id == user.id).credits >= 232) {
                    creditsJson.find(f => f.id == user.id).credits -= 232;
                    fs.writeFileSync(require.resolve("../../credits.json"), JSON.stringify(creditsJson));
                    roll("❀", msg, args);
                } else {
                    msg.say("Sorry! You don't have enough credits to do that.");
                }
                break;

            case "beta":
                if (creditsJson.find(f => f.id == user.id).credits >= 325) {
                    creditsJson.find(f => f.id == user.id).credits -= 325;
                    fs.writeFileSync(require.resolve("../../credits.json"), JSON.stringify(creditsJson));
                    roll("♬", msg, args);
                } else {
                    msg.say("Sorry! You don't have enough credits to do that.");
                }
                break;

            case "gamma":
                if (creditsJson.find(f => f.id == user.id).credits >= 511) {
                    creditsJson.find(f => f.id == user.id).credits -= 511;
                    fs.writeFileSync(require.resolve("../../credits.json"), JSON.stringify(creditsJson));
                    roll("♡", msg, args);
                } else {
                    msg.say("Sorry! You don't have enough credits to do that.");
                }
                break;

            case "delta":
                if (creditsJson.find(f => f.id == user.id).credits >= 883) {
                    creditsJson.find(f => f.id == user.id).credits -= 883;
                    fs.writeFileSync(require.resolve("../../credits.json"), JSON.stringify(creditsJson));
                    roll("✧", msg, args);
                } else {
                    msg.say("Sorry! You don't have enough credits to do that.");
                }
                break;

            case "epsilon":
                if (creditsJson.find(f => f.id == user.id).credits >= 1627) {
                    creditsJson.find(f => f.id == user.id).credits -= 1627;
                    fs.writeFileSync(require.resolve("../../credits.json"), JSON.stringify(creditsJson));
                    roll("☆", msg, args);
                } else {
                    msg.say("Sorry! You don't have enough credits to do that.");
                }
                break;

            case "zeta":
                if (creditsJson.find(f => f.id == user.id).credits >= 3115) {
                    creditsJson.find(f => f.id == user.id).credits -= 3115;
                    fs.writeFileSync(require.resolve("../../credits.json"), JSON.stringify(creditsJson));
                    roll("♛", msg, args);
                } else {
                    msg.say("Sorry! You don't have enough credits to do that.");
                }
                break;

            case "all":
                if (creditsJson.find(f => f.id == user.id).credits >= 850) {
                    creditsJson.find(f => f.id == user.id).credits -= 850;
                    fs.writeFileSync(require.resolve("../../credits.json"), JSON.stringify(creditsJson));
                    randomRoll(msg, args);
                } else {
                    msg.say("Sorry! You don't have enough credits to do that.");
                }
                break;

            default:
                msg.say({
                    embed: {
                        color: 7419530,
                        fields: [{
                                name: "Gatcha",
                                value: "This is where you can spin for characters. Every tier guarentees a character of the corresponding rarity. The price increases exponentially.\nSpin with ``=gacha <rarity>``"
                            },
                            {
                                name: "Rarities",
                                value: "Type: Alpha [❀] | Price: 232 Credits\nType: Beta [♬] | Price: 325 Credits\nType: Gamma [♡] | Price: 511 Credits\nType: Delta [✧] | Price: 883 Credits\nType: Epsilon [☆] | Price: 1627 Credits\nType: Zeta [♛] | Price: 3115 Credits\nType: All | Price: 850 Credits"
                            }
                        ]
                    }
                })
                break;
        }
    }
};

function randomRoll(msg, args) {
    var creditsJson = readJson("../../credits.json");
    var user = msg.author;
    var finalRandom;
    var rarity;
    for (var i = 0; i < creditsJson.length; i++) {
        if (creditsJson[i].id == user.id) {
            msg.channel.send({
                embed: {
                    author: {
                        name: capitalizeFirstLetter(args.type.toLowerCase()) + " Gatcha"
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
                            name: capitalizeFirstLetter(args.type.toLowerCase()) + " Gatcha"
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
                    fs.writeFileSync(require.resolve("../../credits.json"), JSON.stringify(creditsJson));
                    message.edit({
                        embed: {
                            author: {
                                name: capitalizeFirstLetter(args.type.toLowerCase()) + " Gatcha"
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
        }
    }
}

function roll(type, msg, args) {
    var creditsJson = readJson("../../credits.json");
    var user = msg.author;
    var finalRandom;
    for (var i = 0; i < creditsJson.length; i++) {
        if (creditsJson[i].id == user.id) {
            msg.channel.send({
                embed: {
                    author: {
                        name: capitalizeFirstLetter(args.type.toLowerCase()) + " Gatcha"
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
                            name: capitalizeFirstLetter(args.type.toLowerCase()) + " Gatcha"
                        },
                        color: 7419530,
                        description: "Rolling...",
                        image: {
                            url: charactersJson.find(f => f.name.toLowerCase() == charactersJson[trollRandom].name.toLowerCase()).imageURL
                        }
                    }
                }).then((message) => setTimeout(function () {
                    var notRareCharacters = charactersJson.filter(f => !f.rare);
                    var ran = Math.floor(Math.random() * notRareCharacters.length);
                    var spunCharacter = charactersJson.findIndex(f => f.name.toLowerCase() == notRareCharacters[ran].name.toLowerCase());
                    //console.log("Rarity: " + rarity);
                    creditsJson = readJson("../../credits.json");
                    for (var i = 0; i < creditsJson.length; i++) {
                        if (creditsJson[i].id == user.id) {
                            creditsJson[i].characters.push({
                                "id": spunCharacter,
                                "rarity": type,
                                "category": "",
                                "working": false,
                                "workStart": "",
                                "workCooldown": "",
                                "affection": 0,
                                "lastInteract": ""
                            });
                        }
                    }
                    fs.writeFileSync(require.resolve("../../credits.json"), JSON.stringify(creditsJson));
                    message.edit({
                        embed: {
                            author: {
                                name: capitalizeFirstLetter(args.type.toLowerCase()) + " Gatcha"
                            },
                            color: 7419530,
                            description: "Congrats <@" + user.id + "> ! You used your daily spin and got...\n\n[" + type + "] " + charactersJson[spunCharacter].name,
                            image: {
                                url: charactersJson[spunCharacter].imageURL
                            }
                        }
                    })
                }, 3000));
            }, 3000));
        }
    }
}

var readJson = (path) => {
    return JSON.parse(fs.readFileSync(require.resolve(path)));
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}