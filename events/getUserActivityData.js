const { Events } = require("discord.js");
const DataWarehouse = require("../services/DuckDb");

// const fs = require("fs");

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const getListedUsers = async (dw) => {
  let users = await dw.query(
    "select distinct guild_id, user_id from GuildUsers"
  );

  return users;
};

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
      `insert into StatusEvents(status_timestamp, user_id, status, activities, client_status) values (DEFAULT, ${userId}, '${status}', '${activities}', '${clientStatus}');`
    )
  );
};

const getCurrentGuild = async (client, dw) => {
  let allUsers = await getListedUsers(dw);
  console.log(allUsers);
  allUsers.forEach(async (element) => {
    let userId = element["user_id"];
    let guildId = element["guild_id"];

    // Get the guild + member
    let currentGuild = await client.guilds.fetch(guildId);
    let currentGuildMember = await currentGuild.members.fetch({
      user: userId,
      withPresences: true,
    });

    // Get their statuses
    let currentStatus = currentGuildMember.presence?.status;
    let currentActivity = JSON.stringify(
      currentGuildMember.presence?.activities
    );
    let currentClientStatus = JSON.stringify(
      currentGuildMember.presence?.clientStatus
    );

    console.log("Statuses for User ID: ", userId);
    console.log(currentStatus);
    console.log(currentActivity);
    console.log(currentClientStatus);

    // Write the statuses
    await writeStatus(
      dw,
      userId,
      currentStatus,
      currentActivity,
      currentClientStatus
    );
  });
};

module.exports = {
  name: Events.ClientReady,
  async execute(client) {
    const dw = new DataWarehouse();
    await dw.launchDb();
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
