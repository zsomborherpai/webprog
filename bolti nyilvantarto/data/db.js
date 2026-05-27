import Database from "better-sqlite3";

const db = new Database("./data/database.sqlite");

db.prepare(
  `
    CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name STRING,
    weight INT,
    material STRING
    )
    `,
).run();

export function getAllProducts() {
  return db.prepare("SELECT * FROM products").all();
}

export function getProductById(id) {
  return db.prepare("SELECT * FROM products WHERE id = ?").get(id);
}

export function saveProduct(name, weight, material) {
  const stmt = db.prepare(
    "INSERT INTO products (name, weight, material) VALUES (?, ?, ?)",
  );
  return stmt.run(name, weight, material);
}

export function updateProduct(id, name, weight, material) {
  const stmt = db.prepare(
    "UPDATE products SET name = ?, weight = ?, material = ? WHERE id = ?",
  );
  return stmt.run(name, weight, material, id);
}

export function deleteProduct(id) {
  const stmt = db.prepare("DELETE FROM products WHERE id = ?");
  return stmt.run(id);
}

const { productsNumber } = db
  .prepare(`SELECT COUNT(*) AS productsNumber FROM products`)
  .get();
if (productsNumber == 0) {
  saveProduct("Tölgyfa Étkezőasztal", 34, "Fa");
  saveProduct("Fém Irodai Szék", 8, "Fém");
  saveProduct("Üveg Dohányzóasztal", 15, "Üveg");
  saveProduct("Műanyag Kerti Szék", 3, "Műanyag");
  saveProduct("Bőr Kanapé", 52, "Bőr");
}
