const Discord = require("discord.js");
const {
    Command
} = require("discord.js-commando");
var fs = require("fs");

var messages = [];
var requestTimeouts = [];
var tradeTimeouts = [];

module.exports = class TradeCommand extends Command {
    constructor(client) {
        super(client, {
            name: "trade",
            aliases: ["t"],
            group: "characters",
            memberName: "trade",
            description: "All of the trade commands wrapped into one.",
            examples: [
                "trade",
                "trade start MikaStarrydust",
                "trade accept senpaiviolet",
                "trade confirm"
            ],
            args: [{
                    key: "command",
                    prompt: "What function do you want to execute?",
                    type: "string",
                    default: ""
                },
                {
                    key: "name",
                    prompt: "Who do you want to trade with?/Who do you want to add or remove to the trade?",
                    type: "integer|user",
                    default: ""
                }
            ]
        });
    }

    /*var commands = {
        "start": (msg, args) => {
            startTrade(msg, args);
        }
    }*/

    async run(msg, args) {
        var creditsJson = readJson("../../credits.json");
        var charactersJson = readJson("../../characters.json");
        var user = msg.author;

        //commands[args.command]();

        switch (args.command) {
            case "start":
                startTrade(msg, args);
                break;

            case "s":
                startTrade(msg, args);
                break;

            case "add":
                addToTrade(msg, args);
                break;

            case "a":
                addToTrade(msg, args);
                break;

            case "accept":
                acceptTrade(msg, args);
                break;

            case "ac":
                acceptTrade(msg, args);
                break;

            case "remove":
                removeFromTrade(msg, args);
                break;

            case "confirm":
                confirmTrade(msg, args);
                break;

            case "c":
                confirmTrade(msg, args);
                break;

            case "r":
                removeFromTrade(msg, args);
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

function startTrade(msg, args) {
    var tradesJson = readJson("../../trades.json");

    if (args.name == msg.author)
        return msg.say("You can't trade with yourself!");

    if (tradesJson.filter(f => f.recipient == args.name.id).length > 0) {
        if (tradesJson.find(f => f.recipient == args.name.id).accepted)
            return msg.say("Sorry, this user is already in a trade.");
        else
            return msg.say("Sorry, this user already has a pending trade request.");
    }
    else if (tradesJson.filter(f => f.starter == args.name.id).length > 0) {
        if (tradesJson.find(f => f.starter == args.name.id).accepted)
            return msg.say("Sorry, this user is already in a trade.");
        else
            return msg.say("Sorry, this user already has a pending trade request.");
    }

    if (tradesJson.filter(f => f.starter == msg.author.id).length > 0) {
        if (tradesJson.find(f => f.starter == msg.author.id).accepted)
            return msg.say("Sorry, you're already in a trade.");
        else
            return msg.say("Sorry, you have a pending trade request.");
    } else if (tradesJson.filter(f => f.recipient == msg.author.id).length > 0) {
        if (tradesJson.find(f => f.recipient == msg.author.id).accepted)
            return msg.say("Sorry, you're already in a trade.");
        else
            return msg.say("Sorry, you have a pending trade request.");
    }

    if (msg.client.users.find(f => f.id == args.name.id) != null) {
        tradesJson.push({
            "starter": msg.author.id,
            "recipient": args.name.id,
            "accepted": false,
            "starterOfferings": [],
            "recipientOfferings": [],
            "starterAccepted": false,
            "recipientAccepted": false
        });

        fs.writeFileSync(require.resolve("../../trades.json"), JSON.stringify(tradesJson));

        let timeoutID = setTimeout(function() {
            var updatedTrades = readJson("../../trades.json");
            updatedTrades.splice(tradesJson.findIndex(f => f.recipient == args.name.id && f.starter == msg.author.id), 1);
            msg.say("Sorry <@" + msg.author.id + ">, your trade request has expired.");
            fs.writeFileSync(require.resolve("../../trades.json"), JSON.stringify(updatedTrades));
        }, 30000)

        ///String.Format fix it
        msg.say("<@" + args.name.id + ">, <@" + msg.author.id + "> would like to trade with you. Do ``=trade accept " + msg.author.username + "`` to accept their trade.").then(requestTimeouts.push(
            {
                trade: tradesJson.find(f => f.recipient == args.name.id && f.starter == msg.author.id),
                timeout: timeoutID
        }));
    }
    else
    {
        return msg.say("That user doesn't exist! Make sure you enter their full username.");
    }
}

function acceptTrade(msg, args) {
    var creditsJson = readJson("../../credits.json");
    var tradesJson = readJson("../../trades.json");
    var user = creditsJson.find(f => f.id == msg.author.id);

    if (tradesJson.filter(f => f.recipient == msg.author.id && f.starter == args.name.id).length == 0)
        return;

    //console.log("timeouttest", requestTimeouts.find(f => f.trade.recipient == msg.author.id && f.trade.starter == args.name.id));
    clearTimeout(requestTimeouts.find(f => f.trade.recipient == msg.author.id && f.trade.starter == args.name.id).timeout);
    requestTimeouts.splice(requestTimeouts.findIndex(f => f.trade.recipient == msg.author.id && f.trade.starter == args.name.id), 1);

    tradesJson.filter(f => f.recipient == msg.author.id).find(f => f.starter == args.name.id).accepted = true;

    user.currentTrade = tradesJson.findIndex(f => f.recipient == msg.author.id && f.starter == args.name.id);

    creditsJson.find(f => f.id == args.name.id).currentTrade = tradesJson.findIndex(f => f.recipient == msg.author.id && f.starter == args.name.id);

    var tradeInfo = [];

    tradeInfo.push({
        name: msg.client.users.find(f => f.id == tradesJson[user.currentTrade].starter).username + "'s Offerings:",
        value: "Nothing."
    });

    tradeInfo.push({
        name: msg.client.users.find(f => f.id == tradesJson[user.currentTrade].recipient).username + "'s Offerings:",
        value: "Nothing."
    });

    var id;

    var timeoutID = setTimeout(function() {
        var updatedTrades = readJson("../../trades.json");
        var tradeIndex = tradesJson.findIndex(f => f.starter == tradesJson[user.currentTrade].starter && f.recipient == msg.author.id);
        updatedTrades.splice(tradeIndex, 1);
        fs.writeFileSync(require.resolve("../../trades.json"), JSON.stringify(updatedTrades));
        msg.say("Sorry <@" + tradesJson[tradeIndex].starter + ">, your trade with <@" + tradesJson[tradeIndex].recipient + "> has expired.");
        messages.splice(tradeIndex, 1);
        for (var i = 0; i < creditsJson.length; i++) {
            if (creditsJson[i].currentTrade != -1 && creditsJson[i].currentTrade >= tradeIndex) {
                creditsJson[i].currentTrade--;
                fs.writeFileSync(require.resolve("../../credits.json"), JSON.stringify(creditsJson));
            }
        }
    }, 90000);

    msg.say({
        embed: {
            author: {
                name: "Trade"
            },
            fields: tradeInfo
        }
    }).then(sent => messages.push(sent)).then(tradeTimeouts.push(
        {
            trade: tradesJson.find(f => f.starter == tradesJson[user.currentTrade].starter && f.recipient == msg.author.id),
            timeout: timeoutID
    }));;

    fs.writeFileSync(require.resolve("../../trades.json"), JSON.stringify(tradesJson));
    fs.writeFileSync(require.resolve("../../credits.json"), JSON.stringify(creditsJson));
}

function addToTrade(msg, args) {

    if (!isNumeric(args.name))
        return;

    var creditsJson = readJson("../../credits.json");
    var tradesJson = readJson("../../trades.json");
    var characters = readJson("../../characters.json");

    if (creditsJson.find(f => f.id == msg.author.id).currentTrade == -1)
        return;

    var user = creditsJson.find(f => f.id == msg.author.id);

    if (tradesJson[user.currentTrade].starter == msg.author.id) {
        if (user.characters.length > parseInt(args.name) && !tradesJson[user.currentTrade].starterOfferings.includes(args.name)) {
            tradesJson[user.currentTrade].starterOfferings.push(args.name);
            tradesJson[user.currentTrade].starterAccepted = false;
            tradesJson[user.currentTrade].recipientAccepted = false;
        }
    } else if (tradesJson[user.currentTrade].recipient == msg.author.id) {
        if (user.characters.length > parseInt(args.name) && !tradesJson[user.currentTrade].recipientOfferings.includes(args.name)) {
            tradesJson[user.currentTrade].recipientOfferings.push(args.name);
            tradesJson[user.currentTrade].starterAccepted = false;
            tradesJson[user.currentTrade].recipientAccepted = false;
        }
    }

    fs.writeFileSync(require.resolve("../../trades.json"), JSON.stringify(tradesJson));

    var tradeInfo = [];

    var starterOfferingsValue = "";
    var recipientOfferingsValue = "";

    for (var i = 0; i < tradesJson[user.currentTrade].starterOfferings.length; i++) {
        starterOfferingsValue += "[" + creditsJson.find(f => f.id == tradesJson[user.currentTrade].starter).characters[tradesJson[user.currentTrade].starterOfferings[i]].rarity + "] " + charactersJson[creditsJson.find(f => f.id == tradesJson[user.currentTrade].starter).characters[tradesJson[user.currentTrade].starterOfferings[i]].id].name + "\n";
    }

    for (var i = 0; i < tradesJson[user.currentTrade].recipientOfferings.length; i++) {
        recipientOfferingsValue += "[" + creditsJson.find(f => f.id == tradesJson[user.currentTrade].recipient).characters[tradesJson[user.currentTrade].recipientOfferings[i]].rarity + "] " + charactersJson[creditsJson.find(f => f.id == tradesJson[user.currentTrade].recipient).characters[tradesJson[user.currentTrade].recipientOfferings[i]].id].name + "\n";
    }

    tradeInfo.push({
        name: msg.client.users.find(f => f.id == tradesJson[user.currentTrade].starter).username + "'s Offerings:",
        value: (starterOfferingsValue == "") ? "Nothing." : starterOfferingsValue
    });

    tradeInfo.push({
        name: msg.client.users.find(f => f.id == tradesJson[user.currentTrade].recipient).username + "'s Offerings:",
        value: (recipientOfferingsValue == "") ? "Nothing." : recipientOfferingsValue
    });

    messages[user.currentTrade].edit({
        embed: {
            author: {
                name: "Trade"
            },
            fields: tradeInfo
        }
    }).then(sent => messages[user.currentTrade] = sent);
}

function removeFromTrade(msg, args) {
    if (!isNumeric(args.name))
        return;

    var creditsJson = readJson("../../credits.json");
    var tradesJson = readJson("../../trades.json");

    if (creditsJson.find(f => f.id == msg.author.id).currentTrade == -1)
        return;

    var user = creditsJson.find(f => f.id == msg.author.id);

    if (tradesJson[user.currentTrade].starter == msg.author.id) {
        if (tradesJson[user.currentTrade].starterOfferings.includes(args.name)) {
            tradesJson[user.currentTrade].starterOfferings.splice(tradesJson[user.currentTrade].starterOfferings.findIndex(f => f == args.name), 1);
            tradesJson[user.currentTrade].starterAccepted = false;
            tradesJson[user.currentTrade].recipientAccepted = false;
        }
    } else if (tradesJson[user.currentTrade].recipient == msg.author.id) {
        if (tradesJson[user.currentTrade].recipientOfferings.includes(args.name)) {
            tradesJson[user.currentTrade].recipientOfferings.splice(tradesJson[user.currentTrade].recipientOfferings.findIndex(f => f == args.name), 1);
            tradesJson[user.currentTrade].starterAccepted = false;
            tradesJson[user.currentTrade].recipientAccepted = false;
        }
    }

    fs.writeFileSync(require.resolve("../../trades.json"), JSON.stringify(tradesJson));
}

function confirmTrade(msg, args) {
    var charactersJson = readJson("../../characters.json");
    var creditsJson = readJson("../../credits.json");
    var tradesJson = readJson("../../trades.json");
    var user = creditsJson.find(f => f.id == msg.author.id);

    if (tradesJson[user.currentTrade].starter == msg.author.id)
        tradesJson[user.currentTrade].starterAccepted = true;
    else if (tradesJson[user.currentTrade].recipient == msg.author.id)
        tradesJson[user.currentTrade].recipientAccepted = true;

    var tradeInfo = [];

    var starterOfferingsValue = "";
    var recipientOfferingsValue = "";

    for (var i = 0; i < tradesJson[user.currentTrade].starterOfferings.length; i++) {
        starterOfferingsValue += "[" + creditsJson.find(f => f.id == tradesJson[user.currentTrade].starter).characters[tradesJson[user.currentTrade].starterOfferings[i]].rarity + "] " + charactersJson[creditsJson.find(f => f.id == tradesJson[user.currentTrade].starter).characters[tradesJson[user.currentTrade].starterOfferings[i]].id].name + "\n";
    }

    for (var i = 0; i < tradesJson[user.currentTrade].recipientOfferings.length; i++) {
        recipientOfferingsValue += "[" + creditsJson.find(f => f.id == tradesJson[user.currentTrade].recipient).characters[tradesJson[user.currentTrade].recipientOfferings[i]].rarity + "] " + charactersJson[creditsJson.find(f => f.id == tradesJson[user.currentTrade].recipient).characters[tradesJson[user.currentTrade].recipientOfferings[i]].id].name + "\n";
    }

    if (tradesJson[user.currentTrade].starterAccepted) {
        tradeInfo.push({
            name: msg.client.users.find(f => f.id == tradesJson[user.currentTrade].starter).username + "'s Offerings: :white_check_mark:",
            value: (starterOfferingsValue == "") ? "Nothing." : starterOfferingsValue
        });
    } else {
        tradeInfo.push({
            name: msg.client.users.find(f => f.id == tradesJson[user.currentTrade].starter).username + "'s Offerings:",
            value: (starterOfferingsValue == "") ? "Nothing." : starterOfferingsValue
        });
    }

    
    if (tradesJson[user.currentTrade].recipientAccepted) {
        tradeInfo.push({
            name: msg.client.users.find(f => f.id == tradesJson[user.currentTrade].recipient).username + "'s Offerings: :white_check_mark:",
            value: (recipientOfferingsValue == "") ? "Nothing." : recipientOfferingsValue
        });
    } else {
        tradeInfo.push({
            name: msg.client.users.find(f => f.id == tradesJson[user.currentTrade].recipient).username + "'s Offerings:",
            value: (recipientOfferingsValue == "") ? "Nothing." : recipientOfferingsValue
        });
    }

    messages[user.currentTrade].edit({
        embed: {
            author: {
                name: "Trade"
            },
            fields: tradeInfo
        }
    }).then(sent => messages[user.currentTrade] = sent);

    if (tradesJson[user.currentTrade].starterAccepted && tradesJson[user.currentTrade].recipientAccepted) {
        for (var i = 0; i < tradesJson[user.currentTrade].recipientOfferings.length; i++) {
            var charToAdd = creditsJson.find(f => f.id == tradesJson[user.currentTrade].recipient).characters[tradesJson[user.currentTrade].recipientOfferings[i]]
            creditsJson.find(f => f.id == tradesJson[user.currentTrade].starter).characters.push({
                "id": charToAdd.id,
                "rarity": charToAdd.rarity,
                "category": charToAdd.category,
                "working": charToAdd.working,
                "workStart": charToAdd.workStart,
                "workCooldown": charToAdd.workCooldown,
                "affection": charToAdd.affection,
                "lastInteract": charToAdd.lastInteract
            });
            creditsJson.find(f => f.id == tradesJson[user.currentTrade].recipient).characters.splice(tradesJson[user.currentTrade].recipientOfferings[i], 1);
        }


        for (var i = 0; i < tradesJson[user.currentTrade].starterOfferings.length; i++) {
            var charToAdd = creditsJson.find(f => f.id == tradesJson[user.currentTrade].starter).characters[tradesJson[user.currentTrade].starterOfferings[i]];
            creditsJson.find(f => f.id == tradesJson[user.currentTrade].recipient).characters.push({
                "id": charToAdd.id,
                "rarity": charToAdd.rarity,
                "category": charToAdd.category,
                "working": charToAdd.working,
                "workStart": charToAdd.workStart,
                "workCooldown": charToAdd.workCooldown,
                "affection": charToAdd.affection,
                "lastInteract": charToAdd.lastInteract
            });
            creditsJson.find(f => f.id == tradesJson[user.currentTrade].starter).characters.splice(tradesJson[user.currentTrade].starterOfferings[i], 1);
        }

        msg.say("The trade between " + msg.client.users.find(f => f.id == tradesJson[user.currentTrade].starter).username + " and " + msg.client.users.find(f => f.id == tradesJson[user.currentTrade].recipient).username + " was confirmed!");

        tradeIndex = user.currentTrade;

        creditsJson.find(f => f.id == tradesJson[tradeIndex].starter).currentTrade = -1;
        creditsJson.find(f => f.id == tradesJson[tradeIndex].recipient).currentTrade = -1;

        messages.splice(tradeIndex, 1);

        clearTimeout(tradeTimeouts.find(f => f.trade.recipient == tradesJson[tradeIndex].recipient && f.trade.starter == tradesJson[tradeIndex].starter).timeout);
        tradeTimeouts.splice(tradeTimeouts.findIndex(f => f.trade.recipient == tradesJson[tradeIndex].recipient && f.trade.starter == tradesJson[tradeIndex].starter), 1);

        tradesJson.splice(tradeIndex, 1);

        for (var i = 0; i < creditsJson.length; i++) {
            if (creditsJson[i].currentTrade != -1 && creditsJson[i].currentTrade > tradeIndex) {
                creditsJson[i].currentTrade--;
                fs.writeFileSync(require.resolve("../../trades.json"), JSON.stringify(tradesJson));
            }
        }
    }

    fs.writeFileSync(require.resolve("../../trades.json"), JSON.stringify(tradesJson));
    fs.writeFileSync(require.resolve("../../credits.json"), JSON.stringify(creditsJson));
}

function isNumeric(num){
    return !isNaN(num)
}