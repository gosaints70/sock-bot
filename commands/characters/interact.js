const {
    Command
} = require('discord.js-commando');
var moment = require('moment-timezone');
var fs = require('fs');

moment.tz("America/Chicago").format();

module.exports = class InteractCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'interact',
            group: 'characters',
            memberName: 'interact',
            description: 'Interacts a character.',
            examples: ['interact 2'],
            args: [{
                key: 'index',
                prompt: 'Who do you wanna interact with?',
                type: 'integer',
                min: 0
            }]
        });
    }

    run(msg, args) {
        var creditsJson = readJson("../../credits.json");
        var charactersJson = readJson("../../characters.json");
        var user = msg.author;

        var interactions = [
            "summoned demons {location}",
            "scared off little children {location}",
            "decided to have dinner {location}",
            "robbed a bank! To the get away car!",
            "skipped class and hung out {location} for a few hours. Let's hope there's no homework...",
            "go on a school trip to Hawaii and watch a classmate fall off a building",
            "come across some coins. You throw them in a nearby fountain. Make a wish!",
            "teleport back to Jesus' Crucifiction to take some selfies with him",
            "spend time together at the beach. You dropped your ice cream, so {character} offered some of theirs",
            "got put in a group project together for the science fair. You didn’t win first place, but you had fun in the end",
            "spend the entire night sending each other memes",
            "encounter a black and white bear {location} talking about despair. Man, His voice is kinda annoying...",
            "hide paint bombs in the music clubroom. When it finally exploded and covered the band kids in green paint, you two couldn’t stop laughing.",
            "spend the night eating pizza and playing video games",
            "go to Disneyland together!!!",
            "EPICALLY Fortnite dance {location}",
            "drank a reverse potion and are 'bouta go sicko mode at {location}",
            "hang out {location} before burning it to ashes. As it burns, you two just laugh maniacally. Good on you.",
            "go {location} and ask if Wendy is working today",
            "plan an assassination {location}"
        ];

        var locations = [
            "in your mom's basement",
            "in a Chilli's parking lot",
            "in the forest",
            "in front of your mom",
            "at school",
            "in Vince's house",
            "at the mall",
            "at the beach",
            "at the pier",
            "at the police station",
            "downtown",
            "at the park",
            "at the Clown House",
            "in the dorms",
            "in the library",
            "at 7/11",
            "at the boardwalk"
        ];

        for (var i = 0; i < creditsJson.length; i++) {
            if (creditsJson[i].id == user.id && creditsJson[i].characters.length > args.index) {
                var points = Math.floor(Math.random() * 5) + 1;

                if (creditsJson[i].characters[args.index].working) {
                    return msg.say("This character is working, you can't interact with them right now.");
                }

                if (creditsJson[i].characters[args.index].lastInteract != moment.tz("America/Chicago").format('L')) {
                    creditsJson[i].characters[args.index].lastInteract = moment.tz("America/Chicago").format('L');
                    creditsJson[i].characters[args.index].affection += points;
                }
                else 
                {
                    return msg.say("You've already interacted with this character today.");
                }
          
                var character = charactersJson[creditsJson[i].characters[args.index].id];
                var desc = "";

                desc = "You and " + character.interactionName + " " + interactions[Math.floor(Math.random() * interactions.length)].replace("{location}", locations[Math.floor(Math.random() * locations.length)]).replace("{character}", character.interactionName) + "\nAffection raised by " + points + " points";

                msg.say({
                  embed: {
                      author: {
                        name: "Interaction",
                      },
                      thumbnail: {
                          url: character.imageURL
                      },
                      description: desc 
                  }
                });
                fs.writeFileSync(require.resolve('../../credits.json'), JSON.stringify(creditsJson));
            }
        }
    }
};

var readJson = (path) => {
    return JSON.parse(fs.readFileSync(require.resolve(path)));
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
