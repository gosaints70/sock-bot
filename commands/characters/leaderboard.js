const {
    Command
} = require("discord.js-commando");
var fs = require("fs");

module.exports = class LeaderboardCommand extends Command {
    constructor(client) {
        super(client, {
            name: "leaderboard",
            group: "characters",
            memberName: "leaderboard",
            description: "View the current top 5 rankings.",
            examples: [
                "leaderboard"
            ]
        });
    }

    async run(msg) {
        var creditsJson = readJson("../../credits.json");
        var charactersJson = readJson("../../characters.json");

        var allUsers = [];

        for (var i = 0; i < creditsJson.length; i++) {
            var totalOwned = 0;
            for (var j = 0; j < charactersJson.length; j++) {
                if (creditsJson[i].characters.filter(f => f.id == j).length > 0) {
                    totalOwned++;
                }
            }
            allUsers.push({
                "username": msg.client.users.get(creditsJson[i].id).username,
                "completion": (parseFloat(totalOwned) / parseFloat(charactersJson.length)) * 100
            });
        }

        var allUsersSorted = sort(allUsers);

        var desc = "";

        desc += ":first_place: " + allUsersSorted[allUsersSorted.length - 1].username + " " + allUsersSorted[allUsersSorted.length - 1].completion.toFixed(2) + "%\n\n";
        desc += ":second_place: " + allUsersSorted[allUsersSorted.length - 2].username + " " + allUsersSorted[allUsersSorted.length - 2].completion.toFixed(2) + "%\n\n";
        desc += ":third_place: " + allUsersSorted[allUsersSorted.length - 3].username + " " + allUsersSorted[allUsersSorted.length - 3].completion.toFixed(2) + "%\n\n";
        desc += ":military_medal: " + allUsersSorted[allUsersSorted.length - 4].username + " " + allUsersSorted[allUsersSorted.length - 4].completion.toFixed(2) + "%\n\n";
        desc += ":reminder_ribbon: " + allUsersSorted[allUsersSorted.length - 5].username + " " + allUsersSorted[allUsersSorted.length - 5].completion.toFixed(2) + "%";

        return msg.say({
            embed: {
                color: 7419530,
                author: {
                    name: "🏆 Leaderboard 🏆"
                },
                description: desc
            }
        });
    }
}

function sort(originalArray) {

    // If array is empty or consists of one element then return this array since it is sorted.
    if (originalArray.length <= 1) {
        return originalArray;
    }

    // Split array on two halves.
    const middleIndex = Math.floor(originalArray.length / 2);
    const leftArray = originalArray.slice(0, middleIndex);
    const rightArray = originalArray.slice(middleIndex, originalArray.length);

    // Sort two halves of split array
    const leftSortedArray = sort(leftArray);
    const rightSortedArray = sort(rightArray);

    // Merge two sorted arrays into one.
    return mergeSortedArrays(leftSortedArray, rightSortedArray);
}

function mergeSortedArrays(leftArray, rightArray) {
    let sortedArray = [];

    // In case if arrays are not of size 1.
    while (leftArray.length && rightArray.length) {
        let minimumElement = null;

        // Find minimum element of two arrays.
        if (leftArray[0].completion <= rightArray[0].completion) {
            minimumElement = leftArray.shift();
        } else {
            minimumElement = rightArray.shift();
        }

        // Call visiting callback.
        //this.callbacks.visitingCallback(minimumElement);

        // Push the minimum element of two arrays to the sorted array.
        sortedArray.push(minimumElement);
    }

    // If one of two array still have elements we need to just concatenate
    // this element to the sorted array since it is already sorted.
    if (leftArray.length) {
        sortedArray = sortedArray.concat(leftArray);
    }

    if (rightArray.length) {
        sortedArray = sortedArray.concat(rightArray);
    }

    return sortedArray;
}

var readJson = (path) => {
    return JSON.parse(fs.readFileSync(require.resolve(path)));
}