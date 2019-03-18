const { Command } = require("discord.js-commando");
var fs = require("fs");

module.exports = class CharacterInfoCommand extends Command {
    constructor(client) {
        super(client, {
            name: "info",
            group: "characters",
            memberName: "info",
            description: "View character info.",
            examples: ["info The Chad"],
            args: [
                {
                    key: "characterName",
                    prompt: "What character do you want to view?",
                    type: "string|integer"
                }
            ]
        });
    }

    async run(msg, args) {
        var creditsJson = readJson("../../credits.json");
        var charactersJson = readJson("../../characters.json");
        var user = msg.author;

        if (Number.isInteger(parseInt(args.characterName))) {
            if (charactersJson.length > args.characterName) {
                var characterIndex = args.characterName;
                return msg.say({
                    embed: {
                        color: 7419530,
                        author: {
                            name: (charactersJson[characterIndex].rare) ? "⭐ " + charactersJson[characterIndex].name + " (" + characterIndex + ")" : charactersJson[characterIndex].name + " (" + characterIndex + ")"
                        },
                        description: "Gender: " + charactersJson[characterIndex].gender + "\nAge: " + charactersJson[characterIndex].age + "\nSexual Orientation: " + charactersJson[characterIndex].orientation + "\nCreator: " + charactersJson[characterIndex].creator,
                        image: {
                            url: charactersJson[characterIndex].imageURL
                        }
                    }
                });
            }
        }
        else
        {
            if (charactersJson.find(f => f.name.toLowerCase() == args.characterName.toLowerCase()) != null) {
                var characterIndex = charactersJson.findIndex(f => f.name.toLowerCase() == args.characterName.toLowerCase());
                return msg.say({
                    embed: {
                        color: 7419530,
                        author: {
                            name: (charactersJson[characterIndex].rare) ? "⭐ " + charactersJson[characterIndex].name + " (" + characterIndex + ")" : charactersJson[characterIndex].name + " (" + characterIndex + ")"
                        },
                        description: "Gender: " + charactersJson[characterIndex].gender + "\nAge: " + charactersJson[characterIndex].age + "\nSexual Orientation: " + charactersJson[characterIndex].orientation + "\nCreator: " + charactersJson[characterIndex].creator,
                        image: {
                            url: charactersJson[characterIndex].imageURL
                        }
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