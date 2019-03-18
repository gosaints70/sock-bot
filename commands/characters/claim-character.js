const { Command } = require("discord.js-commando");
var fs = require("fs");

module.exports = class ClaimCharacterCommand extends Command {
    constructor(client) {
        super(client, {
            name: "claim",
            group: "characters",
            memberName: "claim",
            description: "Tries to claim a character.",
            examples: ["claim The Chad"],
            args: [
                {
                    key: "name",
                    prompt: "Whats this characters name?",
                    type: "string"
                }
            ]
        });
    }

    async run(msg, args) {
        if (global.currentCharacter == -1)
            return;

        var creditsJson = readJson("../../credits.json");
        var charactersJson = readJson("../../characters.json");
        var user = msg.author;
        
        if (args.name.toLowerCase() == charactersJson[currentCharacter].name.toLowerCase()) {
            var globalIndex = global.currentCharacter;
            global.currentCharacter = -1;
            
            var rarity = global.getRaritySymbol(Math.floor(Math.random() * 200) + 1);
            console.log("Rarity: " + rarity);

            for (var i = 0; i < creditsJson.length; i++) {
                if (creditsJson[i].id == user.id) {
                    creditsJson[i].characters.push({
                        "id": charactersJson.findIndex(f => f.name.toLowerCase() == charactersJson[globalIndex].name.toLowerCase()),
                        "rarity": rarity,
                        "category": "",
                        "working": false,
                        "workStart": "",
                        "workCooldown": "",
                        "affection": 0,
                        "lastInteract": ""
                    });
                    fs.writeFileSync(require.resolve("../../credits.json"), JSON.stringify(creditsJson));
                }
            }
    
            return msg.say("Nice! <@" + msg.author.id + "> has claimed [" + rarity + "] " + charactersJson[globalIndex].name);
        }
    }
};

var readJson = (path) => {
    return JSON.parse(fs.readFileSync(require.resolve(path)));
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}