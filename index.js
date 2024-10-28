// Dependencies
const fs = require("fs").promises;
const path = require("path");
const {
  intro,
  outro,
  text,
  select,
  spinner,
  multiselect,
} = require("@clack/prompts");

// Constants
const TASKS_FILE = path.join(__dirname, "tasks.json");

// Load all the tasks
async function loadTasks() {
  try {
    const data = await fs.readFile(TASKS_FILE, "utf8");
    return JSON.parse(data || "[]");
  } catch (err) {
    if (err.code === "ENOENT") {
      await fs.writeFile(TASKS_FILE, JSON.stringify([]));
      return [];
    } else {
      console.error("Error loading tasks:", err);
      throw err;
    }
  }
}

// default prompt with options
async function defaultPrompt() {
  const userSelection = await select({
    message: "What would you like to do?",
    options: [
      { value: "list_all", label: "List all tasks", hint: "Show every task" },
      {
        value: "list_done",
        label: "List completed tasks",
        hint: "Show finished tasks",
      },
      {
        value: "list_not_done",
        label: "List incomplete tasks",
        hint: "Show unfinished tasks",
      },
      {
        value: "list_progress",
        label: "List in-progress tasks",
        hint: "Show active tasks",
      },
      { value: "add", label: "Add new task", hint: "Create task" },
      {
        value: "update",
        label: "Update task status",
        hint: "Mark as in progress/done",
      },
      { value: "delete", label: "Delete task", hint: "Remove task" },
    ],
    required: true,
  });
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

// save tasks
async function saveTasks(tasks) {
  await fs.writeFile(TASKS_FILE, JSON.stringify(tasks, null, 2));
}

async function addTask(description) {
  const tasks = await loadTasks();

  if (tasks.length === 0) {
    console.log("No tasks found!");
    return;
  }

  tasks.push({
    id: tasks.length + 1,
    description,
    completed: false,
    inProgress: false,
  });

  saveTasks(tasks);
  console.log("Task Added: ", description);
}

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
      console.log("please provide a task description");
    }
    break;

  case "delete":
    break;

  default:
    defaultPrompt();
}

// Error Handling
process.on("uncaughtException", (err) => {
  console.error(`There was an uncaught error: ${err}`);
  process.exit(1);
});
