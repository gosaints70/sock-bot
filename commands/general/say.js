const Discord = require("discord.js");
const { Command } = require("discord.js-commando");
var fs = require("fs");

module.exports = class SayCommand extends Command {
    constructor(client) {
        super(client, {
            name: "say",
            group: "general",
            memberName: "say",
            description: "Sends a message as the bot.",
            examples: ["say #general I love Mika"],
            userPermissions: ["MANAGE_MESSAGES"],
            args: [
                {
                    key: "channel",
                    prompt: "Which channel would you like to send the message in?",
                    type: "channel"
                },
                {
                    key: "message",
                    prompt: "What would you like the bot to say?",
                    type: "string"
                }
            ]
        });
    }

    async run(msg, args) {
        args.channel.send(args.message);
        //return msg.say(message);
    }
};