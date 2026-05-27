import express from "express";
import * as db from "./data/db.js";

const PORT = 3000;
const app = express();

app.use(express.static("."));
app.use(express.json());

app.get("/api/products", (req, res) => {
  const products = db.getAllProducts();
  res.status(200).json(products);
});

app.get("/api/products/:id", (req, res) => {
  const product = db.getProductById(+req.params.id);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  res.status(200).json(product);
});

app.post("/api/products", (req, res) => {
  const { name, weight, material } = req.body;
  if (!name || !weight || !material) {
    return res
      .status(400)
      .json({ message: "Name, weight and material are required" });
  }
  const newProduct = db.saveProduct(name, weight, material);
  const product = db.getProductById(newProduct.lastInsertRowid);
  res.status(201).json({ message: "Product saved successfully", product });
});

app.put("/api/products/:id", (req, res) => {
  const id = +req.params.id;
  const { name, weight, material } = req.body;
  if (!name || !weight || !material) {
    return res
      .status(400)
      .json({ message: "Name, weight and material are required" });
  }
  const product = db.getProductById(id);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  db.updateProduct(id, name, weight, material);
  const updatedProduct = db.getProductById(id);
  res
    .status(200)
    .json({ message: "Product updated successfully", product: updatedProduct });
});

app.delete("/api/products/:id", (req, res) => {
  const id = +req.params.id;
  const product = db.getProductById(id);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  db.deleteProduct(id);
  res.status(204).json({ message: "Product deleted successfully" });
});

app.listen(PORT, () => console.log(`Server runs on port ${PORT}`));
