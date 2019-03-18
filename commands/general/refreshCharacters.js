const { Command } = require('discord.js-commando');
var fs = require('fs');

module.exports = class RefreshCharactersCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'refreshcharacters',
            aliases: ['refreshcharacters'],
            group: 'general',
            memberName: 'refreshcharacters',
            description: 'Refreshes the game status of the bot to reflect the actual characters count.',
            examples: [
                'purgetrades'
            ]
        });
    }

    async run(msg, args) {
        var charactersJson = readJson("../../characters.json");
        client.user.setPresence({
            game: { name: charactersJson.length + " characters" },
            status: "streaming"
        });
    }
};

var readJson = (path) => {
    return JSON.parse(fs.readFileSync(require.resolve(path)));
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}