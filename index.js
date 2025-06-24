const WebRcon = require('webrconjs')
const Discord = require('discord.js')
const JSONBig = require('json-bigint')
const options = require('./config.json')

let modCommands = [
  "say",
  "kick",
  "ban",
  "mute",
  "unban",
  "unmute"
]

let rcon = new WebRcon(options.host, options.port)
let client = new Discord.Client();

rcon.on('message', function(msg){
  let message = JSON.parse(JSON.stringify(msg));

  if(message.type === 'Chat')
  {
    message = JSONBig.parse(message.message);
    client.channels.get(options.rconChannel).send('(' + message.UserId + ') ' + message.Message);
  }
  else if (message.identity === 10)
  {
    let info = JSON.parse(message.message)
    let onlinePlayers = info.Players + info.Joining;
    let queuedPlayers = info.Queued;
    let maxPop = info.MaxPlayers
    if (queuedPlayers) {
      client.user.setActivity(`${onlinePlayers}/${maxPop} (${queuedPlayers} in queue)`, {type: 'PLAYING'});
    }
    else if (onlinePlayers < 20){
      client.user.setActivity(options.defaultActivity, {type: 'PLAYING'});
    }
    else {
      client.user.setActivity(`${onlinePlayers}/${maxPop}`, {type: 'PLAYING'});
    }
  }
  else if (message.identity === -1)
  {
    messageToSend = message.message;
    if (messageToSend.length < 1994){
      if (messageToSend.length != 0) {
        client.channels.get(options.reportChannel).send("```" + messageToSend.substring(0, 1994) + "```");
      }
    }
    else {
      while(messageToSend.length > 1994){
        client.channels.get(options.reportChannel).send("```" + messageToSend.substring(0, 1994) + "```");
        messageToSend = messageToSend.substring(1994);
      }
      client.channels.get(options.reportChannel).send("```" + messageToSend.substring(0, 1994) + "```");

    }
  }
})


// Try RCON connection
function tryConnection()
{
  try
  {
    rcon.connect(options.password)
  }
  catch(e)
  {
    console.log('RCON unavailable');
    setTimeout(tryConnection, options.tryConnectionInterval);
  }
}

// Get server info
function getServerInfo()
{
  try
  {
    rcon.run('serverinfo', 10)
  }
  catch(e)
  {
    console.log("There is an error m8");
    tryConnection();
  }
}


// Listeners for connections/disconnections/errors
rcon.on('connect', function() {
  console.log('RCON Connected');
})

rcon.on('disconnect', function(){
  console.log('RCON Disconnected');
})

rcon.on('error', function(err) {
  console.log('ERROR: ', err);
})

// Discord bot code
client.on("ready", () => {
  console.log("Ready");
  tryConnection();
  setTimeout(getServerInfo, 1000);
  setInterval(getServerInfo, options.serverInfoInterval);
});

client.on("message", msg => {
  if (msg.channel.id === options.rconChannel){
    if (msg.member.roles.find(r => r.id === options.adminRole))
    {
      try {
        rcon.run(msg.toString(), -1)
      }
      catch(e){
        console.log("Error!");
        tryConnection();
      }
    }
    else if (msg.member.roles.find(r => r.id === options.modRole))
    {
      if (modCommands.indexOf(msg.toString().split(" ")[0]) > -1)
      {
        try {
          rcon.run(msg.toString(), -1)
        }
        catch(e){
          console.log("Error!");
          tryConnection();
        }
      }
    }
  }
});

client.login(options.token);
