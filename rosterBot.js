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

const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`); // If you're seeing this in the console, it worked!
});

client.login(process.env.DISCORD_TOKEN);

// All commands must begin with this symbol:
var commandSymbol = '+'; // Example: "!help", "!echo Hello World!"
var rosterCommandString = 'roster';
var helpCommandString = 'help';
var resetCommandString = 'reset';
var symbolChangeCommandString = 'symbol';

// Other variables
var attemptedCommand; // String for the attempted command, internal use only

validatedUsers = [
	201912803022471168, // Zeus
	736422980271472701, // Pope
	286942917392728085, // Spaxxow
	293220494780399616  // Godzilla
];



client.on('message', async msg => {	// This code block runs when a user sends a Discord message anywhere that the bot can read
	// This should keep the bot from responding to itself
	if(msg.author.bot) return;

	var isAValidatedUser = false;
	for(var i = 0; i < validatedUsers.length; i++)
	{
		if(msg.author.id == validatedUsers[i])
		{
			isAValidatedUser = true;
			continue;
		}
	}

	if(!isAValidatedUser)
	{
		msg.channel.send("Sorry, commands are only available to validated users.");
		return;
	}

	client.user.setActivity("" + commandSymbol + helpCommandString); // Leave this here

	if(msg.content.substring(0, 1) == "+")
	{
		attemptedCommand = msg.content.split(" ")[0].substring(1, msg.content.split(" ")[0].length);
		if(attemptedCommand == resetCommandString)
		{
			reset(msg);
			return;
		}
	}
	else if(msg.content.substring(0, commandSymbol.length) != commandSymbol) // Check if msg was even a command - REMEMBER: this code runs EVERY time a message is sent in the server!
	{
		return; // No command detected, break ASAP
	}
	else
	{
		attemptedCommand = msg.content.split(" ")[0].substring(commandSymbol.length, msg.content.split(" ")[0].length); // attemptedCommand = the command minus the ! symbol
	}

	if(attemptedCommand == rosterCommandString)
	{
		roster(msg);
	}
	else if(attemptedCommand == helpCommandString)
	{
		help(msg);
	}
	else if(attemptedCommand == resetCommandString)
	{
		reset(msg);
	}
	else if(attemptedCommand == symbolChangeCommandString)
	{
		symbol(msg);
	}
	else
	{
		unrecognizedCommand(msg);
	}

	if(commandSymbol == "/nick new_nick:" || commandSymbol == "/nick new_nick: " || commandSymbol == "" || commandSymbol == " " || commandSymbol == "/nick")
	{
		msg.channel.send("Nice try, " + msg.author.tag + ".");
		reset(msg);
	}
})

function unrecognizedCommand(msg)
{
	// Inform the user that the command they have typed did not align with an existing command
	msg.reply('that was not a command I understood... Try ' + commandSymbol + helpCommandString + ' to get a full list of commands.');
}

function help(msg)
{
	if(commandSymbol != "+")
	{
		msg.channel.send('Roster command usage: ```\n' + commandSymbol + rosterCommandString + ' @AnyRole```This displays the members of the @\'d role.\n' + '\nSymbol change command usage: ```\n'
		+ commandSymbol + symbolChangeCommandString +
		' [new command symbol]```' + 'This changes the symbol used to invoke commands. Defaults to +\nWarning: for command symbol changing, be mindful not to include spaces unless you know what you\'re doing.\n'
		+ '\nReset command usage: ```\n' + "+" + resetCommandString + '\nOR\n' + commandSymbol + resetCommandString + '```This resets the command symbol to the default: +');
	}
	else
	{
		msg.channel.send('Roster command usage: ```\n' + commandSymbol + rosterCommandString + ' @AnyRole```This displays the members of the @\'d role.\n' + '\nSymbol change command usage: ```\n'
		+ commandSymbol + symbolChangeCommandString +
		' [new command symbol]```' + 'This changes the symbol used to invoke commands. Defaults to +\nWarning: for command symbol changing, be mindful not to include spaces unless you know what you\'re doing.\n'
		+ '\nReset command usage: ```\n' + "+" + resetCommandString + '```This resets the command symbol to the default: +');
	}
}

function reset(msg)
{
	commandSymbol = "+";
	msg.channel.send("The command symbol has successfully been reset to: " + commandSymbol);
	client.user.setActivity("" + commandSymbol + helpCommandString);
}

function symbol(msg)
{
	if(msg.content.split(" ").length <= 1)
	{
		msg.reply("please see " + commandSymbol + helpCommandString + " for help. Or, do +" + resetCommandString + " to reset the command back to it's default.");
	}
	else
	{
		commandSymbol = msg.content.split(" ")[1];
		msg.channel.send("Success. New command symbol: " + commandSymbol);
		client.user.setActivity("" + commandSymbol + helpCommandString);
	}
}

function roster(msg)
{
	if(msg.content.substring(commandSymbol.length, msg.content.length).toLowerCase() == "roster")
	{
		msg.reply("see " + commandSymbol + helpCommandString + " for correct usage.");
		return;
	}

	var memberCount = 0;
	let role = msg.mentions.roles.first();
	if(!role) role = msg.guild.roles.cache.find(r => r.id == args[0]);
	if(!role) msg.channel.send('that role does not exist. That, or the role is set up in such a way that it can\'t be @mentioned.');
	let arr = new Array();
	role.members.forEach(user => {
		arr.push(`${user.user.username}`);
		memberCount++;
	});
	msg.channel.send("```\nRole name: " + role.name + "\nUsers with this role: " + memberCount + "\n- - - - - - - - - - - - -\n" + arr.join('\n') + "```");
}
