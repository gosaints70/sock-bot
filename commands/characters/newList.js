const { Command } = require("discord.js-commando");
var fs = require("fs");

module.exports = class ListCommand extends Command {
    constructor(client) {
        super(client, {
            name: "list",
            group: "characters",
            memberName: "list",
            description: "Views your list.",
            examples: [
                "list",
                "list -user @MikaStarrydust -wishlist @Goob"
            ],
            args: [
                {
                    key: "argument1",
                    prompt: "Whats your first argument?",
                    type: "string",
                    default: ""
                },
                {
                    key: "value1",
                    prompt: "Whats the value of your first arguments?",
                    type: "user|string",
                    default: ""
                },
                {
                    key: "argument2",
                    prompt: "Whats your second argument?",
                    type: "string",
                    default: ""
                },
                {
                    key: "value2",
                    prompt: "Whats the value of your second argument?",
                    type: "user|string",
                    default: ""
                },
                {
                    key: "value3",
                    prompt: "Whats the value of your third argument?",
                    type: "string",
                    default: ""
                }
            ]
        });
    }

    async run(msg, args) {
        var creditsJson = readJson("../../credits.json");
        var charactersJson = readJson("../../characters.json");
        var user = msg.author;
        var wishlistUser;
        var searchQuery;
        var collectionQuery;
        var typeQuery;
        var emojiQuery;
        var page = 1;

        if (args.argument1 == "") {
            user = msg.author;
        }
        else if (isNumeric(args.argument1)) {
            page = args.argument1;
        } else if (args.argument1 == "-user") {
            if (args.value1 != "") {
                user = args.value1;
            }
            if (args.argument2 != "" && isNumeric(args.argument2)) {
                page = args.argument2;
            }
        } else if (args.argument2 == "-user") {
            if (args.value2 != "") {
                user = args.value2;
            }
            if (args.argument3 != "" && isNumeric(args.argument3)) {
                page = args.argument3;
            }
        }

        var desc = "";
        var total = 0;

        var charactersToList = [];
        var embedFields = [];
        var userToList;

        for (var i = 0; i < creditsJson.length; i++) {
            if (creditsJson[i].id == user.id) {
                if (args.argument1 == "-wishlist") {
                    if (args.value1 != "") {
                        wishlistUser = args.value1;
                    }
                    if (args.argument2 != "" && isNumeric(args.argument2)) {
                        page = args.argument2;
                    }
                    embedFields.push({
                        name: "Wishlist",
                        value: "<@" + wishlistUser.id + ">"
                    });
                    var wishlistUserObject = creditsJson.find(f => f.id == wishlistUser.id);
                    for (var j = 0; j < wishlistUserObject.wishlist.length; j++) {
                        var temp = creditsJson[i].characters.filter(f => f.id == wishlistUserObject.wishlist[j]);
                        //console.log(temp);
                        for (var k = 0; k < temp.length; k++) {
                            charactersToList.push(temp[k]);
                        }
                    }
                    userToList = wishlistUser;
                    charactersToList.sort((a, b) => creditsJson.find(f => f.id == userToList.id).characters.indexOf(a) - creditsJson.find(f => f.id == userToList.id).characters.indexOf(b));
                } else if (args.argument2 == "-wishlist") {
                    if (args.value2 != "") {
                        wishlistUser = args.value2;
                    }
                    if (args.argument3 != "" && isNumeric(args.argument3)) {
                        page = args.argument3;
                    }
                    embedFields.push({
                        name: "Wishlist",
                        value: "<@" + wishlistUser.id + ">"
                    });
                    var wishlistUserObject = creditsJson.find(f => f.id == wishlistUser.id);
                    for (var j = 0; j < wishlistUserObject.wishlist.length; j++) {
                        var temp = creditsJson[i].characters.filter(f => f.id == wishlistUserObject.wishlist[j]);
                        //console.log(temp);
                        for (var k = 0; k < temp.length; k++) {
                            charactersToList.push(temp[k]);
                        }
                    }
                    userToList = wishlistUser;
                    charactersToList.sort((a, b) => creditsJson.find(f => f.id == userToList.id).characters.indexOf(a) - creditsJson.find(f => f.id == userToList.id).characters.indexOf(b));
                } else {
                    charactersToList = creditsJson[i].characters;
                    userToList = user;
                }

                if (args.argument1 == "-name") {
                    //console.log(userToList.username);
                    
                    if (args.value1 != "") {
                        searchQuery = msg.content.split(" ")[2];
                    }
                    if (args.argument2 != "" && isNumeric(args.argument2)) {
                        page = args.argument2;
                    }
                    embedFields.push({
                        name: "Name Contains",
                        value: searchQuery
                    });

                    var trueList = [];
                    
                    for (var i = 0; i < charactersToList.length; i++) {
                        var parts = charactersJson[charactersToList[i].id].name.split(" ");
                        for (var j = 0; j < parts.length; j++) {
                            if (parts[j].toLowerCase() == searchQuery.toLowerCase()) {
                                trueList.push(charactersToList[i]);
                            }
                        }
                    }
                    charactersToList = trueList;
                } else if (args.argument2 == "-name") {
                    if (args.value2 != "") {
                        searchQuery = msg.content.split(" ")[4];
                    }
                    if (args.argument3 != "" && isNumeric(args.argument3)) {
                        page = args.argument3;
                    }
                    embedFields.push({
                        name: "Name Contains",
                        value: searchQuery
                    });
                    var trueList = [];
                    
                    for (var i = 0; i < charactersToList.length; i++) {
                        var parts = charactersJson[charactersToList[i].id].name.split(" ");
                        for (var j = 0; j < parts.length; j++) {
                            if (parts[j].toLowerCase() == searchQuery.toLowerCase()) {
                                trueList.push(charactersToList[i]);
                            }
                        }
                    }
                    charactersToList = trueList;
                }
                
                if (args.argument1 == "-collection") {
                    //console.log(userToList.username);
                    if (args.value1 != "") {
                        collectionQuery = msg.content.split(" ")[2];
                    }
                    if (args.argument2 != "" && isNumeric(args.argument2)) {
                        page = args.argument2;
                    }
                    embedFields.push({
                        name: "From Collection",
                        value: collectionQuery
                    });

                    charactersToList = charactersToList.filter(f => charactersJson[f.id].creator.toLowerCase() == collectionQuery.toLowerCase());
                } else if (args.argument2 == "-collection") {
                    if (args.value2 != "") {
                        collectionQuery = msg.content.split(" ")[4];
                    }
                    if (args.argument3 != "" && isNumeric(args.argument3)) {
                        page = args.argument3;
                    }
                    embedFields.push({
                        name: "From Collection",
                        value: collectionQuery
                    });                    
                    charactersToList = charactersToList.filter(f => charactersJson[f.id].creator.toLowerCase() == collectionQuery.toLowerCase());
                }

                if (args.argument1 == "-rarity") {
                    //console.log(userToList.username);
                    if (args.value1 != "") {
                        typeQuery = msg.content.split(" ")[2];
                    }
                    if (args.argument2 != "" && isNumeric(args.argument2)) {
                        page = args.argument2;
                    }
                    embedFields.push({
                        name: "Rarity",
                        value: typeQuery
                    });

                    charactersToList = charactersToList.filter(f => global.rarityTexts[f.rarity] == typeQuery.toLowerCase());
                } else if (args.argument2 == "-rarity") {
                    if (args.value2 != "") {
                        typeQuery = msg.content.split(" ")[4];
                    }
                    if (args.argument3 != "" && isNumeric(args.argument3)) {
                        page = args.argument3;
                    }
                    embedFields.push({
                        name: "Rarity",
                        value: typeQuery
                    });                    
                    charactersToList = charactersToList.filter(f => global.rarityTexts[f.rarity] == typeQuery.toLowerCase());
                }

                if (args.argument1 == "-emoji") {
                    //console.log(userToList.username);
                    if (args.value1 != "") {
                        emojiQuery = msg.content.split(" ")[2];
                    }
                    if (args.argument2 != "" && isNumeric(args.argument2)) {
                        page = args.argument2;
                    }
                    embedFields.push({
                        name: "Emoji",
                        value: emojiQuery
                    });
                    charactersToList = charactersToList.filter(f => f.category == emojiQuery.toLowerCase());
                } else if (args.argument2 == "-emoji") {
                    if (args.value2 != "") {
                        emojiQuery = msg.content.split(" ")[4];
                    }
                    if (args.argument3 != "" && isNumeric(args.argument3)) {
                        page = args.argument3;
                    }
                    embedFields.push({
                        name: "Emoji",
                        value: emojiQuery
                    });                    
                    charactersToList = charactersToList.filter(f => f.category == emojiQuery.toLowerCase());
                }
                total = charactersToList.length;
                for (var j = charactersToList.length - 1 - (20 * (page - 1)); j >= charactersToList.length - (20 * page) && j >= 0; j--) {
                    var category = " ";
                    if (charactersToList[j].category != "") {
                        category += charactersToList[j].category;
                        category += " ";
                    }
                    if (charactersJson[charactersToList[j].id].rare)
                        desc += creditsJson.find(f => f.id == userToList.id).characters.indexOf(charactersToList[j]) + " |" + category + "[" + charactersToList[j].rarity + "] " + charactersJson[charactersToList[j].id].name + " ⭐ | Affection: " + charactersToList[j].affection + "\n";
                    else
                        desc += creditsJson.find(f => f.id == userToList.id).characters.indexOf(charactersToList[j]) + " |" + category + "[" + charactersToList[j].rarity + "] " + charactersJson[charactersToList[j].id].name + " | Affection: " + charactersToList[j].affection + "\n";
                }
                break;
            }
        }

        return msg.say({
            embed: {
                color: 7419530,
                author: {
                    name: user.username + "'s Characters"
                },
                description: desc,
                fields: embedFields,
                footer: {
                    text: "Page " + page + "/" + Math.ceil(total / 20)
                }
            }
        });
    }
};

var readJson = (path) => {
    return JSON.parse(fs.readFileSync(require.resolve(path)));
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function isString(x) {
    return Object.prototype.toString.call(x) === "[object String]"
}

function isNumeric(num){
    return !isNaN(num)
}