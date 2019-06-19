const Discord = require("discord.js");
const client = new Discord.Client();

const config = require("./config.json");

client.on("ready", () => {
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
});

client.on("guildCreate", guild => {
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
});

client.on("guildDelete", guild => {
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
});

/*
client.on("guildMemberAdd", (member) => {
  let guild = member.guild;
  let memberTag = member.user.tag;
  if(guild.systemChannel){ 
    guild.systemChannel.send(memberTag + " has joined!");
  }
});

client.on("guildMemberRemove", (member) => {
  let guild = member.guild;
  let memberTag = member.user.tag;
  if(guild.systemChannel){ 
    guild.systemChannel.send(memberTag + " has leave!");
  }
});
*/

const fs = require('fs');

client.on("message", message => {
  var today = new Date();
  var now = today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate() + '(' + today.getHours() + ':' + today.getMinutes() + ')';
  console.log(`${now} ${message.guild.name} ${message.channel.name} ${message.member.user.tag} : ${message.content}\n`);
  var log = `${now} ${message.guild.name} ${message.channel.name} ${message.member.user.tag} : ${message.content}\n`;
  fs.appendFile("../log.txt" ,log, 'utf-8', (err) => {});

  if(message.content.includes(`<:zz:590793410479259669>`) == true){
    if(message.member.user.tag == `竺(｡>﹏<｡)#7540`){
      return;
    }else{
      message.channel.bulkDelete(1)
        .catch(error => console.log(`Couldn't delete messages because of: ${error}`));
      // return message.reply("Sorry, you don't have permissions to use this!");
    }
  }else if(message.content == `test`){
    message.channel.send(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
  }else if(message.content == `<@!578076907975999498>`){
    message.reply(`怎麼了0u0`);
  }

  if (message.author.bot) return;
/*
  if(message.content == `0u0` ||
  message.content == `0.0` ||
  message.content == `O.O` ||
  message.content == `Owo` ||
  message.content == `owO` ||
  message.content == `owo` ||
  message.content == `OwO` ||
  message.content == `OAO` ||
  message.content == `030` ||
  message.content == `AwA` ||
  message.content == `QAQ`
  ){
    message.channel.send( message => {
      var letters = ["0u0", "0.0", "Owo", "owO", "owo", "OwO", "OAO", "0A0", "030", "AwA", "QAQ", "QWQ", "ouo", ".w.", ".W.", ":D", ":)","oWo"];
      var letter = letters[Math.floor(Math.random() * letters.length)];
      return letter;
    });
  }
});
*/
client.on("message", async message => {
  if(message.author.bot) return;
  if(message.content.indexOf(config.prefix) !== 0) return;
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if(command === `help`){
    message.reply(`\n(1)Use ${config.prefix}ping to ping the Discord and ping the api!\n(2)other command is only for Moderator`);
  }

  if(command === "ping") {
    const m = await message.channel.send("Ping?");
	m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
  }
  
  if(command === "say") {
    if(!message.member.roles.some(r=>["Administrator", "Moderator"].includes(r.name)) )
      return message.reply("Sorry, you don't have permissions to use this!");
    const sayMessage = args.join(" ");
    message.delete().catch(O_o=>{}); 
	message.channel.send(sayMessage);
  }
  
  if(command === "kick") {
    // Array.some()
    // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/some?
    if(!message.member.roles.some(r=>["Administrator", "Moderator"].includes(r.name)) )
      return message.reply("Sorry, you don't have permissions to use this!");
    let member = message.mentions.members.first() || message.guild.members.get(args[0]);

    if(!member)
      return message.reply("Please mention a valid member of this server");

    if(!member.kickable) 
      return message.reply("I cannot kick this user! Do they have a higher role? Do I have kick permissions?");

    let reason = args.slice(1).join(' ');
    if(!reason) reason = "No reason provided";
    await member.kick(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));
    message.reply(`${member.user.tag} has been kicked by ${message.author.tag} because: ${reason}`);
  }
  
  if(command === "ban") {
    if(!message.member.roles.some(r=>["Administrator"].includes(r.name)) )
      return message.reply("Sorry, you don't have permissions to use this!");
    
    let member = message.mentions.members.first();
    if(!member)
      return message.reply("Please mention a valid member of this server");

    if(!member.bannable) 
      return message.reply("I cannot ban this user! Do they have a higher role? Do I have ban permissions?");

    let reason = args.slice(1).join(' ');
    if(!reason) reason = "No reason provided";
    
    await member.ban(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't ban because of : ${error}`));
    message.reply(`${member.user.tag} has been banned by ${message.author.tag} because: ${reason}`);
  }

  if(command === "clear") {
    if(!message.member.roles.some(r=>["Administrator", "Moderator"].includes(r.name)) )
      return message.reply("Sorry, you don't have permissions to use this!");
    const deleteCount = parseInt(args[0], 10);

    if(!deleteCount || deleteCount < 2 || deleteCount > 100)
      return message.reply("Please provide a number between 2 and 100 for the number of messages to delete");
    const fetched = await message.channel.fetchMessages({limit: deleteCount});
    message.channel.bulkDelete(fetched)
      .then(messages => console.log(`Bulk deleted ${fetched} messages`))
      .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
  }
});
client.login(config.token);
