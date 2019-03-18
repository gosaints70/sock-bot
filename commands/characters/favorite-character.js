const { Command } = require('discord.js-commando');
var fs = require('fs');

module.exports = class FavoriteCharacterCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'favorite',
            aliases: ['favourite'],
            group: 'characters',
            memberName: 'favorite',
            description: 'Favorite a character.',
            examples: ['favorite The Chad'],
            args: [
                {
                    key: 'name',
                    prompt: 'Who is your favorite character?',
                    type: 'string'
                }
            ]
        });
    }

    async run(msg, args) {
        var creditsJson = readJson("../../credits.json");
        var charactersJson = readJson("../../characters.json");
        var user = msg.author;
        
        if (charactersJson.find(f => f.name.toLowerCase() == args.name.toLowerCase()) != null) {

            for (var i = 0; i < creditsJson.length; i++) {
                if (creditsJson[i].id == user.id) {
                    creditsJson[i].favoriteCharacter = charactersJson.findIndex(f => f.name.toLowerCase() == args.name.toLowerCase());
                    fs.writeFileSync(require.resolve('../../credits.json'), JSON.stringify(creditsJson));
                    return msg.say("Your favorite character has been set to " + charactersJson[creditsJson[i].favoriteCharacter].name);

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