const {
    Command
} = require('discord.js-commando');
var moment = require('moment-timezone');
var fs = require('fs');

moment.tz("America/Chicago").format();

module.exports = class DailyGachaCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'dailykeys',
            group: 'characters',
            memberName: 'dailykeys',
            description: 'Gets your daily keys.',
            examples: ['dailykeys']
        });
    }

    run(msg) {
        var creditsJson = readJson("../../credits.json");
        var keysJson = readJson("../../keys.json");
        var user = msg.author;
        var desc = "Your turned in your old set of keys for a new one! You now have...\n\n"


        for (var i = 0; i < creditsJson.length; i++) {
            if (creditsJson[i].id == user.id) {
                if (creditsJson[i].lastDailyKeys != moment.tz("America/Chicago").format('L')) {
                    creditsJson[i].lastDailyKeys = moment.tz("America/Chicago").format('L');
                    creditsJson[i].keys = [];
                    for (var j = 0; j < 4; j++) {
                        creditsJson[i].keys.push(keysJson[Math.floor(Math.random() * keysJson.length)]);
                    }
                    for (var j = 0; j < 4; j++) {
                        desc += uppercaseFirst(creditsJson[i].keys[j]) + " Key\n"
                    }
                    fs.writeFileSync(require.resolve('../../credits.json'), JSON.stringify(creditsJson));

                    msg.say({
                        embed: {
                            author: {
                                name: "Daily Keys"
                            },
                            color: 7419530,
                            description: desc
                        }
                    });
                } else {
                    return msg.say({
                        embed: {
                            color: 7419530,
                            description: "You already claimed your daily keys! Wait until tomorrow to try again."
                        }
                    });
                }
            } 
        }
    }
}

var readJson = (path) => {
    return JSON.parse(fs.readFileSync(require.resolve(path)));
}

function uppercaseFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}