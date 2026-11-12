import Database from "better-sqlite3";

const db = new Database("./data/sports.db");

export const getEquipmentById = (id) =>
  db
    .prepare(
      `
      SELECT * FROM sports WHERE id = ?
      `,
    )
    .get(id);

export const getEquipmentsByCategory = (category) =>
  db
    .prepare(
      `
      SELECT * FROM sports WHERE category = ?
      `,
    )
    .all(category);

export const updateEquipment = (id, name, category, brand, price, quantity) =>
  db
    .prepare(
      `
      UPDATE sports SET name = ?, category = ?, brand = ?, price = ?, quantity = ? WHERE id = ?
      `,
    )
    .run(name, category, brand, price, quantity, id);

export const deleteEquipment = (id) =>
  db.prepare(`DELETE FROM sports WHERE id = ?`).run(id);
