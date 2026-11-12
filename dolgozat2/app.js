import express from "express";
import * as db from "./data/db.js";

const PORT = 3000;
const app = express();

app.use(express.json());

app.get("/api/equipment/:id", (req, res) => {
  const id = +req.params.id;
  const equipment = db.getEquipmentById(id);
  if (!equipment) {
    return res.status(404).json({ message: "Equipment not found." });
  }
  res.status(200).json(equipment);
});

app.get("/api/equipment/category/:category", (req, res) => {
  const category = req.params.category;
  const equipments = db.getEquipmentsByCategory(category);
  if (!equipments || equipments.length === 0) {
    return res
      .status(404)
      .json({ message: "No equipment found in this category." });
  }
  res.status(200).json(equipments);
});

app.put("/api/equipment/:id", (req, res) => {
  const id = +req.params.id;
  const equipment = db.getEquipmentById(id);
  if (!equipment) {
    return res.status(404).json({ message: "Equipment not found." });
  }

  const { name, category, brand, price, quantity } = req.body;
  if (!name || !category || !brand || price == null || quantity == null) {
    return res.status(400).json({ message: "All fields are required." });
  }

  db.updateEquipment(id, name, category, brand, price, quantity);
  res.status(200).json({ id, name, category, brand, price, quantity });
});

app.delete("/api/equipment/:id", (req, res) => {
  const id = +req.params.id;
  const equipment = db.getEquipmentById(id);
  if (!equipment) {
    return res.status(404).json({ message: "Equipment not found." });
  }

  db.deleteEquipment(id);
  res.status(200).json({ message: "Equipment successfully deleted." });
});

app.listen(PORT, () => console.log(`Server runs on port ${PORT}`));
