const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");

const writeToFile = (id) => {
  console.log("Writing", id, "to file");

  fs.appendFile("data/users.txt", id + "\n", (err) => {
    if (err) throw err;
  });
};

const getListedUsers = () => {
  let text = fs.readFileSync("data/users.txt").toString("utf-8");
  let users = text.split("\n");

  return users;
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("addme")
    .setDescription("Adds user to activity tracking"),
  async execute(interaction) {
    let id = interaction.user.id;
    currentUsers = getListedUsers();
    console.log(interaction.guildId);
    if (currentUsers.includes(id)) {
      let replyString = `${interaction.user.username} is already a part of Activity Tracking`;
      await interaction.reply(replyString);
    } else {
      writeToFile(id);
      let replyString = `${interaction.user.username} added to Activity Tracking`;
      await interaction.reply(replyString);
    }
  },
};
