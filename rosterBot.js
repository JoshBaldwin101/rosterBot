/**	Author: Josh Baldwin
*
*	Project: rosterBot
*
*	Filename: rosterBot.js
*
*	Language: JavaScript
*
*	To users:
*	If you changed some of this stuff and it broke and you'd like to reset, download the .js file and replace this file with it here: https://github.com/JoshBaldwin101/rosterBot/blob/main/rosterBot.js
*/

// Run dotenv
require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`); // If you're seeing this in the console, it worked!
});

client.login(process.env.DISCORD_TOKEN);

// All commands must begin with this symbol unless changed via the symbol command
var defaultCommandSymbol = '+';				// Change symbol inside the '' to whatever you like
// The command keyword for the roster command
var rosterCommandString = 'roster';			// Change the word (or words) inside the '' to whatever you like
// The command keyword for the help command
var helpCommandString = 'help';				// Change the word (or words) inside the '' to whatever you like
// The command keyword for the reset command symbol command
var resetCommandString = 'reset';			// Change the word (or words) inside the '' to whatever you like
// The command keyword for the change command symbol command
var symbolChangeCommandString = 'symbol';	// Change the word (or words) inside the '' to whatever you like

// Other variables (don't mess with these)
var attemptedCommand; // Instantiated String for the attempted command, internal use only
var commandSymbol = defaultCommandSymbol;

/*
 * The following list should contain the Discord ID's of all users permitted to use this bot and its commands.
 * To add users to this list (this for people don't know JavaScript):
 * Replace one of the fake numbers at the bottom of the list with a real one.
 * If you run out of numbers to replace, look up how "arrays" work. Or just follow the structure of the existing array list.
*/
validatedUsers = [		
	201912803022471168, // Zeus
	736422980271472701, // Pope
	286942917392728085, // Spaxxow
	293220494780399616, // Godzilla
	100000000000000001, // [Optional: nickname]
	100000000000000001, // [Optional: nickname]
	100000000000000001, // [Optional: nickname]
	100000000000000001, // [Optional: nickname]
	100000000000000001, // [Optional: nickname]
	100000000000000001, // [Optional: nickname]
	100000000000000001, // [Optional: nickname]
	100000000000000001, // [Optional: nickname]
	100000000000000001  // [Optional: nickname]
];



client.on('message', async msg => {	// This code block runs when a user sends a Discord message anywhere that the bot can read
	
	if(msg.author.bot) return; // This should keep the bot from responding to itself

	var isAValidatedUser = false;	// Instantiates boolean and sets it to false
	for(var i = 0; i < validatedUsers.length; i++)	// Run through list of validated users
	{
		if(msg.author.id == validatedUsers[i])	// Check if any of the users are validated
		{
			isAValidatedUser = true;
			continue;
		}
	}

	if(!isAValidatedUser)	// If the previous for loop didn't find any validated universe, end this code block (this is for runtime efficiency)
	{
		msg.channel.send("Sorry, commands are only available to validated users.");
		return;
	}

	client.user.setActivity("" + commandSymbol + helpCommandString);	// This sets the bot's status to whatever the command symbol and help command string is

	if(msg.content.substring(0, 1) == "+")	// This is for the reset command in case the user has forgotten or cannot type the existing command symbol
	{
		attemptedCommand = msg.content.split(" ")[0].substring(1, msg.content.split(" ")[0].length);
		if(attemptedCommand == resetCommandString)	// Check if they're using the old command symbol to reset
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

	switch(attemptedCommand)	// Switch statement for runtime efficiency as per the command design structure
	{
		case null:
			break;
		case rosterCommandString:
			roster(msg);
			break;
		case helpCommandString:
			help(msg);
			break;
		case resetCommandString:
			reset(msg);
			break;
		case symbolChangeCommandString:
			symbol(msg);
			break;
		default:
			unrecognizedCommand(msg);
			break;
	}

	// This is to keep people from making the bot break itself or change its own name! No sentience allowed! <--Joke
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

function help(msg)	// Your standard help command. Two help commands: #1: reminder that you can use the original command symbol. #2: without the reminder.
{
	if(commandSymbol != defaultCommandSymbol)
	{
		msg.channel.send('Roster command usage: ```\n' + commandSymbol + rosterCommandString + ' @AnyRole```This displays the members of the @\'d role.\n' + '\nSymbol change command usage: ```\n'
		+ commandSymbol + symbolChangeCommandString +
		' [new command symbol]```' + 'This changes the symbol used to invoke commands. Defaults to +\nWarning: for command symbol changing, be mindful not to include spaces unless you know what you\'re doing.\n'
		+ '\nReset command usage: ```\n' + defaultCommandSymbol + resetCommandString + '\nOR\n' + commandSymbol + resetCommandString + '```This resets the command symbol to the default: +');
	}
	else
	{
		msg.channel.send('Roster command usage: ```\n' + commandSymbol + rosterCommandString + ' @AnyRole```This displays the members of the @\'d role.\n' + '\nSymbol change command usage: ```\n'
		+ commandSymbol + symbolChangeCommandString +
		' [new command symbol]```' + 'This changes the symbol used to invoke commands. Defaults to +\nWarning: for command symbol changing, be mindful not to include spaces unless you know what you\'re doing.\n'
		+ '\nReset command usage: ```\n' + defaultCommandSymbol + resetCommandString + '```This resets the command symbol to the default: +');
	}
}

function reset(msg)	// Resets the command symbol back to its original, which is the defaultCommandSymbol listed at the top of the file
{
	commandSymbol = defaultCommandSymbol;
	msg.channel.send("The command symbol has successfully been reset to: " + commandSymbol);
	client.user.setActivity("" + commandSymbol + helpCommandString);
}

function symbol(msg)	// Changes the command symbol to whatever you like
{
	if(msg.content.split(" ").length <= 1)
	{
		msg.reply("please see " + commandSymbol + helpCommandString + " for help. Or, do " + defaultCommandSymbol + resetCommandString + " to reset the command back to it's default.");
	}
	else
	{
		commandSymbol = msg.content.split(" ")[1];
		msg.channel.send("Success. New command symbol: " + commandSymbol);
		client.user.setActivity("" + commandSymbol + helpCommandString);
	}
}

function roster(msg)	// Executes the roster command which lists guild users with a certain guild role
{
	if(msg.content.substring(commandSymbol.length, msg.content.length).toLowerCase() == "roster")
	{
		msg.reply("see " + commandSymbol + helpCommandString + " for correct usage.");
		return;
	}

	var memberCount = 0;
	let role = msg.mentions.roles.first();
	if(!role || role == null) 
	{
		msg.reply('something went wrong. Try ' + commandSymbol + helpCommandString + 
		". It might also be that you forgot to @mention the role. Make sure you have the correct permissions to @mention that particular role. Otherwise, that role does not exist.");
		return;
	}
	let arr = new Array();
	role.members.forEach(user => {
		arr.push(`${user.user.username}`);
		memberCount++;
	});
	msg.channel.send("```\nRole name: " + role.name + "\nUsers with this role: " + memberCount + "\n- - - - - - - - - - - - -\n" + arr.join('\n') + "```");
}
