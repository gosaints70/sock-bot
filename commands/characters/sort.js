const {
    Command
} = require("discord.js-commando");
var moment = require("moment-timezone");
var fs = require("fs");

moment.tz("America/Chicago").format();

module.exports = class SortCommand extends Command {
    constructor(client) {
        super(client, {
            name: "sort",
            group: "characters",
            memberName: "sort",
            description: "Sorts a character.",
            examples: ["sort 2 🤠"],
            args: [{
                key: "index",
                prompt: "Who do you wanna sort?",
                type: "integer",
                min: 0
            }, {
                key: "category",
                prompt: "What category do you want to sort them into?",
                type: "string",
                //max: 1,
                default: ""
            }]
        });
    }

    run(msg, args) {
        var creditsJson = readJson("../../credits.json");
        var charactersJson = readJson("../../characters.json");
        var user = msg.author;

        for (var i = 0; i < creditsJson.length; i++) {
            if (creditsJson[i].id == user.id && creditsJson[i].characters.length > args.index) {

                if (args.category == "") {
                    creditsJson[i].characters[args.index].category = "";
                    fs.writeFileSync(require.resolve("../../credits.json"), JSON.stringify(creditsJson));
                    return msg.say("You've unsorted " + charactersJson[creditsJson[i].characters[args.index].id].interactionName + ".");
                }

                creditsJson[i].characters[args.index].category = args.category;

                msg.say("You've sorted " + charactersJson[creditsJson[i].characters[args.index].id].interactionName + " under the " + args.category + " category.");
                fs.writeFileSync(require.resolve("../../credits.json"), JSON.stringify(creditsJson));
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