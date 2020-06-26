const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const Bots = require("@models/vote");
var modLog;

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            permissionLevel: 8,
            usage: '[User:user]',
            aliases: ['v']
        });
    }

    async run(message, [user]) {
        if (!user || !user.bot) return message.channel.send(`Ping a **bot**.`);
        let bot = await BotsCheck.findOne({botid: user.id}, { _id: false })
        Bots.findOne({
          botid: user.id}, (err, res) => {
            if(!res){
           return message.reply("Not Exists bot!")
         }else if(res.state == 'unverified'){
                      return message.reply("That bot not verified to recieve votes!")
         }
            res.votes = res.votes- + -1
            res.save()
          return message.channel.send("Success voted for " + user.username)
        })
        let e = new MessageEmbed()
            .setTitle('Vote Message')
            .addField(`Bot`, `<@${user.id}>`, true)
            .addField("Voter", message.author, true)
            .setThumbnail(bot.logo)
            .setTimestamp()
            .setColor(0x26ff00)
        modLog.send(e);
        modLog.send(`${message.author}`).then(m => { m.delete() });
    }

    async init() {
        modLog = this.client.channels.cache.get(process.env.MOD_LOG_ID);
    }
};
