const { Command } = require('discord.js-commando');
var fs = require('fs');

module.exports = class DuplicatesCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'duplicates',
            aliases: ['dupes'],
            group: 'characters',
            memberName: 'duplicates',
            description: 'Views your duplicates.',
            examples: [
                'dupes',
                'duplicates @MikaStarrydust'
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
                //var dupesList = creditsJson[i].characters.filter((a, _, aa) => aa.indexOf(a) !== aa.lastIndexOf(a));
                var dupesList = creditsJson[i].characters.filter((el, _, arr) => {
                    return creditsJson[i].characters.filter(el2 => el2.id === el.id).length > 1
                });
                total = dupesList.length;
                for (var j = dupesList.length - 1 - (20 * (args.page - 1)); j >= dupesList.length - (20 * args.page) && j >= 0; j--) {
                    charactersJson[dupesList[j].id]
                    //console.log(dupesList[j].id);
                    //console.log(charactersJson[dupesList[j].id]);
                    if (charactersJson[dupesList[j].id].rare)
                        desc += creditsJson[i].characters.indexOf(dupesList[j]) + " | [" + dupesList[j].rarity + "] " + charactersJson[dupesList[j].id].name + " ⭐ | Affection: 0\n";
                    else
                        desc += creditsJson[i].characters.indexOf(dupesList[j]) + " | [" + dupesList[j].rarity + "] " + charactersJson[dupesList[j].id].name + " | Affection: 0\n";
                }
            }
        }

        return msg.say({
            embed: {
                color: 7419530,
                author: {
                    name: user.username + "'s Duplicate Characters"
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