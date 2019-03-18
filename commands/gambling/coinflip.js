const Discord = require("discord.js");
const {
    Command
} = require("discord.js-commando");
var fs = require("fs");

module.exports = class CoinFlipCommand extends Command {
    constructor(client) {
        super(client, {
            name: "flip",
            group: "gambling",
            memberName: "flip",
            description: "Flips a coin.",
            examples: ["flip heads 50"],
            args: [{
                key: "amount",
                prompt: "How much will you bet?",
                type: "integer",
                min: 1
            }, {
                key: "side",
                prompt: "Which side will you bet on?",
                type: "string",
                validate: text => {
                    if (text.toLowerCase() == "heads" ||text.toLowerCase() == "tails") return true;
                    return "The side must be heads or tails."
                }
            }]
        });
    }

    //Heads < 0.5
    //Tails >= 0.5

    async run(msg, args) {
        var creditsJson = readJson("../../credits.json");
        var user = msg.author;
        var side = (Math.random() < 0.5) ? "heads" : "tails";
        var won = (args.side.toLowerCase() == side);
        var fieldName = "";
        var desc = "";

        for (var i = 0; i < creditsJson.length; i++) {
            if (creditsJson[i].id == user.id) {
                if (creditsJson[i].credits < args.amount)
                    return;

                if (won) {
                    creditsJson[i].credits += args.amount;
                    fieldName = "You win!"
                    desc += "You gained ``" + args.amount + "`` credits!\n";
                }
                else {
                    creditsJson[i].credits -= args.amount;
                    fieldName = "You lose!";
                }
                desc += "You now have ``" + creditsJson[i].credits + "`` credits."; 
            }
        }
        fs.writeFileSync(require.resolve("../../credits.json"), JSON.stringify(creditsJson));

        msg.client.channels.find("id", "533085381894078484").send({
            embed: {
                color: 7419530,
                author: {
                    name: "Coin Flip | " + user.username
                },
                thumbnail: {
                    url: (side == "heads") ? "https://i.imgur.com/SxB9xnT.png" : "http://i.imgur.com/EFbVOQw.png"
                },
                fields: [
                    {
                        name: fieldName,
                        value: desc
                    }
                ]
            }
        });
    }
}

var readJson = (path) => {
    return JSON.parse(fs.readFileSync(require.resolve(path)));
}