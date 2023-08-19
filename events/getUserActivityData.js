const { Events } = require("discord.js");
const DataWarehouse = require("../services/DuckDb");

// const fs = require("fs");

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// const getListedUsers = () => {
//   let text = fs.readFileSync("data/users.txt").toString("utf-8");
//   let users = text.split("\n");

//   return users;
// };

// const getUserData = (user = {});

// const getAllData = async (client) => {
//   const userList = getListedUsers();

//   userList.forEach(async (userId) => {
//     let currentGuild = client.guilds.cache.get("964986533683806309");
//     let memberInfo = currentGuild.members.cache.get("375853254053068803");
//     //console.log(memberInfo);
//     let userInfo = await client.users.fetch(userId);
//     // let userInfo = await client.users.fetch(user) this gives user info, nothing about activity
//     console.log("Logging user info");
//     //console.log(userInfo)
//     //console.log(client.guilds.cache)
//   });
// };

const writeStatus = async (dw, userId, status, activities, clientStatus) => {
  console.log("writing status to duck");
  console.log(
    await dw.query(
      `insert into StatusEvent(status_timestamp, user_id, status, activities, client_status) values (DEFAULT, ${userId}, '${status}', '${activities}', '${clientStatus}');`
      //"create or replace table StatusEvent(status_timestamp TIMESTAMPTZ default CURRENT_TIMESTAMP, user_id BIGINT, status VARCHAR, activities VARCHAR, client_status VARCHAR);"
    )
  );
};

const getCurrentGuild = async (client, dw) => {
  let userId = "375853254053068803";
  let guildId = "964986533683806309";

  let currentGuild = await client.guilds.fetch(guildId);
  let currentGuildMember = await currentGuild.members.fetch({
    user: userId,
    withPresences: true,
  });

  let currentStatus = currentGuildMember.presence.status;
  let currentActivity = currentGuildMember.presence.activities;
  let currentClientStatus = currentGuildMember.presence.clientStatus;
  console.log("current guild member");
  console.log(currentStatus);
  console.log(currentActivity);
  console.log(currentGuildMember.presence);

  writeStatus(dw, userId, currentStatus, currentActivity, currentClientStatus);
};

module.exports = {
  name: Events.ClientReady,
  async execute(client) {
    const dw = new DataWarehouse();
    do {
      try {
        await getCurrentGuild(client, dw);
        console.log("Waiting 60 seconds");
        await delay(60000);
      } catch (err) {
        console.error(err);
      }
    } while (true);
  },
};
