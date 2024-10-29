# Task Tracker CLI

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A command line application for managing and organizing your tasks and to-do lists written in Javascript.

## Features

- Create, read, update and delete tasks
- Mark tasks as complete/incomplete
- Categorize tasks with tags and priorities
- View tasks filtered by status, priority, and due dates
- Export task data to common formats
- Simple and intuitive command line interface

## Installation

```javascript
git clone https://github.com/nstlgy/task-tracker-cli.git
cd task-tracker-cli
npm install
```

## Usage

### List all tasks

```bash
node index.js list
```

### Help Menu

```bash
node index.js help

Available Commands:
  list              - Show all tasks
  add <description> - Add a new task
  update <id> <description> - Update a task
  delete <id>       - Delete a task
  toggle <id>       - Toggle task status (Not Started → In Progress → Completed)
  help              - Show this help message

```

### Add Task

```bash
node index.js add "Take a shower"
```

### Update Task

```bash
node index.js update 1 "Take a shower tomorrow"
```

### Delete Task

```bash
node index.js delete 1
```

### Toggle Task Status

```bash
node index.js status 1 done // Mark task as done

node index.js status 1 in-progress //Mark task in-progress
```

# Project Link : https://roadmap.sh/projects/task-tracker
