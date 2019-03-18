const {
    Command
} = require("discord.js-commando");
var fs = require("fs");

module.exports = class CollectionCommand extends Command {
    constructor(client) {
        super(client, {
            name: "collections",
            group: "characters",
            memberName: "collections",
            description: "View all collections.",
            examples: [
                "collections"
            ],
            args: [
                {
                    key: "page",
                    prompt: "Which page do you want to view?",
                    type: "integer",
                    default: "1"
                }
            ]
        });
    }

    async run(msg, args) {
        var creditsJson = readJson("../../credits.json");
        var charactersJson = readJson("../../characters.json");
        var collectionsJson = readJson("../../collections.json");
        var user = msg.author;
        var page = args.page;

        var category = "All";

        var embedInfo = [];

        for (var i = 0; i < creditsJson.length; i++) {
            if (creditsJson[i].id == user.id) {
                for (var j = collectionsJson.length - 1 - (25 * (page - 1)); j >= collectionsJson.length - (25 * page) && j >= 0; j--) {
                    var completed = true;
                    var owned = 0;
                    for (var k = 0; k < collectionsJson[j].characters.length; k++) {
                        if (!creditsJson[i].characters.filter(f => f.id == collectionsJson[j].characters[k]).length > 0) {
                            completed = false;
                        } else {
                            owned++;
                        }

                    }

                    embedInfo.push({
                        name: collectionsJson[j].name,
                        value: (completed) ? ":white_check_mark: 100% Complete" : ":x: " + Math.floor((parseFloat(owned) / parseFloat(collectionsJson[j].characters.length)) * 100) + "% Complete",
                        inline: true
                    });
                }
                return msg.say({
                    embed: {
                        color: 7419530,
                        author: {
                            name: user.username + " | " + category + " Collections"
                        },
                        fields: embedInfo,
                        footer: {
                            text: "Page " + page + "/" + Math.ceil(collectionsJson.length / 25)
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