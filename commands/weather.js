const { MessageEmbed } = require('discord.js')
const weather = require('weather-js')

module.exports = {
	name: "weather",
	description: "get the weather",

	execute: async (client, message, args) => {
		let city = args.slice(0).join(" ")

		weather.find({ search: city, degreeType: "F" }, function (err, result) {
			console.log(result)

			let embed = new MessageEmbed()
				.setColor("RANDOM")
				.setTitle(result[0].location.name)
				.addField("Temperature", `${result[0].current.temperature} Fahrenheit`, true)
				.addField("Sky Text", result[0].current.skytext, true)
				.addField("Humidity", result[0].current.humidity, true)
				.addField("Wind Speed", result[0].current.windspeed, true)
				.addField("Current Time", result[0].current.observationtime, true)
				.addField("Feels Like", `${result[0].current.feelslike} Fahrenheit`, true)
				.setThumbnail(result[0].current.imageUrl)
			message.channel.send(embed)
		})
	}
}