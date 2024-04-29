const Eris = require("eris")

const bot = new Eris(process.env.bot_token);
bot.on("ready", () => {
  console.log("Bot joineed!");
});
bot.on("messageCreate", (msg) => {
  if(msg.content === "!ping") {
    bot.createMessage(msg.channel.id, "Pong!");
  }
});
bot.connect();