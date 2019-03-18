const Discord = require("discord.js");
const client = new Discord.Client();
const { Command } = require("discord.js-commando");
var fs = require("fs");

module.exports = class SetLevelCommand extends Command {
    constructor(client) {
        super(client, {
            name: "setlevel",
            group: "characters",
            memberName: "setlevel",
            description: "Sets the level of the specified users character in the specified stat.",
            examples: ["setlevel @MikaStarrydust combat 5"],
            userPermission: ["MANAGE_MESSAGES"],
            args: [
                {
                    key: "member",
                    prompt: "Whose stats would you like to change?",
                    type: "member",
                    default: "noinput"
                },
                {
                    key: "character",
                    prompt: "Which characters would you like to see?",
                    type: "string"
                },
                {
                    key: "stat",
                    prompt: "Which stat would you like to chage?",
                    type: "string"
                },
                {
                    key: "level",
                    prompt: "What level would you like to set the stat to?",
                    type: "integer",
                    min: 1
                }
            ]
        });
    }

    async run(msg, args) {
        var creditsJson = readJson("../../credits.json");
        var user = args.member.user;
        var currentStats;

        for (var i = 0; i < creditsJson.length; i++) {
            if (creditsJson[i].id == user.id) {
                for (var j = 0; j < creditsJson[i].characters.length; j++) {
                    if (args.character.toLowerCase() == creditsJson[i].characters[j].name.toLowerCase())
                        currentStats = creditsJson[i].characters[j].stats;
                }
            }
        }

        if (currentStats == null)
            return;

        currentStats[Object.keys(currentStats)[Object.keys(currentStats).indexOf(args.stat.toLowerCase())]] = args.level;

        fs.writeFileSync(require.resolve("../../credits.json"), JSON.stringify(creditsJson));
        
        var returnMessage = capitalizeFirstLetter(args.character) + "'s " + args.stat + " level has been set to " + args.level + ".\n\n";

        returnMessage += "**Updated stats for " + capitalizeFirstLetter(args.character) + "**\n\n";

        for (var i = 0; i < Object.keys(currentStats).length; i++) {
            returnMessage += capitalizeFirstLetter(Object.keys(currentStats)[i]) + ": " + Object.values(currentStats)[i] + "\n";
        }

        return msg.say({
            embed:{
                color: 7419530,
                description: returnMessage
            }
        });

        /*msg.member.guild.channels.find("name", "level-up").send({
            embed:{
                color: 7419530,
                description: "<@" + user.id + "> *has leveled up!*\n" + capitalizeFirstLetter(Object.keys(currentStats)[Object.keys(currentStats).indexOf(args.stat.toLowerCase())]) + " has been increased to level " + Object.values(currentStats)[Object.keys(currentStats).indexOf(args.stat.toLowerCase())] + "!"
            }
        });*/
    }
};

var readJson = (path) => {
    return JSON.parse(fs.readFileSync(require.resolve(path)));
}
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}