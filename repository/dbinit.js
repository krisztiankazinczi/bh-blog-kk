const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('../data/posts.db')

const posts = require('../data/posts')

db.serialize(function () {

    db.run("CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT, title VARCHAR(60), slug VARCHAR(60), author VARCHAR(60), last_modified_at VARCHAR(60) NOT NULL, published_at INTEGER, content TEXT, draft INTEGER)");

    for (let i = 0; i < posts.length; i++) {
        db.run("INSERT INTO posts (title, slug, author, last_modified_at, published_at, content, draft) VALUES (?,?,?,?,?,?,?)", [posts[i].title, posts[i].slug, posts[i].author, posts[i].last_modified_at, posts[i].published_at, posts[i].content, 0]);
    }

    db.close();
});

