module.exports = class DataWarehouse {
  db;
  constructor() {
    var duckdb = require("duckdb");
    this.db = new duckdb.Database("discord_activity_tracker.duckdb");
    // this.db.connect();
  }

  get db() {
    return this.db;
  }

  async launchDb() {
    await this.query(
      "create table if not exists StatusEvents(status_timestamp TIMESTAMPTZ default CURRENT_TIMESTAMP, user_id VARCHAR, status VARCHAR, activities VARCHAR, client_status VARCHAR);"
    );

    await this.query(
      "create table if not exists GuildUsers(guild_id VARCHAR, user_id VARCHAR, created_at TIMESTAMPTZ default CURRENT_TIMESTAMP); "
    );

    // My test user in cocko disco

    let result = await this.query(
      "select * from GuildUsers where user_id = '375853254053068803'"
    );
    console.log(result.length);
    if (result.length == 0) {
      await this.query(
        "insert into GuildUsers(guild_id, user_id) values ('964986533683806309', '375853254053068803');"
      );
    }
  }

  async query(queryString) {
    return new Promise((resolve, reject) => {
      this.db.all(queryString, (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }
};

// module.exports = class DataWarehouse extends DataWarehouseContext {
//   con;
// };

// Example code to use the above:
//
// let a_db = new DataWarehouse();
//
// const get_query = async () => {
//   let result = await a_db.query("select 1");
//   console.log(result);
//   return result;
// };
//
// let a = get_query();
