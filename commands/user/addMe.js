const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const DataWarehouse = require("../../services/DuckDb");

const writeToFile = (id) => {
  console.log("Writing", id, "to file");

  fs.appendFile("data/users.csv", id + "\n", (err) => {
    if (err) throw err;
  });
};

const getListedUsers = async (dw) => {
  let users = await dw.query("select user_id from GuildUsers");

  console.log(users);

  return users;
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("addme")
    .setDescription("Adds user to activity tracking"),
  async execute(interaction) {
    const dw = new DataWarehouse();

    let userId = interaction.user.id;
    let guildId = interaction.guild.id;

    currentUsers = await getListedUsers(dw);
    console.log(interaction.guildId);

    if (currentUsers.includes(id)) {
      let replyString = `${interaction.user.username} is already a part of Activity Tracking`;
      await interaction.reply(replyString);
    } else {
      writeToFile(guildId, userId);
      let replyString = `${interaction.user.username} added to Activity Tracking`;
      await interaction.reply(replyString);
    }
  },
};
