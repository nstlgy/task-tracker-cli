const fs = require("fs").promises;
const path = require("path");

// CONSTANTS
const TASKS_FILE = path.join(__dirname, "tasks.json");

// load all tasks
async function loadTasks() {
  try {
    const data = await fs.readFile(TASKS_FILE, "utf8");
    return JSON.parse(data || "[]");
  } catch (err) {
    // ENOENT : Error No Entity (Specified file/directory doesnt exist)
    if (err.code === "ENOENT") {
      await fs.writeFile(TASKS_FILE, JSON.stringify([]));
      return [];
    } else {
      console.log("Error loading tasks", err);
      throw err;
    }
  }
}

// List all tasks
async function listTasks() {
  try {
    const tasks = await loadTasks();
    console.log(tasks);
  } catch (err) {
    console.log(err);
  }
}

// add a new task
async function addTask(description) {
  try {
    const tasks = await loadTasks();

    const newTask = {
      id: tasks.length + 1,
      description,
      completed: false,
      inProgress: false,
    };

    tasks.push(newTask);

    await saveTasks(tasks);
    console.log(`Task Added Succesfully: [${newTask.id}] - ${description}`);
  } catch (err) {
    console.log("Error adding task", err);
  }
}

// Save tasks into the file
async function saveTasks(tasks) {
  await fs.writeFile(TASKS_FILE, JSON.stringify(tasks, null, 2));
}

// Update Task
async function updateTasks(id, newDescription) {
  try {
    const tasks = await loadTasks();
    const taskId = parseInt(id);

    const taskIndex = tasks.findIndex((task) => task.id === taskId);

    if (taskIndex === -1) {
      console.log(`Task with id ${id} not found`);
      return;
    }

    tasks[taskIndex].description = newDescription;
    await saveTasks(tasks);

    console.log(`Task ${id} updated successfully to: ${newDescription}`);
  } catch (err) {
    console.log("Error updating task:", err);
  }
}

// CLI
const command = process.argv[2];
const description = process.argv[3];

switch (command) {
  case "list":
    listTasks();
    break;

  case "add":
    if (description) {
      addTask(description);
    } else {
      console.log("Please provide a task description!");
    }
    break;

  case "update":
    const id = process.argv[3];
    const newDescription = process.argv[4];
    if (id && newDescription) {
      updateTasks(id, newDescription);
    } else {
      console.log(
        `Please provide an "id" and "description" in the format "update <id> <description>" `,
      );
    }
    break;

  default:
    console.log(
      "Unknown command. Use 'help' to see list of all available commands.",
    );
}
