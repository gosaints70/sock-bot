const Discord = require('discord.js');
const client = new Discord.Client();
const { Command } = require('discord.js-commando');
var fs = require('fs');

module.exports = class ProfileCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'profile',
            group: 'characters',
            memberName: 'profile',
            description: 'Shows the profile of the specified user.',
            examples: ['profile @MikaStarrydust'],
            args: [
                {
                    key: 'member',
                    prompt: 'Whose profile would you like to view?',
                    type: 'member',
                    default: 'noinput'
                },
                {
                    key: 'character',
                    prompt: 'Which characters profile would you like to view? (optional)',
                    type: 'string',
                    default: 'noinput'
                }
            ]
        });
    }

    async run(msg, args) {
        var creditsJson = readJson("../../credits.json");
        var user = (args.member == "noinput") ? msg.author : args.member.user;
        var currentUser;

        for (var i = 0; i < creditsJson.length; i++) {
            if (creditsJson[i].id == user.id) {
                currentUser = creditsJson[i];
            }
        }

        var title;
        var column1row1 = {
            name: "Total Owned",
            value: currentUser.characters.length,
            inline: true
        };
        var column2row1 = {
            name: "Total Owned (Unique)",
            value: uniqFast(currentUser.characters, msg).length,
            inline: true
        };
        var column1row2 = {
            name: "Credits",
            value: currentUser.credits,
            inline: true
        };
        var column2row2 = {
            name: "Favorite Character",
            value: (currentUser.favoriteCharacter == -1) ? "*No One*" : charactersJson[currentUser.favoriteCharacter].name,
            inline: true
        };

        if (currentUser.favoriteCharacter == -1) {
            return msg.say({
                embed:{
                    color: 7419530,
                    title: user.username,
                    thumbnail: {
                        url: user.avatarURL
                    },
                    fields: [
                        column1row1,
                        column2row1,
                        column1row2,
                        column2row2
                    ],
                }
            });
        }
        else
        {
            return msg.say({
                embed:{
                    color: 7419530,
                    title: user.username,
                    thumbnail: {
                        url: user.avatarURL
                    },
                    fields: [
                        column1row1,
                        column2row1,
                        column1row2,
                        column2row2
                    ],
                    image: {
                        url: charactersJson[currentUser.favoriteCharacter].imageURL
                    }
                }
            });
        }
    }
};

var readJson = (path) => {
    return JSON.parse(fs.readFileSync(require.resolve(path)));
}
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function uniqFast(array) {
    var filtered = [];

    for (var i = 0; i < array.length; i++) {
        if (filtered.filter(f => f.id == array[i].id).length == 0)
            filtered.push(array[i]);
    }

    return filtered;
}