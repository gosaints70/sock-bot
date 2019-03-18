const { Command } = require('discord.js-commando');
var fs = require('fs');

module.exports = class CollectionCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'collection',
            aliases: ['completion'],
            group: 'characters',
            memberName: 'collection',
            description: 'View how far you are towards completing a collection.',
            examples: [
                'collection rare'
            ],
            args: [
                {
                    key: 'name',
                    prompt: 'Which collection do you want to view?',
                    type: 'string'
                },
                {
                    key: 'user',
                    prompt: 'Whos collection do you want to view?',
                    type: 'user|integer',
                    default: '1'
                },
                {
                    key: 'page',
                    prompt: 'Which page do you want to view?',
                    type: 'integer',
                    default: '1'
                }
            ]
        });
    }

    async run(msg, args) {
        var creditsJson = readJson("../../credits.json");
        var charactersJson = readJson("../../characters.json");
        var collectionsJson = readJson("../../collections.json");
        var user = msg.author;
        var page = args.page;

        if (Number.isInteger(args.user)) {
            page = args.user
        }
        else if (args.user != "1") {
            user = args.user;
        }
        
 
        var desc = "";
        var category = "";

        var embedInfo = [];
        var owned = 0;

        switch(args.name.toLowerCase()) {
            case "rare":
                var rareCollection = charactersJson.filter(f => f.rare);
                category = "Rare";
                for (var i = 0; i < creditsJson.length; i++) {
                    if (creditsJson[i].id == user.id) {
                        for (var j = rareCollection.length - 1 - (25 * (page - 1)); j >= rareCollection.length - (25 * page) && j >= 0; j--) {
                            var name = rareCollection[j].name;
                            if (creditsJson[i].characters.filter(f => f.id == charactersJson.indexOf(rareCollection[j])).length > 0)
                                owned++;

                            embedInfo.push({
                                name: (rareCollection[j].rare) ? name + " :star:" : name,
                                value: (creditsJson[i].characters.filter(f => f.id == charactersJson.indexOf(rareCollection[j])).length > 0) ? ":white_check_mark: " + charactersJson.filter(f => f.name.toLowerCase() == rareCollection[j].name).length + " Owned" : ":x: Not Owned",
                                inline: true
                            });
                        }
                        return msg.say({
                            embed: {
                                color: 7419530,
                                author: {
                                    name: user.username + " | " + category + " Characters | " + Math.floor((parseFloat(owned) / parseFloat(rareCollection.length)) * 100) + "%" 
                                },
                                fields: embedInfo,
                                footer: {
                                    text: "Page " + page + "/" + Math.ceil(charactersJson.filter(f => rare).length / 25)
                                }
                            }
                        });
                    }
                }
                break;

            case "all":
                category = "All";

                var categories = [];

                for (var i = 0; i < charactersJson.length; i++) {
                    if (!categories.includes(charactersJson[i].creator)) {
                        categories.push(charactersJson[i].creator);
                    }
                }

                for (var i = 0; i < creditsJson.length; i++) {
                    if (creditsJson[i].id == user.id) {
                        var totalOwned = 0;
                        for (var j = categories.length - 1 - (25 * (page - 1)); j >= categories.length - (25 * page) && j >= 0; j--) {
                            var completed = true;
                            var owned = 0;
                            for (var k = 0; k < charactersJson.filter(f => f.creator == categories[j]).length; k++) {
                                if (!creditsJson[i].characters.filter(f => f.id == charactersJson.indexOf(charactersJson.filter(f => f.creator == categories[j])[k])).length > 0) {
                                    completed = false;
                                }
                                else
                                {
                                    owned++;
                                    totalOwned++;
                                }
                                
                            }                                    

                            embedInfo.push({
                                name: categories[j],
                                value: (completed) ? ":white_check_mark: 100% Complete" : ":x: " + Math.floor((parseFloat(owned) / parseFloat(charactersJson.filter(f => f.creator == categories[j]).length)) * 100) + "% Complete",
                                inline: true
                            });
                        }
                        return msg.say({
                            embed: {
                                color: 7419530,
                                author: {
                                    name: user.username + " | " + category + " Collections | " + Math.floor((parseFloat(totalOwned) / parseFloat(charactersJson.length)) * 100) + "%" 
                                },
                                fields: embedInfo,
                                footer: {
                                    text: "Page " + page + "/" + Math.ceil(charactersJson.filter(f => f.creator.toLowerCase() == args.name.toLowerCase()).length / 25)
                                }
                            }
                        });
                    }
                }
                break;
            
            default:

                var userCollection = charactersJson.filter(f => f.creator.toLowerCase() == args.name.toLowerCase());
                userCollection.sort((a, b) => b.rare - a.rare);
                userCollection.reverse();
                var typeCollection = collectionsJson.filter(f => f.name.toLowerCase() == args.name.toLowerCase());
                typeCollection.sort((a, b) => b.rare - a.rare);
                typeCollection.reverse();

                for (var i = 0; i < creditsJson.length; i++) {
                    if (creditsJson[i].id == user.id) {
                        if (userCollection.length > 0) {
                            category = userCollection[0].creator + "'s";
                            for (var j = userCollection.length - 1; j >= 0; j--) {
                                if (creditsJson[i].characters.filter(f => f.id == charactersJson.indexOf(userCollection[j])).length > 0)
                                    owned++;
                            }
                            for (var j = userCollection.length - 1 - (25 * (page - 1)); j >= userCollection.length - (25 * page) && j >= 0; j--) {
                                
                                var name = userCollection[j].name;
                                embedInfo.push({
                                    name: (userCollection[j].rare) ? name + " :star:" : name,
                                    value: (creditsJson[i].characters.filter(f => f.id == charactersJson.indexOf(userCollection[j])).length > 0) ? ":white_check_mark: " + creditsJson[i].characters.filter(f => f.id == charactersJson.indexOf(userCollection[j])).length + " Owned" : ":x: Not Owned",
                                    inline: true
                                });
                            }
                            return msg.say({
                                embed: {
                                    color: 7419530,
                                    author: {
                                        name: user.username + " | " + category + " Characters | " + Math.floor((parseFloat(owned) / parseFloat(userCollection.length)) * 100) + "%" 
                                    },
                                    fields: embedInfo,
                                    footer: {
                                        text: "Page " + page + "/" + Math.ceil(userCollection.length / 25)
                                    }
                                }
                            });
                        }
                        else if (typeCollection.length > 0) {
                            typeCollection = typeCollection[0];
                            category = typeCollection.name;
                            for (var j = typeCollection.characters.length - 1; j >= 0; j--) {
                                if (creditsJson[i].characters.filter(f => f.id == typeCollection.characters[j]).length > 0)
                                    owned++;
                            }
                            for (var j = typeCollection.characters.length - 1 - (25 * (page - 1)); j >= typeCollection.characters.length - (25 * page) && j >= 0; j--) {
                                
                                var name = charactersJson[typeCollection.characters[j]].name;
                                embedInfo.push({
                                    name: (charactersJson[typeCollection.characters[j]].rare) ? name + " :star:" : name,
                                    value: (creditsJson[i].characters.filter(f => f.id == typeCollection.characters[j]).length > 0) ? ":white_check_mark: " + creditsJson[i].characters.filter(f => f.id == typeCollection.characters[j]).length + " Owned" : ":x: Not Owned",
                                    inline: true
                                });
                            }
                            return msg.say({
                                embed: {
                                    color: 7419530,
                                    author: {
                                        name: user.username + " | " + category + " Characters | " + Math.floor((parseFloat(owned) / parseFloat(typeCollection.characters.length)) * 100) + "%" 
                                    },
                                    fields: embedInfo,
                                    footer: {
                                        text: "Page " + page + "/" + Math.ceil(typeCollection.characters.length / 25)
                                    }
                                }
                            });
                        }
                        else {
                            return msg.say({
                                embed: {
                                    color: 7419530,
                                    description: "Oops! Looks like that collection doesn't exist."
                                }
                            });
                        }                       
                    }
                }
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