const Discord = require('discord.js')
const bot = new Discord.Client()
const botPrefix = "+"

var channelCreatorList = new Set;//contiens les ids des channel créateurs
var channelDeletableList = new Set();//contiens les ids des channel Qui peuvent etre supprimé

bot.login('NTU5Njg1MTQ2NjQ3ODU1MTM2.D3pAwg.CdNOJjPtBsomMiHUygomenvkCq8');

bot.on('ready', () => {
  bot.user.setPresence({
    "status": "online",
    "game": {
      "name": "Je joue pas ! je travaille . . ."
    }
  })
  console.log('Bot activer !');
  initLists();
});

var masterChannel = ''
bot.on('message', function makeChannel(message) {
  if (message.content[0] === botPrefix) {
    if ((message.member.hasPermission("ADMINISTRATOR"))) {
      let splitMessage = message.content.split(" ");

      //commande resetBotCommande
      if (splitMessage[0] === botPrefix + "resetBot") {
        if (splitMessage.length === 1) {
          if ((message.member.hasPermission("ADMINISTRATOR"))) {
            message.member.hasPermission
            masterChannel = ''
            channelCreatorList = new set;
            saveLists();
          }
        }
      }

      //Command List that work inside the master Channel

      if (message.channel.id == masterChannel || masterChannel == '') {
        //commande saveList
        if (splitMessage[0] === botPrefix + "saveList") {
          if (splitMessage.length === 1) {
            saveLists();
            message.channel.send("Channel list saved on the file ");
          }
        }

        //commande clear
        if (splitMessage[0] === botPrefix + "clearList") {
          if (splitMessage.length === 1) {
            channelCreatorList = new set;
            saveLists();
          }
        }

        //commande createChannel
        if (splitMessage[0] === botPrefix + "createChannel") {
          if (splitMessage.length === 2) {
            channelCreatorList.add(splitMessage[1]);
            console.log("channel id : ", splitMessage[1])
          }
        }

        //commande InitChannel
        if (splitMessage[0] === botPrefix + "initMasterChannel") {
          if (splitMessage.length === 2) {
            masterChannel = splitMessage[1]
            console.log("channel id : ", splitMessage[1])
          }
        }

        //commande add id to deletable
        if (splitMessage[0] === botPrefix + "removeChannel") {
          if (splitMessage.length === 2) {
            console.log(splitMessage[1])
            channelCreatorList.delete(splitMessage[1])
          }
        }

        //commande rool a dice
        if (splitMessage[0] === botPrefix + "RollADice") {
          if (splitMessage.length === 2) {
            var size = parseInt(splitMessage[1])
            var random = getRandomInt(size + 1) //getRandomInt crach
            message.reply("La valeur tiré est le : " + random)
          }
        }
      }
    }
  }
});

var i = 0

//-------------------------------------- Fin des commandes --------------------------------------//

bot.on('voiceStateUpdate', (oldMember, newMember) => {
  let newUserChannel = newMember.voiceChannel
  let oldUserChannel = oldMember.voiceChannel

  console.log('Entrée');
  if (newUserChannel !== undefined) {
    if (isCreator(newUserChannel.id)) {
      i = getRandomInt(1000)
      var name = newMember.voiceChannel.name + " #" + i
      var server = newUserChannel.guild


      newUserChannel.clone(name, true, true, 'Needed a clone')
        .then(clone => {

          clone.setParent(newUserChannel.parent).then(
            clone.setPosition(newUserChannel.position + 1).then(() => {
              //move + addtoDeletablee
              clone.setUserLimit(newUserChannel.userLimit).then(() => {
                newMember.setVoiceChannel(clone.id) / x
                channelDeletableList.add(clone.id)
              })
            }
            ));


        })
        .catch(console.error);
      console.log('Crer');
    }
  }
})


//deco and suppr if needed
bot.on("voiceStateUpdate", oldMember => {
  if (oldMember.voiceChannel !== undefined) {
    if (isDeletable(oldMember.voiceChannel.id)) {
      console.log('supression de ', oldMember.voiceChannel.name);
      deleteEmptyChannelAfterDelay(oldMember.voiceChannel);
    }
  }
  else if (oldMember.voiceChannel !== undefined) {
    console.log("pas de supression ", oldMember.voiceChannel.name, oldMember.voiceChannel.id)
  }
});

function deleteEmptyChannelAfterDelay(voiceChannel, delayMS = 500) {
  if (!voiceChannel) return;
  if (voiceChannel.members.first()) return;
  if (!voiceChannel.health) voiceChannel.health = 0;
  voiceChannel.health += 1;
  setTimeout(function () {    //queue channel for deletion and wait
    if (!voiceChannel) return;
    if (voiceChannel.members.first()) return;
    voiceChannel.health -= 1;
    if (voiceChannel.health > 0) return;
    //fin des condition d'arrets
    channelDeletableList.delete(voiceChannel.id)
    voiceChannel.delete()    //delete channel
      .catch(error => console.log(error));
  }, delayMS);
}

function getRandomInt(max) {
  var i = Math.floor(Math.random() * Math.floor(max));
  var tmp = ""
  if (i < 10) {
    tmp = "00" + i
  }
  else if (i < 100) {
    tmp = "0" + i
  }
  else {
    tmp = i
  }
  return tmp
}

function isCreator(id) { //return true si id est dans channelCreatorList
  if (channelCreatorList.has(id)) {
    return true;
  }
  return false;
}

function isDeletable(id) { //return true si id est dans channelDeletableList
  if (channelDeletableList.has(id)) {
    return true;
  }
  return false;
}

function initLists() {
  var fs = require('fs'),
    readline = require('readline'),
    instream = fs.createReadStream('./Mathlist'),
    outstream = new (require('stream'))(),
    rl = readline.createInterface(instream, outstream);

  rl.on('line', function (line) {
    channelCreatorList.add(line)
  });

  rl.on('close', function (line) {
    console.log(channelCreatorList);
    console.log('done reading file.');
  });
}



function saveLists() {
  const fs = require('fs');
  let stringToSave = "";
  for (let i = 0; i < channelCreatorList.length; i++) {
    console.log(channelCreatorList[i] + "\n")
  }
  fs.writeFile('Mathlist', stringToSave, (err) => {
    // throws an error, you could also catch it here
    if (err) throw err;
    // success case, the file was saved
    console.log('list saved!');
  });
}

