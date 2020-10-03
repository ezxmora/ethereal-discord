require('dotenv').config({ path: 'config.env' });
const Discord = require('discord.js');
const bot = new Discord.Client({
    messageCacheMaxSize: -1,
    messageCacheLifetime: 60,
    messageSweepInterval: 60,
    disableMentions: 'all',
    retryLimit: Infinity,
});

let msgDeleted = 0;
bot.login(process.env.TOKEN);

const init = async () => {
    await bot.channels.fetch(process.env.VOLATILE_CHANNEL_ID)
        .then((channelData) => {
            channelData.messages.fetch({ force: true })
                .then((msgObject) => {
                    channelData.bulkDelete(msgObject)
                        .then(m => {
                            msgDeleted += m.size
                            bot.user.setPresence({
                                activity: {
                                    name: `Se han borrado ${msgDeleted} mensajes`
                                },
                                status: 'online'
                            });
                        })
                        .catch(e => console.log(e))
                })
                .catch((e) => console.log(e));
        })
        .catch((e) => console.log(e));
}

setInterval(init, 1000 * 60 * 60 * 24);
