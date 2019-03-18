const { Command } = require("discord.js-commando");
var fs = require("fs");

module.exports = class ViewCharacterCommand extends Command {
    constructor(client) {
        super(client, {
            name: "view",
            group: "characters",
            memberName: "view",
            description: "View character at the given index.",
            examples: ["view 4"],
            args: [
                {
                    key: "characterIndex",
                    prompt: "What index do you want to view?",
                    type: "integer",
                    min: 0
                }
            ]
        });
    }

    async run(msg, args) {
        var creditsJson = readJson("../../credits.json");
        var charactersJson = readJson("../../characters.json");
        var user = msg.author;

        for (var i = 0; i < creditsJson.length; i++) {
            if (creditsJson[i].id == user.id) {
                if (creditsJson[i].characters.length > args.characterIndex) {
                    return msg.say({
                        embed: {
                            color: 7419530,
                            author: {
                                name: (charactersJson[creditsJson[i].characters[args.characterIndex].id].rare) ? "⭐ " + charactersJson[creditsJson[i].characters[args.characterIndex].id].name : "" + charactersJson[creditsJson[i].characters[args.characterIndex].id].name
                            },
                            description: "Claimed by <@" + user.id + ">\nCategory: " + creditsJson[i].characters[args.characterIndex].category + "\nLocal ID: " + args.characterIndex + "\nGlobal ID: " + charactersJson.indexOf(charactersJson[creditsJson[i].characters[args.characterIndex].id]) + "\nRarity: " + creditsJson[i].characters[args.characterIndex].rarity + "\n\nAffection: 0",
                            image: {
                                url: charactersJson[creditsJson[i].characters[args.characterIndex].id].imageURL
                            }
                        }
                    });
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