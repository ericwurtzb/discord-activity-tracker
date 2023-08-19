module.exports = class DataWarehouse {
  db;
  constructor() {
    var duckdb = require("duckdb");
    this.db = new duckdb.Database("duckular_db.duckdb");
  }

  get db() {
    return this.db;
  }

  async query(queryString) {
    let result;

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
