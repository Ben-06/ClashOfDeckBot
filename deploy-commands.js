const { SlashCommandBuilder, Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');

const commands = [
	new SlashCommandBuilder().setName('add-faq').setDescription('Ajouter une question à la FAQ')
    .addStringOption(option =>
        option.setName('question')
        .setDescription('question à ajouter à la FAQ')
        .setRequired(true)
    )
    .addStringOption(option =>
        option.setName('réponse')
        .setDescription('réponse à la question')
        .setRequired(true)
    ),
    new SlashCommandBuilder().setName('card').setDescription('Afficher une carte')
    .addStringOption(option =>
        option.setName('carte')
        .setDescription('carte à afficher')
        .setRequired(true)
    )
    .addStringOption(option =>
        option.setName('crop')
        .setDescription('afficher uniquement l\'image de la carte')
    ),
    new SlashCommandBuilder().setName('cs').setDescription('Afficher une Capacité Spéciale')
    .addStringOption(option =>
        option.setName('cs')
        .setDescription('capacité spéciale à afficher')
        .setRequired(true)
    )
	]
	.map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.token);

rest.put(Routes.applicationGuildCommands(process.env.clientId, process.env.guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);