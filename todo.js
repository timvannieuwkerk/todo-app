// Queryselectors
const newCategoryMenuOpen = document.querySelector(".fa-square-plus");
const newCategoryConfirm = document.querySelector(".fa-square-check");
const newCategoryMenu = document.querySelector(".nieuw");
const newCategoryName = document.querySelector("#newCategoryName");
const todoForm = document.querySelector("#todo-form");
const chooseCategoryButton = document.querySelector(".categories-choose");
const errorCategoryCannotBeEmpty = document.querySelector(".error");
const inputTitleField = document.querySelector("#title");
const inputDateField = document.querySelector("#date");
const chooseCategoryList = document.querySelector(".categories-options");
const chooseDateButton = document.querySelector("#date");
const toDoOverview = document.querySelector(".to-do-overview");

// Array to store category titles
const categoryOptionsTitles = [];

// Loading the page
window.addEventListener("load", () => {
  // EventListeners
  // 1. EventListener newCategoryMenuOpen
  OpenNewCategoryMenu();

  // 2. EventListener newCategoryConfirm
  UpdateNewCategory();

  // 3. EventListener chooseCategoryButton
  OpenCategoryMenu();

  // 4. EventListener chooseDateButton
  OpenDateMenu();

  // 5. EventListener Submit
  SubmitNewToDo();

  // 6. EventListener clickOnWindow
  CloseOpenFields();

  // Initial categories and items display
  DisplayCategories();
});

// FUNCTIONS
// A: EventListeners

function OpenNewCategoryMenu() {
  newCategoryMenuOpen.addEventListener("click", () => {
    newCategoryMenu.classList.toggle("hidden");
  });
}

function UpdateNewCategory() {
  newCategoryConfirm.addEventListener("click", async () => {
    if (newCategoryName.value === "") {
      newCategoryMenu.classList.toggle("hidden");
    } else {
      try {
        const response = await fetch("/.netlify/functions/addCategory", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ category: newCategoryName.value }),
        });
        if (!response.ok) {
          throw new Error("Failed to add new category");
        }
        newCategoryName.value = "";
        newCategoryMenu.classList.toggle("hidden");
        DisplayCategories();
      } catch (error) {
        console.error("Error adding category:", error.message);
      }
    }
  });
}

function OpenCategoryMenu() {
  chooseCategoryButton.addEventListener("click", () => {
    chooseCategoryList.classList.toggle("hidden");
    chooseCategoryButton.classList.toggle("border");
  });
}

function OpenDateMenu() {
  chooseDateButton.addEventListener("click", () => {
    chooseDateButton.classList.remove("grijs");
  });
}

async function addTodo(title, category, date) {
  try {
    const response = await fetch("/.netlify/functions/addTodo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, category, date }),
    });
    if (!response.ok) {
      throw new Error("Failed to add new todo");
    }
    const data = await response.json();
    DisplayTodos(); // Update todos display
  } catch (error) {
    console.error("Error adding todo:", error);
  }
}

function SubmitNewToDo() {
  todoForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (chooseCategoryButton.value === "Kies een categorie") {
      errorCategoryCannotBeEmpty.classList.remove("hidden");
      return;
    }

    const title = event.target.elements.title.value;
    const category = chooseCategoryButton.value;
    const date = event.target.elements.date.value;

    addTodo(title, category, date);

    inputTitleField.value = "";
    chooseCategoryButton.value = "Kies een categorie";
    chooseCategoryButton.classList.add("grijs");
    inputDateField.value = "";
    inputDateField.classList.add("grijs");
  });
}

function CloseOpenFields() {
  window.onclick = function (event) {
    if (
      !event.target.matches(".categories-choose") &&
      !chooseCategoryList.classList.contains("hidden")
    ) {
      chooseCategoryList.classList.add("hidden");
      chooseCategoryButton.classList.remove("border");
    }
  };
}

// B: Displayfunctions

function DisplayCategories() {
  fetch("/.netlify/functions/getCategories")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      return response.json();
    })
    .then((categories) => {
      toDoOverview.innerHTML = ""; // Clear previous categories
      chooseCategoryList.innerHTML = "";

      const toDoTitle = document.createElement("h2");
      toDoTitle.innerText = "To Do Overzicht";
      toDoOverview.appendChild(toDoTitle);

      categories.forEach((cat) => {
        const categoryButton = document.createElement("button");
        categoryButton.classList.add("option");
        categoryButton.type = "button";
        categoryButton.innerText = cat.category;
        categoryButton.dataset.categoryId = cat._id; // Voeg de categorie-ID toe aan de dataset van het element
        chooseCategoryList.appendChild(categoryButton);

        const categoryDivMain = document.createElement("div");
        categoryDivMain.classList.add("to-do-category");
        const categoryTitle = document.createElement("h4");
        categoryTitle.dataset.categoryId = cat._id;
        categoryTitle.innerText = cat.category;
        categoryDivMain.appendChild(categoryTitle);

        // Append todo list div and set its class
        const todoList = document.createElement("div");
        todoList.classList.add("todo-list");
        categoryDivMain.appendChild(todoList);

        toDoOverview.appendChild(categoryDivMain);

        categoryOptionsTitles.push(categoryTitle); // Push each category title to the array
      });

      const categoryOptionsIndividueel = document.querySelectorAll(".option");

      categoryOptionsIndividueel.forEach((option) => {
        option.addEventListener("click", (event) => {
          errorCategoryCannotBeEmpty.classList.add("hidden");

          let newOption = event.target.innerHTML;

          chooseCategoryButton.value = newOption;

          chooseCategoryList.classList.toggle("hidden");
          chooseCategoryButton.classList.toggle("border");
          chooseCategoryButton.classList.remove("grijs");
        });
      });

      // Call CheckIfCategoryIsEmpty after all categories are displayed
      DisplayTodos();
    })
    .catch((error) => {
      console.error("Error fetching categories:", error.message);
    });
}

function DisplayTodos() {
  fetch("/.netlify/functions/getTodos")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch todos");
      }
      return response.json();
    })
    .then((todos) => {
      const allCategories = document.querySelectorAll(".to-do-category");

      for (let i = 0; i < allCategories.length; i++) {
        const todoList = allCategories[i].querySelector(".todo-list");
        todoList.innerHTML = ""; // Clear previous todo items
      }

      todos.forEach((todo) => {
        const newTodoItem = document.createElement("div");
        const newTitle = document.createElement("input");
        const newDate = document.createElement("input");
        const editButton = document.createElement("i");
        const deleteButton = document.createElement("i");

        newTodoItem.classList.add("todo-item", "read-only");
        newTitle.classList.add("text");
        newDate.classList.add("date-todo");
        editButton.classList.add("fa-solid", "fa-pen-to-square");
        deleteButton.classList.add("fa-regular", "fa-trash-can");

        newTitle.value = todo.title;
        newDate.value = todo.date;

        newTitle.readOnly = true;
        newDate.type = "date";
        newDate.readOnly = true;

        newTodoItem.append(newTitle, newDate, editButton, deleteButton);

        for (let i = 0; i < allCategories.length; i++) {
          if (allCategories[i].firstElementChild.innerText === todo.category) {
            const todoList = allCategories[i].querySelector(".todo-list");
            todoList.appendChild(newTodoItem);
          }
        }

        // EventListeners for Buttons
        const titleToFind = newTitle.value;
        const categoryToFind = todo.category;
        const dateToFind = newDate.value;

        editButton.addEventListener("click", async () => {
          try {
            if (newTodoItem.classList.contains("read-only")) {
              newTodoItem.classList.toggle("read-only");
              newTitle.readOnly = !newTitle.readOnly;
              newDate.readOnly = !newDate.readOnly;
              editButton.classList.remove("fa-pen-to-square");
              editButton.classList.add("fa-floppy-disk");
            } else {
              const updatedTodo = {
                title: newTitle.value,
                category: categoryToFind,
                date: newDate.value,
              };

              const response = await fetch(`/.netlify/functions/updateTodo`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: todo._id, ...updatedTodo }),
              });

              if (!response.ok) {
                throw new Error("Failed to update todo");
              }

              newTodoItem.classList.toggle("read-only");
              newTitle.readOnly = !newTitle.readOnly;
              newDate.readOnly = !newDate.readOnly;
              editButton.classList.remove("fa-floppy-disk");
              editButton.classList.add("fa-pen-to-square");
              DisplayTodos();
            }
          } catch (error) {
            console.error("Error updating todo:", error.message);
          }
        });

        deleteButton.addEventListener("click", async () => {
          try {
            const response = await fetch(`/.netlify/functions/deleteTodo`, {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ id: todo._id }),
            });

            if (!response.ok) {
              throw new Error("Failed to delete todo");
            }

            DisplayTodos();
            CheckIfCategoryIsEmpty();
          } catch (error) {
            console.error("Error deleting todo:", error.message);
          }
        });
      });
    })
    .catch((error) => {
      console.error("Error fetching todos:", error.message);
    });
  CheckIfCategoryIsEmpty();
  DateTodaySetting();
}

// C: Other functions
function DateTodaySetting() {
  const datumVandaag = new Date().toISOString().split("T")[0].toString();
  document.querySelectorAll(["#date", ".date-todo"]).forEach((x) => {
    x.setAttribute("min", datumVandaag);
  });
}

function CheckIfCategoryIsEmpty() {
  fetch("/.netlify/functions/getCategories")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      return response.json();
    })
    .then((categories) => {
      fetch("/.netlify/functions/getTodos")
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch todos");
          }
          return response.json();
        })
        .then((todos) => {
          const categoryOptionsTitlesNew =
            document.querySelectorAll(".to-do-category h4");

          for (let i = 0; i < categoryOptionsTitlesNew.length; i++) {
            const categoryTitle = categoryOptionsTitlesNew[i].innerText;
            const categoryId = categoryOptionsTitlesNew[i].dataset.categoryId;

            // Verwijder de eventlistener voordat deze opnieuw wordt toegevoegd
            categoryOptionsTitlesNew[i].removeEventListener(
              "click",
              handleClick(categoryId)
            );

            if (!todos.some((todo) => todo.category === categoryTitle)) {
              categoryOptionsTitlesNew[i].classList.add("red-delete");
              categoryOptionsTitlesNew[i].addEventListener(
                "click",
                function handleClick() {
                  const categoryId = this.dataset.categoryId;
                  deleteCategory(categoryId);
                }
              );
            } else {
              categoryOptionsTitlesNew[i].classList.remove("red-delete");
              categoryOptionsTitlesNew[i].removeEventListener(
                "click",
                handleClick
              );
            }
          }
        });
    });
}

async function handleClick(categoryId) {
  const categoryOptionsTitlesNew =
    document.querySelectorAll(".to-do-category h4");

  try {
    const response = await fetch(`/.netlify/functions/deleteCategory`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: categoryId }),
    });
    if (!response.ok) {
      throw new Error("Failed to delete category");
    }
    DisplayCategories();
  } catch (error) {
    console.error("Error:", error);
  }
}

async function deleteCategory(categoryId) {
  try {
    const response = await fetch(`/.netlify/functions/deleteCategory`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: categoryId }),
    });
    if (!response.ok) {
      throw new Error("Failed to delete category");
    }
    DisplayCategories();
  } catch (error) {
    console.error("Error:", error);
  }
}
