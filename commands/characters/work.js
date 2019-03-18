const {
    Command
} = require("discord.js-commando");
var moment = require("moment-timezone");
var fs = require("fs");

module.exports = class WorkCommand extends Command {
    constructor(client) {
        super(client, {
            name: "work",
            group: "characters",
            memberName: "work",
            description: "Sends a character to work.",
            examples: ["work 20"],
            args: [{
                key: "index",
                prompt: "What character do you want to send to work?",
                type: "integer"
            }]
        });
    }

    async run(msg, args) {
        var creditsJson = readJson("../../credits.json");
        var charactersJson = readJson("../../characters.json");
        var user = msg.author;

        for (var i = 0; i < creditsJson.length; i++) {
            if (creditsJson[i].id == user.id && creditsJson[i].characters.length > args.index) {
                if (creditsJson[i].characters.filter(f => f.working).length == 5) {
                    return msg.say("ServerHost doesn't have any more openings for you right now, try again once your characters finish working.");
                }

                if (creditsJson[i].characters[args.index].working) {
                    return msg.say("This character is already working!");
                }

                if (creditsJson[i].characters[args.index].workCooldown == moment.tz("America/Chicago").format("L")) {
                    return msg.say("This character is too tired to work right now! Try again tomorrow.");
                }

                if (creditsJson[i].characters[args.index].affection < 5) {
                    return msg.say("Your character refuses to go off to work! Try raising your affection with them more and try again.");
                }

                creditsJson[i].characters[args.index].affection -= 5;
                creditsJson[i].characters[args.index].working = true;
                creditsJson[i].characters[args.index].workStart = moment.tz("America/Chicago").format("L");

                msg.say({
                    embed: {
                        image: {
                            url: "attachment://burgers.png"
                        },
                        description: "You've sent " + charactersJson[creditsJson[i].characters[args.index].id].interactionName + " to work for ServerHost, check back on them in tomorrow with ``=working`` in order to claim their wages. Five affection points have been deducted."
                    },
                    files: [{
                      attachment: require.resolve("../../94.png"),
                      name: "burgers.png"
                    }] 
                });

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