const { Command } = require('discord.js-commando');
var fs = require('fs');

module.exports = class WishlistCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'wishlist',
            aliases: ['w'],
            group: 'characters',
            memberName: 'wishlist',
            description: 'Adds a character to your wishlist.',
            examples: [
                'wishlist',
                'wishlist add The Chad',
                'wishlist remove The Chad'
            ],
            args: [
                {
                    key: 'command',
                    prompt: 'What function do you want to execute?',
                    type: 'string',
                    default: ''
                },
                {
                    key: 'name',
                    prompt: 'Who do you want to add to your wishlist?',
                    type: 'string',
                    default: ''
                }
            ]
        });
    }

    async run(msg, args) {
        var creditsJson = readJson("../../credits.json");
        var charactersJson = readJson("../../characters.json");
        var user = msg.author;
        
        switch (args.command) {
            case "add":
                addToWishlist(msg, args);
                break;

            case "a":
                addToWishlist(msg, args);
                break;
            
            case "remove":
                removeFromWishlist(msg, args);
                break;

            case "r":
                removeFromWishlist(msg, args);
                break; 

            default:
                showWishlist(msg, args);
                break;
        }
    }
};

var readJson = (path) => {
    return JSON.parse(fs.readFileSync(require.resolve(path)));
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function updateRarity(msg, args) {
    var creditsJson = readJson("../../credits.json");
    var charactersJson = readJson("../../characters.json");

    var count = 0;

    
    for(var i = 0; i < creditsJson.length; i++) {
        if (creditsJson[i].wishlist.filter(f => f.id == charactersJson.findIndex(f => f.name.toLowerCase() == args.name.toLowerCase()).name) > 0)
            count++;
    }

    if (parseFloat(count) / parseFloat(creditsJson.filter(f => f.characters.length > 0).length) >= 0.5) {
        charactersJson.find(f => f.name.toLowerCase() == args.name.toLowerCase()).rare = true;
        fs.writeFileSync(require.resolve('../../characters.json'), JSON.stringify(charactersJson));
    } else {
        charactersJson.find(f => f.name.toLowerCase() == charactersJson[j].name.toLowerCase()).rare = false;
        fs.writeFileSync(require.resolve('./characters.json'), JSON.stringify(charactersJson));
    }
}

function addToWishlist(msg, args) {
    var creditsJson = readJson("../../credits.json");
    var charactersJson = readJson("../../characters.json");
    var user = msg.author;

    if (charactersJson.find(f => f.name.toLowerCase() == args.name.toLowerCase()) != null) {
        for (var i = 0; i < creditsJson.length; i++) {
            if (creditsJson[i].id == user.id) {
                creditsJson[i].wishlist.push(charactersJson.findIndex(f => f.name.toLowerCase() == args.name.toLowerCase()));
                fs.writeFileSync(require.resolve('../../credits.json'), JSON.stringify(creditsJson));
                msg.say(charactersJson.find(f => f.name.toLowerCase() == args.name.toLowerCase()).name + " has been added to your wishlist.");
            }
        }
    }
}

function removeFromWishlist(msg, args)  {
    var creditsJson = readJson("../../credits.json");
    var charactersJson = readJson("../../characters.json");
    var user = msg.author;

    if (charactersJson.find(f => f.name.toLowerCase() == args.name.toLowerCase()) != null) {
        for (var i = 0; i < creditsJson.length; i++) {
            if (creditsJson[i].wishlist.find(f => f == charactersJson.findIndex(f => f.name.toLowerCase() == args.name.toLowerCase())) != null) {
                if (creditsJson[i].id == user.id) {
                    creditsJson[i].wishlist.splice(creditsJson[i].wishlist.findIndex(f => f == charactersJson.findIndex(f => f.name.toLowerCase() == args.name.toLowerCase())), 1);
                    fs.writeFileSync(require.resolve('../../credits.json'), JSON.stringify(creditsJson));
                    msg.say(charactersJson.find(f => f.name.toLowerCase() == args.name.toLowerCase()).name + " has been removed from your wishlist.");
                }
            }
        }
    }
}

function showWishlist(msg, args) {
    var creditsJson = readJson("../../credits.json");
    var charactersJson = readJson("../../characters.json");
    var user = msg.author;

    var desc = "";

    for (var i = 0; i < creditsJson.length; i++) {
        if (creditsJson[i].id == user.id) {
            for (var j = 0; j < creditsJson[i].wishlist.length; j++) {
                desc += charactersJson[creditsJson[i].wishlist[j]].name + " (" + creditsJson[i].wishlist[j] + ")\n";
            }
        }
    }

    msg.say({
        embed: {
            color: 7419530,
            author: {
                name: user.username + "'s wishlist"
            },
            description: desc
        }
    });
}