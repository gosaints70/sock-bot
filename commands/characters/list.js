    const { Command } = require('discord.js-commando');
var fs = require('fs');

module.exports = class ListCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'oldlist',
            group: 'characters',
            memberName: 'oldlist',
            description: 'Views your list.',
            examples: [
                'oldlist',
                'oldlist @MikaStarrydust'
            ],
            args: [
                {
                    key: 'user',
                    prompt: 'Whos list do you want to view?',
                    type: 'user|integer',
                    default: ''
                },
                {
                    key: 'page',
                    prompt: 'Which page do you want to view?',
                    type: 'integer',
                    default: '1'
                }
            ]
        });
    }

    async run(msg, args) {
        var creditsJson = readJson("../../credits.json");
        var charactersJson = readJson("../../characters.json");
        var user;

        if (args.user == "") {
            user = msg.author;
        }
        else if (Number.isInteger(args.user)) {
            user = msg.author;
            args.page = args.user;
        } else {
            user = args.user;
        }

        var desc = "";
        var total = 0;

        for (var i = 0; i < creditsJson.length; i++) {
            if (creditsJson[i].id == user.id) {
                total = creditsJson[i].characters.length;
                for (var j = creditsJson[i].characters.length - 1 - (20 * (args.page - 1)); j >= creditsJson[i].characters.length - (20 * args.page) && j >= 0; j--) {
                    charactersJson[creditsJson[i].characters[j].id]
                    //console.log(creditsJson[i].characters[j].id);
                    //console.log(charactersJson[creditsJson[i].characters[j].id]);
                    if (charactersJson[creditsJson[i].characters[j].id].rare)
                        desc += j + " | [" + creditsJson[i].characters[j].rarity + "] " + charactersJson[creditsJson[i].characters[j].id].name + " ⭐ | Affection: 0\n";
                    else
                    desc += j + " | [" + creditsJson[i].characters[j].rarity + "] " + charactersJson[creditsJson[i].characters[j].id].name + " | Affection: 0\n";
                }
            }
        }

        return msg.say({
            embed: {
                color: 7419530,
                author: {
                    name: user.username + "'s Characters"
                },
                description: desc,
                footer: {
                    text: "Page " + args.page + "/" + Math.ceil(total / 20)
                }
            }
        });
    }
};

var readJson = (path) => {
    return JSON.parse(fs.readFileSync(require.resolve(path)));
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}