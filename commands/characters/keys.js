const { Command } = require("discord.js-commando");
var fs = require("fs");

module.exports = class KeysCommand extends Command {
    constructor(client) {
        super(client, {
            name: "keys",
            aliases: ["keys"],
            group: "characters",
            memberName: "keys",
            description: "Views your keys.",
            examples: [
                "keys"
            ]
        });
    }

    async run(msg) {
        var creditsJson = readJson("../../credits.json");
        var user = msg.author;

        var desc = "";

        for (var i = 0; i < creditsJson.length; i++) {
            if (creditsJson[i].id == user.id) {
                for (var j = 0; j < creditsJson[i].keys.length; j++) {
                    desc += capitalizeFirstLetter(creditsJson[i].keys[j]) + " Key\n";
                }
            }
        }

        return msg.say({
            embed: {
                color: 7419530,
                author: {
                    name: user.username + ""s SockBox Keys"
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