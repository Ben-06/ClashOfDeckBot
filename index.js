function sansAccent(str) {
  var accent = [
    /[\300-\306]/g, /[\340-\346]/g, // A, a
    /[\310-\313]/g, /[\350-\353]/g, // E, e
    /[\314-\317]/g, /[\354-\357]/g, // I, i
    /[\322-\330]/g, /[\362-\370]/g, // O, o
    /[\331-\334]/g, /[\371-\374]/g, // U, u
    /[\321]/g, /[\361]/g, // N, n
    /[\307]/g, /[\347]/g, // C, c
  ];
  var noaccent = ['A', 'a', 'E', 'e', 'I', 'i', 'O', 'o', 'U', 'u', 'N', 'n', 'C', 'c'];
  for (var i = 0; i < accent.length; i++) {
    str = str.replace(accent[i], noaccent[i]);
  }

  return str;
}


const { Client, GatewayIntentBits, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const token = process.env['token']
const keep_alive = require('./keep_alive.js')
const deliquescence = require('./card/deliquescence.json');
const ebrechement = require('./card/ebrechement.json');
const felonie = require('./card/felonie.json');
const insaisissable = require('./card/insaisissable.json');
const starting = require('./card/starting.json');
const submersion = require('./card/submersion.json');
const resistance = require('./card/resistance.json');
const extensionList = [deliquescence, ebrechement, felonie, insaisissable, starting, submersion, resistance];
const fs = require('node:fs');
const vm = require('vm');
vm.runInThisContext(fs.readFileSync(__dirname + "/abilities.js"))
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages] });
client.on('ready', () => {
  console.log('Ready!');
});

client.on('messageCreate', message => {
  if (message.content.startsWith("/addFaq")) {
    if (!message.member.roles.cache.find(role => role.name === "Modérateur")) {
      if (!message.member.roles.cache.find(role => role.name === "Grand créateur")) return;
    };
    var msgSplit = message.content.substring(8).split(";");
    const faqChan = client.channels.cache.get('1001962148194431057');
    var question = msgSplit[0];
    var answer = msgSplit[1];
    const embed = new EmbedBuilder()
      .setTitle(question)
      .setDescription(answer)
      .setColor("0x3482c6")
    faqChan.send({ embeds: [embed] });
  }
  else if (message.content.startsWith("/card")) {
    var cardToSearch = message.content.substring(6).toLocaleLowerCase();
    ext = "";
    extensionList.every(element => {
      element["creature"].every(card => {
        if (card.name == cardToSearch) {
          ext = element.extName;
          return false;
        }
        return true;
      });
      element["incantation"].every(card => {
        if (card.name == cardToSearch) {
          ext = element.extName;
          return false;
        }
        return true;
      });
      if (ext != "") return false;
      return true;
    });
    if (ext == "") {
      message.channel.send("Cette carte n'existe pas.");
      return;
    }
    var file = new AttachmentBuilder(`./card_img/${ext}/${cardToSearch}.png`, { name: `${cardToSearch}.png` });
    message.channel.send({ files: [file] });
  }
  else if (message.content.startsWith("/cs")) {
    var abilities = abilitiesFunc();
    var abilityToSearch = message.content.substring(4).toLocaleLowerCase();
    abilityToSearch = sansAccent(abilityToSearch)
    var ability = abilities.find(ability => sansAccent(ability.name.toLocaleLowerCase()) == abilityToSearch);
    if (ability == undefined) {
      message.channel.send("Cette capacité n'existe pas.");
      return;
    }
    ability.name = sansAccent(ability.name);

    const cs_png = new AttachmentBuilder("./cs_img/" + ability.name.toLocaleLowerCase() + ".png");
    const CSEmbed = new EmbedBuilder()
      .setTitle(ability.name)
      .setDescription(ability.description)
      .setColor("0x3482c6")
      .setThumbnail("attachment://" + ability.name.toLocaleLowerCase() + ".png")
    message.channel.send({ embeds: [CSEmbed], files: [cs_png] });
  }
});

client.login(token);