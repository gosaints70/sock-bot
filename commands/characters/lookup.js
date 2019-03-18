const { Command } = require('discord.js-commando');
var fs = require('fs');
var fuzzy = require('fuzzyset.js');

module.exports = class LookupCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'lookup',
            aliases: ['lookup'],
            group: 'characters',
            memberName: 'lookup',
            description: 'Views characters that fit your criteria.',
            examples: [
                'lookup Glarix'
            ],
            args: [
                {
                    key: 'name',
                    prompt: 'Who do you want to search for?',
                    type: 'string',
                    default: ''
                }
            ]
        });
    }

    async run(msg, args) {
        var charactersJson = readJson("../../characters.json");

        var desc = "";

        /*var currentSet = FuzzySet();

        for (var i = 0; i < charactersJson.length; i++) {
            currentSet.add(charactersJson[i].name);
        }

        var filteredCharacters = currentSet.get(args.name);*/

        var trueList = [];
                    
        for (var i = 0; i < charactersJson.length; i++) {
            var parts = charactersJson[i].name.split(" ");
            for (var j = 0; j < parts.length; j++) {
                if (parts[j].toLowerCase() == args.name.toLowerCase()) {
                    trueList.push(charactersJson[i]);
                }
            }
        }

        for (var i = 0; i < trueList.length > 0; i++) {
            desc += charactersJson.findIndex(f => f.name == trueList[i].name) + " | " + trueList[i].name + "\n";
        }

        return msg.say({
            embed: {
                color: 7419530,
                author: {
                    name: "Character Lookup: '" + args.name + "'"
                },
                description: desc
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