const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('../data/posts.db')

const posts = require('../data/posts')

db.serialize(function () {

    db.run("CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT, title VARCHAR(60) NOT NULL, slug VARCHAR(60) NOT NULL, author VARCHAR(60) NOT NULL, created_at VARCHAR(60) NOT NULL, content TEXT NOT NULL)");

    for (let i = 0; i < posts.length; i++) {
        db.run("INSERT INTO posts (title, slug, author, created_at, content) VALUES (?,?,?,?,?)", [posts[i].title, posts[i].slug, posts[i].author, posts[i].created_at, posts[i].content]);
    }

    db.close();
});

