'use strict';

class DBHandler {
  constructor(DAO) {
    this.db = DAO;
  }

  run(sql, params=[]) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function (err) {
        if (err) {
          console.log('Error running SQL:' + sql);
          console.log(err);
          reject(err);
        } else {
          resolve({id: this.lastID, changes: this.changes});
        }
      });
    })
  }
    
  get(sql, params=[]) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, result) => {
        if (err) {
          console.log('Error running SQL: ' + sql);
          console.log(err);
          reject(err);
        } else {
          resolve(result);
        }
      })
    })
  }

  all(sql, params=[]) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          console.log('Error running SQL: ' + sql);
          console.log(err);
          reject(err);
        } else {
          resolve(rows);
        }
      })
    })
  }

}

module.exports = DBHandler;