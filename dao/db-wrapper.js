const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data/posts.db');

module.exports = class DB {

    get(sqlString, params) {
        return new Promise((resolve, reject) => {
            db.serialize(() => {
                db.get(sqlString, [params], (err, result) => {
                    if (err) {
                        reject(err);
                        return
                    }
                    resolve(result)
                })
            })
        })
    }

    all(sqlString, params) {
        return new Promise((resolve, reject) => {
            db.serialize(() => {
                db.all(sqlString, params, (err, results) => {
                    if (err) {
                        reject(err);
                        return
                    }
                    resolve(results)
                })
            })
        })
    }

    run(sqlString, params) {
        return new Promise((resolve, reject) => {
            db.serialize(() => {
                db.run(sqlString, params, function (err, lastId) {
                    if (err) {
                        reject(err);
                        return
                    }
                    resolve(lastId)
                })
            })
        })
    }

}