const { Client, Intents, MessageAttachment, MessageEmbed, User, GuildMember } = require('discord.js');
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_MESSAGE_TYPING,
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
        Intents.FLAGS.DIRECT_MESSAGE_TYPING,
        Intents.FLAGS.GUILD_VOICE_STATES
    ],
    partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'USER'],
});

// Notify progress
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
})

//Functionality
client.on('messageCreate', (message) => {
    if (message.content.toLowerCase().includes('auth')) {
        if (message.channelId == '959095674492842014' && !message.author.bot) {
            message.author.send("กรุณาใส่รหัสนักศึกษา")
            message.react("👻").then(() => {
                setTimeout(() => { 
                    message.delete() 
                }, 2000)
            })
        }
    }
    if (message.guildId == null && !message.author.bot) {
        try {
            axios.post("http://161.246.5.39/auth", {
                "username": process.env.apiUsername,
                "password": process.env.apiPassword
            }).then(async (res) => {
                try {
                    const fetch = await axios.get("http://161.246.5.39/data", {
                        headers: {
                            'x-access-token': res.data.token
                        }
                    });
                    for (let i = 1; i < fetch.data.length; i++) {
                        if (message.content == fetch.data[i][0] && message.author.id == fetch.data[i][1]) {
                            try {
                                client.guilds.cache.get("354248031580979200").members.cache.get(message.author.id).roles.add("733236903230308373")
                                message.react("✅")
                            } catch (err) {
                                message.author.send("kuy")
                            }
                        }
                        else {
                            message.react("❌")
                        }
                    }

                } catch (err) {
                    console.log("Error fetch can't get data");
                }
            })
        } catch (err) {
            console.log("Error fetch can't get token");
        }
    }

    if (message.content == '!list') {
        const file = new MessageAttachment('./image/logo.png');
        const exampleEmbed = {
            color: '#00ED9D',
            title: 'List Commands',
            url: '',
            author: {
                name: 'Melblue',
                icon_url: 'attachment://logo.png',
                url: 'https://discord.js.org',
            },
            description: 'Here is all command you can use in this server',
            fields: [
                {
                    name: 'Authentication',
                    value: '```auth : Register to get your role```',
                    inline: true,
                },
                {
                    name: '\u200b',
                    value: '\u200b',
                    inline: true,
                },
            ],
            image: {
                url: 'attachment://logo.png',
            },
            timestamp: new Date(),
            footer: {
                text: 'Copyright © 2022 Nont',
                icon_url: 'attachment://logo.png',
            },
        };

        message.channel.send({ embeds: [exampleEmbed], files: [file] });
    }
})

// Authenticate
client.login(process.env.BOT_TOKEN)

