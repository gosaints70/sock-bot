const { Command } = require("discord.js-commando");
var fs = require("fs");

module.exports = class LatestCommand extends Command {
    constructor(client) {
        super(client, {
            name: "latest",
            group: "characters",
            memberName: "latest",
            description: "Views your latest character."
        });
    }

    async run(msg) {
        var creditsJson = readJson("../../credits.json");
        var charactersJson = readJson("../../characters.json");
        var user = msg.author;
        if (creditsJson.find(f => f.id == msg.author.id).characters.length > 0) {
            var characters = creditsJson.find(f => f.id == msg.author.id).characters;
            var characterIndex = characters[characters.length - 1].id;
            return msg.say({
                embed: {
                    color: 7419530,
                    author: {
                        name: (charactersJson[characterIndex].rare) ? "⭐ " + charactersJson[characterIndex].name : "" + charactersJson[characterIndex].name
                    },
                    description: "Claimed by <@" + user.id + ">\nLocal ID: " + (characters.length - 1) + "\nGlobal ID: " + characterIndex + "\nRarity: " + characters[characters.length - 1].rarity + "\n\nAffection: " + characters[characters.length - 1].affection,
                    image: {
                        url: charactersJson[characterIndex].imageURL
                    }
                }
            });
        }
    }
};

var readJson = (path) => {
    return JSON.parse(fs.readFileSync(require.resolve(path)));
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}