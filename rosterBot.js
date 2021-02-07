/**	Author: Josh Baldwin
*
*	Project: rosterBot
*
*	Filename: rosterBot.js
*
*	Language: JavaScript
*/

// Run dotenv
require('dotenv').config();

const { VoiceChannel } = require('discord.js');
const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`); // If you're seeing this in the console, it worked!
});

client.login(process.env.DISCORD_TOKEN);

// All commands must begin with this symbol:
var commandSymbol = '+'; // Example: "!help", "!echo Hello World!"
var rosterCommandString = 'roster';

// Other variables
var attemptedCommand; // String for the attempted command, internal use only

client.on('message', async msg => {	// This code block runs when a user sends a Discord message anywhere that the bot can read
	// This should keep the bot from responding to itself
	if(msg.author.bot) return;

	if(msg.content.substring(0,commandSymbol.length) != commandSymbol) // Check if msg was even a command - REMEMBER: this code runs EVERY time a message is sent in the server!
	{
		return; // No command detected, break ASAP
	}
	else
	{
		attemptedCommand = msg.content.split(" ")[0].substring(commandSymbol.length, msg.content.split(" ")[0].length); // attemptedCommand = the command minus the ! symbol
	}

	const myGuild = client.guilds.cache.get('634627332346347550'); // Server ID goes here
	const role1 = myGuild.roles.cache.find(role => role.name === 'Operator Zeus'); // Name of role goes here
	const role2 = myGuild.roles.cache.find(role => role.name === 'Operator Goldstein');
	const role3 = myGuild.roles.cache.find(role => role.name === 'Operator Boogaloo');
	const multirole1 = myGuild.roles.cache.find(role => role.name === 'Captain');

	if(attemptedCommand == rosterCommandString)
	{
		rosterCommand(msg, role1);
	}
})

function help(msg)
{
	msg.channel.send('I need to put how to use the bot here');
}

function rosterCommand(message, role1, role2, role3, role4)
{
	let role = message.mentions.roles.first();
	if(!role) role = message.guild.roles.cache.find(r => r.id == args[0]);
	if(!role) message.channel.send('that role does not exist!');
	let arr = new Array();
	role.members.forEach(user => {
		arr.push(`--> **${user.user.username}**`);
	});
	message.channel.send(role1.name + "\n- - - - - -\n" + arr.join('\n'));

	//msg.channel.send("role id: " + role1.id);

	/*
	msg.guild.members.fetch()
    .then(members => {
        const role1Members = members.filter(mmbr => mmbr.roles.cache.get(role1.id)).map(m => m.user.tag).join('\n')
        const embed = new Discord.MessageEmbed()
        .setDescription(role1Members + " <-- if this says undefined... fuck");
        msg.reply(embed);
		msg.channel.send("test1");
		msg.channel.send(role1Members + " <-- if this says undefined... fuck");
    });
	*/

	//msg.channel.send(role1Members);
	//msg.guild.roles.get(role1.id).members.map(m=>m.user.tag);
}
