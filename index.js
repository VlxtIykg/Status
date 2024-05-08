const Eris = require("eris")
const { checkUsernameAvailability } = await import("./backend/retrieve_id")
const bot = new Eris(process.env.bot_token);
const { getQuery } = require("./backend/database.js")
const { encrypt, decrypt } = require("./backend/crypto.js");

bot.on("ready", () => {
  console.log("Bot joineed!");
});

bot.on("messageCreate", (msg) => {
  if(msg.content === "!ping") {
    bot.createMessage(msg.channel.id, "Pong!");
  }

  if(msg.content === "!status") {
    const roblox_alts = getQuery("getAltTable")(encrypt(msg.author.id))
    roblox_alts.forEach(async username => {
      const uname = username.roblox_alt
      console.log(uname);
      const roblox_details = await checkUsernameAvailability(uname);
      console.log(roblox_details);
    });
  }
});

bot.connect();

/**
 * The plan 
 * basically
 * send an interaction message
 * Then afterwards
 * after each foreach, send a 
 * interaction reply edit to
 * add in the statuses
 */