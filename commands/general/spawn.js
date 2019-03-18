const Discord = require('discord.js');
const {
    Command
} = require('discord.js-commando');
var fs = require('fs');

module.exports = class SpawnCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'spawn',
            group: 'general',
            memberName: 'spawn',
            description: 'Spawns a character.',
            examples: ['spawn 5'],
            ownerOnly: true,
            args: [{
                key: 'id',
                prompt: 'Who do you want to spawn?',
                type: 'integer',
                default: '-1'
            }]
        });
    }

    async run(msg, args) {
        if (args.id == -1) {
            if (Math.floor(Math.random() * 200 + 1) == 1) {
                global.rare = true;
                global.currentCharacter = Math.floor(Math.random() * charactersJson.filter(f => f.rare).length + 1);
                var desc = "A character appeared!\nTry guessing their name with ``=claim <name>`` to claim them!\n\nHints:\nThis character's initials are '";
                for (var i = 0; i < charactersJson.filter(f => f.rare)[global.currentCharacter].name.split(" ").length; i++) {
                    desc += charactersJson.filter(f => f.rare)[global.currentCharacter].name.split(" ")[i].substring(0, 1) + ". ";
                }
                desc += "'\nUse ``=lookup <name>`` if you can't remember the full name.\n\n"
                msg.client.channels.find("id", "533085381894078484").send({
                    embed: {
                        color: 7419530,
                        author: {
                            name: "Rare Character!"
                        },
                        description: desc,
                        image: {
                            url: charactersJson.filter(f => f.rare)[global.currentCharacter].imageURL
                        }
                    }
                });
            } else {
                global.rare = false;
                global.currentCharacter = Math.floor(Math.random() * charactersJson.length + 1);
                var desc = "A character appeared!\nTry guessing their name with ``=claim <name>`` to claim them!\n\nHints:\nThis character's initials are '";
                for (var i = 0; i < charactersJson[global.currentCharacter].name.split(" ").length; i++) {
                    desc += charactersJson[global.currentCharacter].name.split(" ")[i].substring(0, 1) + ". ";
                }
                desc += "'\nUse ``=lookup <name>`` if you can't remember the full name.\n\n"
                msg.client.channels.find("id", "533085381894078484").send({
                    embed: {
                        color: 7419530,
                        author: {
                            name: "Character"
                        },
                        description: desc,
                        image: {
                            url: charactersJson[global.currentCharacter].imageURL
                        }
                    }
                });
            }
        } else {
            if (charactersJson[args.id].rare) {
                global.rare = true;
                global.currentCharacter = args.id;
                var desc = "A character appeared!\nTry guessing their name with ``=claim <name>`` to claim them!\n\nHints:\nThis character's initials are '";
                for (var i = 0; i < charactersJson.filter(f => f.rare)[global.currentCharacter].name.split(" ").length; i++) {
                    desc += charactersJson.filter(f => f.rare)[global.currentCharacter].name.split(" ")[i].substring(0, 1) + ". ";
                }
                desc += "'\nUse ``=lookup <name>`` if you can't remember the full name.\n\n"
                msg.client.channels.find("id", "533085381894078484").send({
                    embed: {
                        color: 7419530,
                        author: {
                            name: "Rare Character!"
                        },
                        description: desc,
                        image: {
                            url: charactersJson.filter(f => f.rare)[global.currentCharacter].imageURL
                        }
                    }
                });
            }
            else {
                global.rare = false;
                global.currentCharacter = args.id;
                var desc = "A character appeared!\nTry guessing their name with ``=claim <name>`` to claim them!\n\nHints:\nThis character's initials are '";
                for (var i = 0; i < charactersJson[global.currentCharacter].name.split(" ").length; i++) {
                    desc += charactersJson[global.currentCharacter].name.split(" ")[i].substring(0, 1) + ". ";
                }
                desc += "'\nUse ``=lookup <name>`` if you can't remember the full name.\n\n"
                msg.client.channels.find("id", "533085381894078484").send({
                    embed: {
                        color: 7419530,
                        author: {
                            name: "Character"
                        },
                        description: desc,
                        image: {
                            url: charactersJson[global.currentCharacter].imageURL
                        }
                    }
                });
            }
        }
    }
}