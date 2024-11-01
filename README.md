# Task Tracker CLI

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A command line task management application built with Javascript that helps you organize and track your to-do lists.

## Features

- **Task Management**: Create, read, update and delete tasks with simple commands
- **Status Tracking**: Mark tasks as "done", "in-progress", or "todo"
- **Data Export**: Export your task data to JSON
- **User-Friendly**: Clean and intuitive command line interface with helpful error messages

## Installation

Requirements:

- Node.js v12.0.0 or higher
- npm v6.0.0 or higher

```javascript
# Clone the repository
git clone https://github.com/nstlgy/task-tracker-cli.git

# Navigate to project directory
cd task-tracker-cli

# Install dependencies
npm install
```

## Usage Guide

### View All Tasks

Lists all tasks with their IDs, descriptions, status, and date

```bash
node index.js list

# Filter tasks
node index.js list todo
node index.js list in-progress
node index.js list done
```

### Help Menu

Displays available commands and their usage.

```bash
node index.js help

Available Commands:
  list [status]           - Show all tasks or filter by status
                            (todo, done, in-progress)
  add <description>       - Add a new task
  update <id> <desc>      - Update a task description
  delete <id>             - Delete a task
  status <id> [option]    - Change task status (todo/done/in-progress)
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

```

### Add Task

Create a new task with a description

```bash
# Basic task
node index.js add "Take a shower"
```

### Update Task

Modify an existing task's description.

```bash
# Update description
node index.js update 1 "Take a shower tomorrow"
```

### Delete Task

Remove a task from the tracker.

```bash
node index.js delete 1
```

### Set Task Status

Change a task's status between Not Started, In Progress and Completed.

```bash
# Mark as done
node index.js status 1 done

# Mark as in progress
node index.js status 1 in-progress

# Reset to todo
node index.js status 1 todo
```

## Project Link

https://roadmap.sh/projects/task-tracker
