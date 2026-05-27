let allProducts = [];
let selectedProductId = null;

const tbody = document.querySelector("#productsTable tbody");
const searchInput = document.getElementById("searchInput");
const btnNew = document.getElementById("btnNew");
const btnEdit = document.getElementById("btnEdit");
const btnDelete = document.getElementById("btnDelete");
const formModal = document.getElementById("formModal");
const productForm = document.getElementById("productForm");
const btnCancel = document.getElementById("btnCancel");
const modalTitle = document.getElementById("modalTitle");

document.addEventListener("DOMContentLoaded", fetchProducts);

async function fetchProducts() {
  try {
    const response = await fetch("/api/products");
    allProducts = await response.json();
    renderTable(allProducts);
    clearSelection();
  } catch (error) {
    console.error("Hiba a letöltés során:", error);
  }
}

function renderTable(products) {
  tbody.innerHTML = "";
  products.forEach((p) => {
    const tr = document.createElement("tr");
    tr.dataset.id = p.id;
    tr.innerHTML = `
            <td>${p.id}</td>
            <td>${p.name}</td>
            <td>${p.weight} kg</td>
            <td>${p.material}</td>
        `;

    tr.addEventListener("click", () => selectRow(tr, p.id));
    tbody.appendChild(tr);
  });
}

function selectRow(rowElement, id) {
  if (selectedProductId === id) {
    clearSelection();
  } else {
    document
      .querySelectorAll("#productsTable tbody tr")
      .forEach((tr) => tr.classList.remove("selected"));
    rowElement.classList.add("selected");
    selectedProductId = id;
    btnEdit.disabled = false;
    btnDelete.disabled = false;
  }
}

function clearSelection() {
  selectedProductId = null;
  document
    .querySelectorAll("#productsTable tbody tr")
    .forEach((tr) => tr.classList.remove("selected"));
  btnEdit.disabled = true;
  btnDelete.disabled = true;
}

searchInput.addEventListener("input", (e) => {
  const term = e.target.value.toLowerCase();
  const filtered = allProducts.filter((p) =>
    p.material.toLowerCase().includes(term),
  );
  renderTable(filtered);
  clearSelection();
});

btnNew.addEventListener("click", () => {
  modalTitle.textContent = "Új termék hozzáadása";
  productForm.reset();
  document.getElementById("productId").value = "";
  formModal.classList.remove("hidden");
});

btnEdit.addEventListener("click", async () => {
  if (!selectedProductId) return;
  try {
    const response = await fetch(`/api/products/${selectedProductId}`);
    const product = await response.json();

    modalTitle.textContent = "Termék módosítása";
    document.getElementById("productId").value = product.id;
    document.getElementById("pName").value = product.name;
    document.getElementById("pWeight").value = product.weight;
    document.getElementById("pMaterial").value = product.material;

    formModal.classList.remove("hidden");
  } catch (error) {
    console.error("Hiba az adatok lekérésekor:", error);
  }
});

btnDelete.addEventListener("click", async () => {
  if (!selectedProductId) return;
  if (confirm("Biztosan törölni szeretnéd ezt a terméket?")) {
    try {
      const response = await fetch(`/api/products/${selectedProductId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchProducts();
      }
    } catch (error) {
      console.error("Hiba a törlés során:", error);
    }
  }
});

productForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = document.getElementById("productId").value;
  const name = document.getElementById("pName").value;
  const weight = parseFloat(document.getElementById("pWeight").value);
  const material = document.getElementById("pMaterial").value;

  const payload = { name, weight, material };

  try {
    let response;
    if (id) {
      response = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    if (response.ok) {
      formModal.classList.add("hidden");
      fetchProducts();
    }
  } catch (error) {
    console.error("Hiba a mentés során:", error);
  }
});

btnCancel.addEventListener("click", () => {
  formModal.classList.add("hidden");
});
