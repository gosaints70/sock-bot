const Discord = require('discord.js');
const { Command } = require('discord.js-commando');
var fs = require('fs');

module.exports = class TestCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'test',
            group: 'general',
            memberName: 'test',
            description: 'Sends a message as the bot.',
            examples: ['test']
        });
    }

    async run(msg) {
        msg.channel.send("", {
            files: [
                'https://i.imgur.com/hjno9Y9.png'
            ]
        });
    }
};