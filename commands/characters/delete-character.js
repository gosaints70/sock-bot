const { Command } = require("discord.js-commando");
var fs = require("fs");

module.exports = class DeleteCharacterCommand extends Command {
    constructor(client) {
        super(client, {
            name: "deletecharacter",
            group: "characters",
            memberName: "deletecharacter",
            description: "Deletes the specified character.",
            examples: ["deletecharacter Chad"],
            args: [
                {
                    key: "name",
                    prompt: "Whats the characters name?",
                    type: "string"
                }
            ]
        });
    }

    async run(msg, args) {
        var creditsJson = readJson("../../credits.json");
        var user = msg.author;

        for (var i = 0; i < creditsJson.length; i++) {
            if (creditsJson[i].id == user.id) {
                for (var j = 0; j < creditsJson[i].characters.length; j++) {
                    if (creditsJson[i].characters[j].name.toLowerCase() == args.name.toLowerCase()) {
                        creditsJson[i].characters.splice(j, 1);
                        fs.writeFileSync(require.resolve("../../credits.json"), JSON.stringify(creditsJson));
                        return msg.say({
                            embed:{
                                color: 7419530,
                                description: args.name + " has been deleted!"
                            }
                        });
                    }
                }
            }
        }

        return msg.say({
            embed:{
                color: 11403284,
                description: "Indicated character does not exist!"
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