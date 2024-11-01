const fs = require("fs").promises;
const path = require("path");

// CONSTANTS & IMPORTS
const TASKS_FILE = path.join(__dirname, "tasks.json");

// FILE OPERATIONS
async function loadTasks() {
  try {
    const data = await fs.readFile(TASKS_FILE, "utf8");
    return JSON.parse(data || "[]");
  } catch (err) {
    if (err.code === "ENOENT") {
      await fs.writeFile(TASKS_FILE, JSON.stringify([]));
      return [];
    } else {
      console.log("Error loading tasks", err);
      throw err;
    }
  }
}

async function saveTasks(tasks) {
  await fs.writeFile(TASKS_FILE, JSON.stringify(tasks, null, 2));
}

// TASK OPERATIONS

// List Task || type: completed|todo/in-progress
async function listTasks(type) {
  try {
    const tasks = await loadTasks();
    switch (type) {
      case "completed":
        console.log(tasks.filter((task) => task.completed === true));
        break;

      case "in-progress":
        console.log(tasks.filter((task) => task.inProgress === true));
        break;

      default:
        console.log(tasks);
    }
  } catch (err) {
    console.log(err);
  }
}

// Add Task
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
    console.log(`✓ Task Added Succesfully: [${newTask.id}] - ${description}`);
  } catch (err) {
    console.log("Error adding task", err);
  }
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
    console.log(`✓ Task ${id} updated successfully to: ${newDescription}`);
  } catch (err) {
    console.log("Error updating task:", err);
  }
}

// Delete Task
async function deleteTask(id) {
  try {
    const tasks = await loadTasks();
    const taskId = parseInt(id);
    const taskIndex = tasks.findIndex((task) => task.id === taskId);

    if (taskIndex === -1) {
      console.log(`Task with id ${id} not found`);
      return;
    }

    tasks.splice(taskIndex, 1);
    await saveTasks(tasks);
    console.log(`✓ Task ${id} deleted successfully!`);
  } catch (err) {
    console.log("Error deleting task:", err);
  }
}

// Toggle Task Status
async function toggleTask(id, taskStatus) {
  try {
    const tasks = await loadTasks();
    const taskId = parseInt(id);
    const taskIndex = tasks.findIndex((task) => task.id === taskId);

    if (taskIndex === -1) {
      console.log(`Task with id ${id} not found`);
      return;
    }

    const task = tasks[taskIndex];

    switch (taskStatus) {
      case "done":
        task.completed = true;
        task.inProgress = false;
        break;
      case "in-progress":
        task.completed = false;
        task.inProgress = true;
        break;
      default:
        task.completed = false;
        task.inProgress = false;
        break;
    }

    await saveTasks(tasks);
    console.log(`Task ${id} status updated to ${taskStatus}`);
  } catch (err) {
    console.log("Error updating task status:", err);
  }
}

// UI/HELP
function showHelp() {
  console.log(`
Available Commands:
  list              - Show all tasks
  add <description> - Add a new task
  update <id> <description> - Update a task
  delete <id>       - Delete a task
  toggle <id>       - Toggle task status (Not Started → In Progress → Completed)
  help              - Show this help message
  `);
}

// CLI HANDLING
const command = process.argv[2];
const description = process.argv[3];

// console.log(process.argv);

switch (command) {
  case "list":
    if (process.argv[3] === "completed") {
      listTasks("completed");
    } else if (process.argv[3] === "todo") {
      listTasks();
    } else if (process.argv[3] === "in-progress") {
      listTasks("in-progress");
    } else {
      listTasks();
    }
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

  case "delete":
    const deleteId = process.argv[3];
    if (deleteId) {
      deleteTask(deleteId);
    } else {
      console.log("Please provide a task id to delete!");
    }
    break;

  // node index.js status 1 done/in-progress
  case "status":
    const statusId = process.argv[3];
    const taskStatus = process.argv[4];
    if (statusId && taskStatus) {
      toggleTask(statusId, taskStatus);
    } else {
      console.log("Please provide a task id and task status!");
    }
    break;

  case "help":
    showHelp();
    break;

  default:
    console.log(
      "Unknown command. Use 'help' to see list of all available commands.",
    );
}
