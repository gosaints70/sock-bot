const Discord = require('discord.js');
const {
    Command
} = require('discord.js-commando');
var fs = require('fs');

module.exports = class OpenBoxCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'open',
            group: 'characters',
            memberName: 'open',
            description: 'Tries to open a box.',
            examples: ['open abcdefg'],
            args: [{
                key: 'code',
                prompt: 'Whats the boxs code?',
                type: 'string'
            }]
        });
    }

    async run(msg, args) {
        if (global.currentBoxCode == "")
            return;

        var creditsJson = readJson("../../credits.json");
        var charactersJson = readJson("../../characters.json");
        var user = msg.author;

        for (var i = 0; i < creditsJson.length; i++) {
            if (creditsJson[i].id == msg.author.id) {
                if (args.code == global.currentBoxCode) {
                    if (creditsJson[i].keys.includes(global.currentBoxKeyColor)) {
                        var finalIndex;
                        var rareCharacters = charactersJson.filter(f => f.rare);
                        var nonRareCharacters = charactersJson.filter(f => !f.rare);

                        global.currentBoxCode = "";
                        global.currentBoxMessage.attachments.deleteAll();
                        global.currentBoxMessage.edit({
                            embed: {
                                color: 7419530,
                                author: {
                                    name: "SockBox"
                                },
                                description: "A SockBox:tm: has arrived in this channel!\nSomeone should probably open it with ``=open <combination>``\nThere is a case-sensitive combination below.\nThis box requires a __" + currentBoxKeyColor + "__ key to open. (Check your keys with ``=keys`` and get new ones with ``=dailykeys``\n\n(Opened by <@" + msg.author.id + ">)",
                                image: {
                                    url: "https://i.imgur.com/hjno9Y9.png"
                                }
                            }
                        });

                        global.currentBoxMessage = "";
                        /*msg.say("", {
                            files: [
                                require.resolve('../../box_open.png')
                            ]
                        });*/
                        creditsJson[i].keys.splice(creditsJson[i].keys.findIndex(f => f == global.currentBoxKeyColor), 1);

                        var credits = 100 + Math.floor(Math.random() * 100 + 1);

                        creditsJson[i].credits += credits;
                        if (Math.floor(Math.random() * 100 + 1) <= 5) {
                            var rarity = global.getRaritySymbol(Math.floor(Math.random() * 200) + 1);
                            finalIndex = Math.floor(Math.random() * charactersJson.length);
                            creditsJson[i].characters.push({
                                "id": charactersJson.findIndex(f => f.name.toLowerCase() == charactersJson[finalIndex].name.toLowerCase()),
                                "rarity": rarity,
                                "category": "",
                                "working": false,
                                "workStart": "",
                                "workCooldown": "",
                                "affection": 0,
                                "lastInteract": ""
                            });
                            fs.writeFileSync(require.resolve('../../credits.json'), JSON.stringify(creditsJson));
                            return msg.say("Nice! <@" + msg.author.id + "> has opened the SockBox and recieved " + credits + " credits!\n\nThe box also contained [" + rarity + "] " + charactersJson[finalIndex].name, new Discord.MessageAttachment(charactersJson[finalIndex].imageURL));
                        }
                        fs.writeFileSync(require.resolve('../../credits.json'), JSON.stringify(creditsJson));
                        return msg.say("Nice! <@" + msg.author.id + "> has opened the SockBox and recieved " + credits + " credits!");
                    } else {
                        return msg.say({
                            embed: {
                                color: 7419530,
                                description: "Sorry, you don't have the correct color key to open this box."
                            }
                        });
                    }
                }
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