const Discord = require("discord.js");
const { Command } = require("discord.js-commando");
const humanizeDuration = require("humanize-duration");
var fs = require("fs");

module.exports = class UptimeCommand extends Command {
    constructor(client) {
        super(client, {
            name: "uptime",
            group: "general",
            memberName: "uptime",
            description: "Shows the uptime of the bot.",
            examples: ["uptime"]
        });
    }

    async run(msg, args) {
        msg.say(humanizeDuration(msg.client.uptime));
    }
};