// List of dependencies called and installed via Node.js to be able to perform HTTP requests and APi calls

const Discord = require("discord.js")
const client = new Discord.Client();
//const { token, prefix } = require('./config.json')
const fs = require('fs')
const randomPuppy = require("random-puppy")
const ping = require('minecraft-server-util')
const PREFIX = "!"
const giveMeAJoke = require('discord-jokes')
const api = require('covidapi')

client.commands = new Discord.Collection()

// Checking the initial status of the bot and the activity status 

client.on('ready', () => {
	console.log("Bot is ready!")

	client.user.setActivity("$help", { type: "LISTENING" })
});

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
	const command = require(`./commands/${file}`)
	client.commands.set(command.name, command)
}

client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/)

	const command = args.shift().toLowerCase()

	if (!client.commands.has(command)) return;

	try {
		client.commands.get(command).execute(client, message, args)
	} catch (error) {
		console.log(error)
	}
})

// List of commands for the bot

client.on('message', async message => {
	if (message.content === "!ping") {
		message.channel.send("Pong!")
	} else if (message.content === "!hello") {
		message.channel.send("Hi! I'm Jarvis! For my list of commands use $help command.")
	} else if (message.content === "!info") {
		message.channel.send("I'm an updated version 1.3 created by browncoder98. My functions are not limited to only retrieving weather updates and memes or cracking random jokes but I'm able to pull statistics of COVID affected regions anywhere in this world. If you are a fan of minecraft, I can check the server status and port information for you as well. In case of any confusions regarding my list of commands, use $help or DM browncoder98. ")
	}
});

client.on('message', async message => {
	if (message.content === "$help") {
		const helpEmbed = new Discord.MessageEmbed()
			.addField("Commands", "!ping !hello !info !weather !joke !cnjoke !meme !covid ")
			.setColor("RANDOM")
			.setFooter("Created by browncoder98")
			.setDescription("**How may I help you today?**")
		message.channel.send(helpEmbed)
	}
});

client.on('message', async message => {
	if (message.content === "!meme") {
		const subReddits = ["dankmeme", "meme", "memes"]
		const random = subReddits[Math.floor(Math.random() * subReddits.length)];

		const img = await randomPuppy(random);
		const embed = new Discord.MessageEmbed()
			.setColor("RANDOM")
			.setImage(img)
			.setTitle(`From /r/${random}`)
			.setURL(`https://reddit.com/r/${random}`);
		message.channel.send(embed)
	}
});

client.on('message', async message => {
	let args = message.content.substring(PREFIX.length).split(' ')

	switch (args[0]) {
		case 'mc':
			if (!args[1]) return message.channel.send("You didnt specify a minecraft server IP")
			if (!args[2]) return message.channel.send("You didnt specify a minecraft server port")

			ping(args[1], parseInt(args[2]), (error, response) => {
				if (error) throw error
				const Embed = new Discord.MessageEmbed()
					.setColor("RANDOM")
					.setTitle("Server status")
					.addField("Server IP", response.host)
					.addField("Server Version", response.version)
					.addField("Online Players", response.onlinePlayers)
					.addField("Max Players", response.maxPlayers)
				message.channel.send(Embed)
			})
			break

	}
});

const settings = {
	prefix: "!"
}

client.on('message', async message => {
	if (message.content === "!joke") {
		giveMeAJoke.getRandomDadJoke(function (joke) {
			message.channel.send(joke)
		})
	}

	if (message.content === "!cnjoke") {
		giveMeAJoke.getRandomCNJoke(function (joke) {
			message.channel.send(joke)
		})
	}
});

client.on('message', async message => {
	if (message.content === "!covid all") {
		const data = await api.all()
		api.all().then(console.log)
		const coronaembed = new Discord.MessageEmbed()
			.setColor("ff2050")
			.setTitle("Global Cases")
			.setDescription("Number of cases may differ from other sources")
			.addField("Cases", data.cases, true)
			.addField("Active", data.active, true)
			.addField("Cases Today", data.todayCases, true)
			.addField("Critical Cases", data.critical, true)
			.addField("Deaths", data.deaths, true)
			.addField("Recovered", data.recovered, true)
		message.channel.send(coronaembed)

	} else if (message.content.startsWith("!covid")) {
		var prefix = "!"
		const countrycovid = message.content.slice(prefix.length).split(' ')
		const countrydata = await api.countries({ country: countrycovid })

		const countryembed = new Discord.MessageEmbed()
			.setColor("ff2050")
			.setTitle(`${countrycovid[1]} Cases`)
			.setDescription("Number of cases may differ from other sources")
			.addField("Cases", countrydata.cases, true)
			.addField("Active", countrydata.active, true)
			.addField("Cases Today", countrydata.todayCases, true)
			.addField("Critical Cases", countrydata.critical, true)
			.addField("Deaths", countrydata.deaths, true)
			.addField("Recovered", countrydata.recovered, true)
		message.channel.send(countryembed)

	}
})


// Login Token (Varies from individual to individual)

client.login(process.env.token);




