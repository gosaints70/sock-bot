process.on("unhandledRejection", (reason) => {
  console.log("Reason: " + reason);
});
const Discord = require("discord.js");
const Commando = require("discord.js-commando");
const client = new Commando.Client({
  commandPrefix: "=",
  unknownCommandResponse: false,
  owner: "247805204487995392"
});

const Canvas = require("canvas");

const path = require("path");

var moment = require("moment-timezone");

var fs = require("fs");

var readJson = (path) => {
  return JSON.parse(fs.readFileSync(require.resolve(path)));
}

function makeID() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 8; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}

client.registry
  // Registers all built-in groups, commands, and argument types
  .registerDefaults()
  .registerGroups([
    ["economy", "Commands related to economy"],
    ["characters", "Commands related to characters"],
    ["gambling", "Commands related to making fat stacks"],
    ["general", "General commands"]
  ])
  // Registers all of your commands in the ./commands/ directory
  .registerCommandsIn(path.join(__dirname, "commands"));

const sqlite = require("sqlite");

client.setProvider(
  sqlite.open(path.join(__dirname, "settings.sqlite3")).then(db => new Commando.SQLiteProvider(db))
).catch(console.error);

global.charactersJson = readJson("./characters.json");
global.currentCharacter = -1;
global.rare = false;
global.currentBoxCode = "";
global.currentBoxKeyColor = "";
global.currentBoxMessage = "";
global.getRaritySymbol = function (rarity) {
  return rarityOdds.find(f => f.min <= rarity && f.max >= rarity);
}

global.rarityOdds = {
  "❀": {
    min: 0,
    max: 80
  },
  "♬": {
    min: 81,
    max: 145
  },
  "♡": {
    min: 146,
    max: 175
  },
  "✧": {
    min: 176,
    max: 195
  },
  "☆": {
    min: 196,
    max: 199
  },
  "♛": {
    min: 200,
    max: 200
  }
}

global.rarityTexts = {
  "❀": "alpha",
  "♬": "beta",
  "♡": "gamma",
  "✧": "delta",
  "☆": "epsilon",
  "♛": "zeta"
}

global.raritySymbols = {
  "alpha": "❀",
  "beta": "♬",
  "gamma": "♡",
  "delta": "✧",
  "epsilon": "☆",
  "zeta": "♛"
}

client.on("commandError", (command, err, message, args, fromPattern) => {
  message.channel.send({
    files: [
      "./unknown.png"
    ]
  });
});

client.on("ready", () => {
  var creditsJson = readJson("./credits.json");
  var charactersJson = readJson("./characters.json");
  client.user.setPresence({
    game: { name: charactersJson.length + " characters" },
    status: "streaming"
  });

  setInterval(function() {
    creditsJson = readJson("./credits.json");
    fs.writeFileSync("./credits-backup-" + moment.tz("America/Chicago").format("YYYY-MM-DD-hh-mm-a") + ".json", JSON.stringify(creditsJson));
    client.users.get("247805204487995392").send("Backup saved to" + "./credits-backup-" + moment.tz("America/Chicago").format("YYYY-MM-DD-hh-mm-a") + ".json");
  },  3600000*24);

  for (var i = 0; i < client.guilds.array().length; i++) {
    client.guilds.get(client.guilds.array()[i].id).fetchMembers().then(r => {
      for (var j = 0; j < r.members.array().length; j++) {
        if (r.members.array()[j].user.bot == true) {
          continue;
        }
        var currentUser = -1;
        for (var k = 0; k < creditsJson.length; k++) {
          if (creditsJson[k].id == r.members.array()[j].user.id) {
            currentUser = r.members.array()[j].user;
          }
        }
        if (currentUser == -1) {
          creditsJson.push({
            "id": r.members.array()[j].user.id,
            "credits": 0,
            "nextDaily": 0,
            "characters": [

            ],
            "wishlist": [

            ],
            "favoriteCharacter": -1,
            "lastGacha": 0,
            "currentTrade": -1,
            "keys": [

            ],
            "lastDailyKeys": 0
          });
          console.log("Added " + r.members.array()[j].user.username);
          fs.writeFileSync(require.resolve("./credits.json"), JSON.stringify(creditsJson));
        }
      }
    });
  }

  var messagesJson = readJson("./messages.json");

  /*for (var i = 0; i < client.guilds.array()[0].channels.array().length; i++) {
    for (var j = 0; j < channelsToTake.length; j++) {
      if (channelsToTake[j] == parseInt(client.guilds.array()[0].channels.array()[i].id) && client.guilds.array()[0].channels.array()[i].type == "text") {
        console.log(i);
        client.guilds.array()[0].channels.array()[i].fetchMessages({ limit: 100 }).then(function(messages) {
          for(var k = 0; k < messages.array().length; j++) {
            messagesJson.push({
              //channel: client.guilds.array()[0].channels.array()[i].name,
              author: messages.array()[k].author.username,
              content: messages.array()[k].content
            });
          }
        });
      }
    }
  }

  fs.writeFileSync(require.resolve("./messages.json"), JSON.stringify(messagesJson));*/

  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", async msg => {
  var keysJson = readJson("./keys.json");

  var random = Math.floor(Math.random() * 100);
  var rareRandom = Math.floor(Math.random() * 250);
  var boxRandom = Math.floor(Math.random() * 100);
  
  //console.log("Random: " + random);

  if (!msg.author.bot && random == 1) {
    if (rareRandom  == 1) {
      rare = true;
      var rareCharacters = charactersJson.filter(f => f.rare);
      var ran = Math.floor(Math.random() * rareCharacters.length);

      currentCharacter = charactersJson.findIndex(f => f.name.toLowerCase() == rareCharacters[ran].name.toLowerCase());
      var desc = "A character appeared!\nTry guessing their name with ``=claim <name>`` to claim them!\n\nHints:\nThis character's initials are ";
      for (var i = 0; i < charactersJson[currentCharacter].name.split(" ").length; i++) {
        desc += charactersJson[currentCharacter].name.split(" ")[i].substring(0, 1) + ". ";
      }
      desc += "\nUse ``=lookup <name>`` if you can't remember the full name.\n\n"
      client.channels.find("id", "533085381894078484").send({
        embed: {
          color: 7419530,
          author: {
            name: "Rare Character!"
          },
          description: desc,
          image: {
            url: charactersJson[currentCharacter].imageURL
          }
        }
      });
    } else {
      rare = false;
      var notRareCharacters = charactersJson.filter(f => !f.rare);
      var ran = Math.floor(Math.random() * notRareCharacters.length);

      currentCharacter = charactersJson.findIndex(f => f.name.toLowerCase() == notRareCharacters[ran].name.toLowerCase());
      var desc = "A character appeared!\nTry guessing their name with ``=claim <name>`` to claim them!\n\nHints:\nThis character's initials are ";
      for (var i = 0; i < charactersJson[currentCharacter].name.split(" ").length; i++) {
        desc += charactersJson[currentCharacter].name.split(" ")[i].substring(0, 1) + ". ";
      }
      desc += "\nUse ``=lookup <name>`` if you can't remember the full name.\n\n"
      client.channels.find("id", "533085381894078484").send({
        embed: {
          color: 7419530,
          author: {
            name: "Character"
          },
          description: desc,
          image: {
            url: charactersJson[currentCharacter].imageURL
          }
        }
      });
    }

    if (boxRandom < 5) {
      currentBoxKeyColor = keysJson[Math.floor(Math.random() * keysJson.length)];
      var randomString = makeID();

      currentBoxCode = randomString;

      const canvas = Canvas.createCanvas(1000, 1000);
      const ctx = canvas.getContext("2d");

      const background = await Canvas.loadImage("./box_closed.png");

      //Canvas.registerFont("IndieFlower.ttf", { family: "Indie Flower" });

      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
      ctx.textAlign = "center"; 
      ctx.font = "72px sans-serif";
      ctx.fillText(randomString, 445.50, 106.46);
      
      //const boxImg = new Discord.Attachment(canvas.toBuffer(), "sockbox.png");

      fs.writeFileSync(require.resolve("./currentbox.png"), canvas.toBuffer());

      var boxURL = require.resolve("./currentbox.png");

      //client.channels.find("id", "533085381894078484").send(boxURL);

      client.channels.find("id", "533085381894078484").send({
        embed: {
          color: 7419530,
          author: {
            name: "SockBox"
          },
          description: "A SockBox:tm: has arrived in this channel!\nSomeone should probably open it with ``=open <combination>``\nThere is a case-sensitive combination below.\nThis box requires a __" + currentBoxKeyColor + "__ key to open. (Check your keys with ``=keys`` and get new ones with ``=dailykeys``)",
          image: {
            url: "attachment://currentbox.png"
          }
        },
        files: [{
          attachment: boxURL,
          name: "currentbox.png"
        }]
      }).then(message => currentBoxMessage = message);
      //client.channels.find("id", "533085381894078484").send("", boxImg)
    }
  }

  /*var channelsJson = readJson("./channels.json");

  for(var i = 0; i < client.guilds.array()[0].channels.array().length; i++) {
    channelsJson.push({
      id: client.guilds.array()[0].channels.array()[i].id,
      name: client.guilds.array()[0].channels.array()[i].name
    });
  }

  fs.writeFileSync(require.resolve("./channels.json"), JSON.stringify(channelsJson));*/
});

client.on("guildMemberAdd", member => {
  var creditsJson = readJson("./credits.json");

  var currentUser = -1;

  for (var i = 0; i < creditsJson.length; i++) {
    if (creditsJson[i].id == member.user.id) {
      currentUser = member.user.id;
    }
  }

  if (currentUser == -1) {
    creditsJson.push({
      "id": member.user.id,
      "credits": 0,
      "nextDaily": 0,
      "characters": [

      ],
      "wishlist": [

      ],
      "favoriteCharacter": -1,
      "lastGacha": 0,
      "currentTrade": -1,
      "keys": [

      ],
      "lastDailyKeys": 0
    });
    console.log("Added " + member.user.username);
  }
  fs.writeFileSync(require.resolve("./credits.json"), JSON.stringify(creditsJson));

});

client.login("NTQwOTEyNjI2NTk5NzIzMDI4.DzX_vw.MxFh0-Qa0srmaDmt1wS6YXvWmeg");