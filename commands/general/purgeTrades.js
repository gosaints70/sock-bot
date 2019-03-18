const { Command } = require("discord.js-commando");
var fs = require("fs");

module.exports = class PurgeTradesCommand extends Command {
    constructor(client) {
        super(client, {
            name: "purgetrades",
            aliases: ["cleartrades"],
            group: "general",
            memberName: "purgetrades",
            description: "Purges trades, just in case the bot breaks.",
            examples: [
                "purgetrades"
            ]
        });
    }

    async run(msg, args) {
        var tradesJson = readJson("../../trades.json");
        var creditsJson = readJson("../../trades.json");

        for(var i = 0; i < creditsJson.length; i++) {
            creditsJson[i].currentTrade = -1;
        }

        tradesJson = [];

        fs.writeFileSync(require.resolve("../../trades.json"), JSON.stringify(tradesJson));

        msg.say("Trades have been purged.");
    }
};

var readJson = (path) => {
    return JSON.parse(fs.readFileSync(require.resolve(path)));
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}