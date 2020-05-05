const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('../data/posts.db')

const posts = require('../data/posts')

db.serialize(function () {

    //   db.run("DROP TABLE posts")
    //   db.run("DROP TABLE users")
    //   db.run("DROP TABLE tags_in_post")
    //   db.run("DROP TABLE tags")
    //   db.run("CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT, title VARCHAR(80), author VARCHAR(60), last_modified_at INTEGER NOT NULL, published_at INTEGER, content TEXT, draft INTEGER)");
    //   db.run("CREATE TABLE IF NOT EXISTS slugs (id INTEGER PRIMARY KEY AUTOINCREMENT, post_id INTEGER NOT NULL, slug VARCHAR(80), isActive INTEGER, FOREIGN KEY (post_id) REFERENCES posts (id))")
 


    // db.run("CREATE TABLE IF NOT EXISTS tags (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(100) NOT NULL)");
    // db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(100) NOT NULL, username VARCHAR(100) NOT NULL, password VARCHAR(100) NOT NULL, email VARCHAR(100) NOT NULL, isAdmin INTEGER, isSuperAdmin INTEGER)");
    // db.run("INSERT INTO users(name, username, password, email, isAdmin, isSuperAdmin) VALUES ('Admin Admin','admin', 'admin', 'lilkrisz17@gmail.com', 1, 1)")
    // db.run("INSERT INTO tags(name) VALUES ('Computers')");
    // db.run("INSERT INTO tags(name) VALUES ('Conspiracy Theories')");
    // db.run("INSERT INTO tags(name) VALUES ('Kitchen')");
    // db.run("INSERT INTO tags(name) VALUES ('Intresting')");
    // db.run("INSERT INTO tags(name) VALUES ('Travel')");
    // db.run("INSERT INTO tags(name) VALUES ('Phones')");
    // db.run("INSERT INTO tags(name) VALUES ('Environment')");
    // db.run("INSERT INTO tags(name) VALUES ('Economy')");


    // db.run("CREATE TABLE IF NOT EXISTS tags_in_post (id INTEGER PRIMARY KEY AUTOINCREMENT, post_id INTEGER NOT NULL, tag_id INTEGER NOT NULL, FOREIGN KEY (post_id) REFERENCES posts (id), FOREIGN KEY (tag_id) REFERENCES tags (id))");



       // db.run("CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT, title VARCHAR(60), slug VARCHAR(60), author VARCHAR(60), last_modified_at VARCHAR(60) NOT NULL, published_at INTEGER, content TEXT, draft INTEGER)");

    // for (let i = 0; i < posts.length; i++) {
    //     db.run("INSERT INTO posts (title, slug, author, last_modified_at, published_at, content, draft) VALUES (?,?,?,?,?,?,?)", [posts[i].title, posts[i].slug, posts[i].author, posts[i].last_modified_at, posts[i].published_at, posts[i].content, 0]);
    // }
    // db.run("INSERT INTO tags_in_post(post_id, tag_id) VALUES (1, 1)");
    // db.run("INSERT INTO tags_in_post(post_id, tag_id) VALUES (1, 2)");
    // db.run("INSERT INTO tags_in_post(post_id, tag_id) VALUES (2, 1)");
    // db.run("INSERT INTO tags_in_post(post_id, tag_id) VALUES (3, 4)");
    // db.run("INSERT INTO tags_in_post(post_id, tag_id) VALUES (3, 5)");
    // db.run("INSERT INTO tags_in_post(post_id, tag_id) VALUES (4, 7)");
    // db.run("INSERT INTO tags_in_post(post_id, tag_id) VALUES (5, 6)");
    // db.run("INSERT INTO tags_in_post(post_id, tag_id) VALUES (6, 8)");
    // db.run("INSERT INTO tags_in_post(post_id, tag_id) VALUES (7, 5)");
    // db.run("INSERT INTO tags_in_post(post_id, tag_id) VALUES (8, 3)");
    // db.run("INSERT INTO tags_in_post(post_id, tag_id) VALUES (9, 2)");
    // db.run("INSERT INTO tags_in_post(post_id, tag_id) VALUES (10, 1)");
    // db.run("INSERT INTO tags_in_post(post_id, tag_id) VALUES (11, 7)");
    // db.run("INSERT INTO tags_in_post(post_id, tag_id) VALUES (12, 5)");
    // db.run("INSERT INTO tags_in_post(post_id, tag_id) VALUES (13, 4)");
    // db.run("INSERT INTO tags_in_post(post_id, tag_id) VALUES (5, 3)");
    // db.run("INSERT INTO tags_in_post(post_id, tag_id) VALUES (6, 7)");
    // db.run("INSERT INTO tags_in_post(post_id, tag_id) VALUES (7, 8)");
    // db.run("INSERT INTO tags_in_post(post_id, tag_id) VALUES (8, 8)");
    // db.run("INSERT INTO tags_in_post(post_id, tag_id) VALUES (9, 8)");
    // db.run("INSERT INTO tags_in_post(post_id, tag_id) VALUES (10, 8)");
    // db.run("INSERT INTO tags_in_post(post_id, tag_id) VALUES (11, 8)");
    // db.run("INSERT INTO tags_in_post(post_id, tag_id) VALUES (12, 8)");
    // db.run("INSERT INTO tags_in_post(post_id, tag_id) VALUES (13, 8)");
    // db.run("INSERT INTO tags_in_post(post_id, tag_id) VALUES (1, 8)");


    
    db.close();
});

