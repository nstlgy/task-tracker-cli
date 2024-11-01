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

// List Task (status: done | todo | in-progress)
async function listTasks(status) {
  try {
    const tasks = await loadTasks();

    if (status) {
      const filteredTasks = tasks.filter((task) => task.status === status);
      if (filteredTasks.length === 0) {
        console.log(`No tasks with status: ${status}`);
      } else {
        console.log(`Tasks with status ${status}:`);
        console.table(filteredTasks);
      }
    } else {
      if (tasks.length === 0) {
        console.log("No tasks found");
      } else {
        console.log("All tasks:");
        console.table(tasks);
      }
    }
  } catch (err) {
    console.error("Error listing tasks:", err);
  }
}

// Add Task
async function addTask(description) {
  try {
    const tasks = await loadTasks();
    const now = new Date();
    const currentDate = now.toLocaleString();
    const newTask = {
      id: tasks.length + 1,
      description,
      status: "todo",
      createdAt: currentDate,
      updatedAt: null,
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
    const now = new Date();
    const currentDate = now.toLocaleString();

    if (taskIndex === -1) {
      console.log(`Task with id ${id} not found`);
      return;
    }

    tasks[taskIndex].description = newDescription;
    tasks[taskIndex].updatedAt = currentDate;
    await saveTasks(tasks);
    console.log(
      `✓ Task ${id} updated successfully to: ${newDescription} at ${currentDate}`,
    );
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
        task.status = "done";
        break;
      case "in-progress":
        task.status = "in-progress";
        break;
      case "todo":
        task.status = "todo";
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
  list [status]           - Show all tasks or filter by status
                            (todo, done, in-progress)
  add <description>       - Add a new task
  update <id> <desc>      - Update a task's description
  delete <id>             - Delete a task
  status <id> <status>    - Change task status (todo/done/in-progress)
  help                    - Show this help message

Task Statuses:
  todo         - Task not yet started
  in-progress  - Task currently in progress
  done         - Task completed

Examples:
  $ node index.js add "Buy groceries"
  $ node index.js list todo
  $ node index.js status 1 in-progress
  $ node index.js update 1 "Buy healthy groceries"
  `);
}

// CLI HANDLING
const command = process.argv[2];
const description = process.argv[3];

// console.log(process.argv);

switch (command) {
  case "list":
    const status = process.argv[3];
    const validStatuses = ["done", "todo", "in-progress"];

    if (!status) {
      listTasks();
    } else if (validStatuses.includes(status)) {
      listTasks(status);
    } else {
      console.log(
        "Invalid status parameter! Valid values: todo, done, in-progress",
      );
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

  case "status":
    const statusId = process.argv[3];
    const taskStatus = process.argv[4].toString();
    console.log(taskStatus);
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
