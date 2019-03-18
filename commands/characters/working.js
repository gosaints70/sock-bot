const {
    Command
} = require('discord.js-commando');
var moment = require('moment-timezone');
var fs = require('fs');

module.exports = class WorkingCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'working',
            group: 'characters',
            memberName: 'working',
            description: 'Checks the characters currently working.',
            examples: ['working']
        });
    }

    async run(msg) {
        var creditsJson = readJson("../../credits.json");
        var charactersJson = readJson("../../characters.json");
        var user = msg.author;

        for (var i = 0; i < creditsJson.length; i++) {
            if (creditsJson[i].id == user.id) {
                var workingCharacters = creditsJson[i].characters.filter(f => f.working).reverse();
                var desc = "Here's a list of characters that you've sent off to work for ServerHost. If one of them is done, you can do ``=retire <characterId>`` in order to claim their wages.\n\n"

                for (var j = 0; j < workingCharacters.length; j++) {
                    if (workingCharacters[j].workStart == moment.tz("America/Chicago").format('L'))
                        desc += creditsJson[i].characters.findIndex(f => f == workingCharacters[j]) + " | " + charactersJson[workingCharacters[j].id].name + " | Currently Working...\n";
                    else
                        desc += creditsJson[i].characters.findIndex(f => f == workingCharacters[j]) + " | " + charactersJson[workingCharacters[j].id].name + " | Ready to Retire!\n";
                }

                msg.say({
                    embed: {
                        author: {
                            name: "Working"
                        },
                        color: 7419530,
                        description: desc
                    }
                });
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