import Database from "better-sqlite3";

const db = new Database("./data/database.sqlite");

db.prepare(`
    CREATE TABLE IF NOT EXISTS posts(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    content TEXT
)
    `).run()


export function getAllPosts(){
    return db.prepare(`SELECT * FROM posts`).all()
}
export function getPostById(id){
    return db.prepare(`SELECT * FROM posts WHERE id = ?`).get()
}
export function savePosts(title,content){
    `INSERT INTO posts(title,content) VALUES (?,?)`
}