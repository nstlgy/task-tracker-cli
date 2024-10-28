// Dependencies
const fs = require("fs").promises;
const path = require("path");
const readline = require("readline");

// Constants
const filePath = path.join(__dirname, "tasks.json");

// Load all the tasks
async function loadTasks() {
  try {
    const data = await fs.readFile(filePath, "utf8");
    return JSON.parse(data || "[]");
  } catch (err) {
    if (err.code === "ENOENT") {
      await fs.writeFile(filePath, JSON.stringify([]));
      return [];
    } else {
      console.error("Error loading tasks:", err);
      throw err;
    }
  }
}

// list all tasks
async function listTasks() {
  try {
    const tasks = await loadTasks();
    console.log(tasks);
  } catch (err) {
    console.log(err);
  }
}

async function addTask(description) {
  const tasks = await loadTasks();
  tasks.push({
    id: tasks.length + 1,
    description,
    completed: false,
    inProgress: false,
  });

  await fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
  console.log("Task Added: ", description);
}

const command = process.argv[3];
const description = process.argv[4];

switch (command) {
  case "list":
    listTasks();
    break;

  case "add":
    if (description) {
      addTask(description);
    } else {
      console.log("please provide a task description");
    }
    break;
}

// Error Handling
process.on("uncaughtException", (err) => {
  console.error(`There was an uncaught error: ${err}`);
  process.exit(1);
});
