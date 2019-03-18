const Discord = require("discord.js");
const {
    Command
} = require("discord.js-commando");
var fs = require("fs");

module.exports = class SlotsCommand extends Command {
    constructor(client) {
        super(client, {
            name: "slots",
            group: "gambling",
            memberName: "slots",
            description: "Rolls a slot machine.",
            examples: ["slots 100"],
            args: [{
                key: "amount",
                prompt: "How much will you bet?",
                type: "integer",
                min: 1
            }]
        });
    }

    run(msg, args) {
        var creditsJson = readJson("../../credits.json");
        var user = msg.author;
        var fieldName = "";
        var fieldValue = "";
        var objectsChosen;
        var desc = "";
        for (var i = 0; i < creditsJson.length; i++) {
            if (creditsJson[i].id == user.id) {
                if (creditsJson[i].credits < args.amount)
                    return;

                objectsChosen = getObjectsChosen();
                var winnings = getReturn(objectsChosen, args.amount);

                if (winnings == 0) {
                    creditsJson[i].credits -= args.amount;
                    fieldName = "You lose!";
                    fieldValue += args.amount + " credits were lost. ";
                }
                else
                {
                    creditsJson[i].credits += winnings;
                    fieldName = "You win!";
                    fieldValue += winnings + " credits were added. ";
                }

                fieldValue += "You now have ``" + creditsJson[i].credits + "`` credits."; 
            }
        }
        fs.writeFileSync(require.resolve("../../credits.json"), JSON.stringify(creditsJson));

        var desc = objectsChosen.join(" ");

        msg.client.channels.find("id", "533085381894078484").send({
            embed: {
                color: 7419530,
                author: {
                    name: "Slots | " + user.username
                },
                description: desc,
                fields: [
                    {
                        name: fieldName,
                        value: fieldValue
                    }
                ]
            }
        });
    }
}

var readJson = (path) => {
    return JSON.parse(fs.readFileSync(require.resolve(path)));
}

function getObjectsChosen() {
    var objects =
    [
        "🍒", "🍒", "🍒", "🍒", "🍒", "🍒", "🍒",
        "🍊", "🍊", "🍊", "🍊", "🍊", "🍊",
        "🍓", "🍓", "🍓", "🍓", "🍓",
        "🍍", "🍍", "🍍", "🍍",
        "🍇", "🍇", "🍇",
        "🍉", "🍉",
        "⭐",
    ];

    var objectsChosen =
    [
        objects[Math.floor(Math.random() * objects.length)],
        objects[Math.floor(Math.random() * objects.length)],
        objects[Math.floor(Math.random() * objects.length)]
    ];

    return objectsChosen;
}

function getReturn(objectsChosen, bet) {
    var score = [];
    var moneyReturned = 0;

    for (var i = 0; i < objectsChosen.length; i++)
    {
        if (score.filter(f => f.key == objectsChosen[i]).length > 0)
        {
            score[score.indexOf(score.find(f => f.key == objectsChosen[i]))].value++;
            continue;
        }
        score.push({
            "key": objectsChosen[i],
            "value": 1
        });
    }

    if (score.filter(f => f.key == "🍒").length > 0)
    {
        if (score[score.indexOf(score.find(f => f.key == "🍒"))].value == 2)
        {
            moneyReturned = Math.ceil(parseFloat(bet) * 0.25);
        }
        else if (score[score.indexOf(score.find(f => f.key == "🍒"))].value == 3)
        {
            moneyReturned = Math.ceil(parseFloat(bet) * 3);
        }
    }
    if (score.filter(f => f.key == "🍊").length > 0)
    {
        if (score[score.indexOf(score.find(f => f.key == "🍊"))].value == 2)
        {
            moneyReturned = Math.ceil(parseFloat(bet) * 0.5);
        }
        else if (score[score.indexOf(score.find(f => f.key == "🍊"))].value == 3)
        {
            moneyReturned = Math.ceil(parseFloat(bet) * 5);
        }
    }
    if (score.filter(f => f.key == "🍓").length > 0)
    {
        if (score[score.indexOf(score.find(f => f.key == "🍓"))].value == 2)
        {
            moneyReturned = Math.ceil(parseFloat(bet) * 0.75);
        }
        else if (score[score.indexOf(score.find(f => f.key == "🍓"))].value == 3)
        {
            moneyReturned = Math.ceil(parseFloat(bet) * 7);
        }
    }
    if (score.filter(f => f.key == "🍍").length > 0)
    {
        if (score[score.indexOf(score.find(f => f.key == "🍍"))].value == 2)
        {
            moneyReturned = Math.ceil(parseFloat(bet) * 1);
        }
        if (score[score.indexOf(score.find(f => f.key == "🍍"))].value == 3)
        {
            moneyReturned = Math.ceil(parseFloat(bet) * 10);
        }
    }
    if (score.filter(f => f.key == "🍇").length > 0)
    {
        if (score[score.indexOf(score.find(f => f.key == "🍇"))].value == 2)
        {
            moneyReturned = Math.ceil(parseFloat(bet) * 2);
        }
        if (score[score.indexOf(score.find(f => f.key == "🍇"))].value == 3)
        {
            moneyReturned = Math.ceil(parseFloat(bet) * 15);
        }
    }
    if (score.filter(f => f.key == "🍉").length > 0)
    {
        if (score[score.indexOf(score.find(f => f.key == "🍉"))].value == 2)
        {
            moneyReturned = Math.ceil(parseFloat(bet) * 3);
        }
        if (score[score.indexOf(score.find(f => f.key == "🍉"))].value == 3)
        {
            moneyReturned = Math.ceil(parseFloat(bet) * 25);
        }
    }
    if (score.filter(f => f.key == "⭐").length > 0)
    {
        if (score[score.indexOf(score.find(f => f.key == "⭐"))].value == 2)
        {
            moneyReturned = Math.ceil(parseFloat(bet) * 7);
        }
        if (score[score.indexOf(score.find(f => f.key == "⭐"))].value == 3)
        {
            moneyReturned = Math.ceil(parseFloat(bet) * 75);
        }
    }

    return moneyReturned;
}