const alert = document.querySelector(".alert");
const form = document.querySelector(".grocery-form");
const grocery = document.getElementById("grocery");
const submitBtn = document.querySelector(".submit-btn");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const clearBtn = document.querySelector(".clear-btn");

// Edit
let editElement;
let editFag = false;
let editID = "";

// Submit Form
form.addEventListener("submit", addItem);

// Clear items
clearBtn.addEventListener("click", clearItems);

// Load items
window.addEventListener("DOMContentLoaded", setupItems);

function addItem(e) {
  e.preventDefault();
  const value = grocery.value;
  const id = new Date().getTime().toString();
  if (value && !editFag) {
    createListItem(id, value);
    // Display Alert
    displayAlert("Item added to the list", "success");
    // Show Container
    container.classList.add("show-container");
    // Add to local storage
    addToLocalStorage(id, value);
    // Set back to default
    setBackToDefault();
  } else if (value && editFag) {
    editElement.innerHTML = value;
    displayAlert("value changed", "success");
    // Edit Local Storage
    editLocalStorage(editID, value);
    setBackToDefault();
  } else {
    displayAlert("Please enter value", "danger");
  }
}

// Display Alert
function displayAlert(text, action) {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);
  // Remove Alert
  setTimeout(function () {
    alert.textContent = "";
    alert.classList.remove(`alert-${action}`);
  }, 1000);
}

// Clear Items
function clearItems() {
  const items = document.querySelectorAll(".grocery-item");
  if (items.length > 0) {
    items.forEach(function (item) {
      list.removeChild(item);
    });
  }
}
container.classList.remove("show-container");
displayAlert("empty list", "danger");
setBackToDefault();

// Delete Items
function deleteItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  const id = element.dataset.id;
  list.removeChild(element);
  if (list.children.length === 0) {
    container.classList.remove("show-container");
  }
  displayAlert("Item deleted", "danger");
  removeFromLocalStorage(id);
}
// Edit Items
function editItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  editElement = e.currentTarget.parentElement.previousElementSibling;
  grocery.value = editElement.innerHTML;
  editFag = true;
  editID = element.dataset.id;
  submitBtn.textContent = "edit";
}

// Set back to default
function setBackToDefault() {
  grocery.value = "";
  editFag = false;
  editID = "";
  submitBtn.textContent = "submit";
}

// Local storsage
function addToLocalStorage(id, value) {
  const grocery = { id, value };
  let items = getLocalStorage();
  items.push(grocery);
  localStorage.setItem("list", JSON.stringify(items));
}

function removeFromLocalStorage(id) {
  let items = getLocalStorage();
  items = items.filter(function (item) {
    if (item.id !== id) {
      return item;
    }
  });
  localStorage.setItem("list", JSON.stringify(items));
}

// Edit Local Storage
function editLocalStorage(id, value) {
  let items = getLocalStorage();
  items = items.map(function (item) {
    if (item.id === id) {
      item.value = value;
    }
    return item;
  });
  localStorage.setItem("list", JSON.stringify(items));
}

// Get Local storage
function getLocalStorage() {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
}

// Setup items
function setupItems() {
  let items = getLocalStorage();
  if (items.length > 0) {
    items.forEach(function (item) {
      createListItem(item.id, item.value);
    });
    container.classList.add("show-container");
  }
}

// Show data from local storage
function createListItem(id, value) {
  const element = document.createElement("article");
  element.classList.add("grocery-item");
  const attr = document.createAttribute("data-id");
  attr.value = id;
  element.setAttributeNode(attr);
  element.innerHTML = ` 
        <p class="title">${value}</p>
            <div class="btn-container">
              <!-- edit btn -->
              <button type="button" class="edit-btn ">
              <i class="bi bi-pencil-square"></i>
              </button>
              <!-- delete btn -->
              <button type="button" class="delete-btn">
              <i class="bi bi-trash-fill"></i>
              </button>
            </div>`;
  const deleteBtn = element.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", deleteItem);
  const editBtn = element.querySelector(".edit-btn");
  editBtn.addEventListener("click", editItem);

  // Append Child
  list.appendChild(element);
}
