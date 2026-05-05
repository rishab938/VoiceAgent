tasks = []

def add_task(title):
    task = {
        "id": len(tasks) + 1,
        "title": title,
        "completed": False
    }
    tasks.append(task)
    return f"Task {task['id']} added: {title}"


def list_tasks():
    return tasks


def delete_task(task_id):
    global tasks
    tasks = [t for t in tasks if t["id"] != task_id]
    return f"Task {task_id} deleted"


def update_task(task_id, new_title):
    for t in tasks:
        if t["id"] == task_id:
            t["title"] = new_title
            return f"Task {task_id} updated"
    return "Task not found"


def mark_complete(task_id):
    for t in tasks:
        if t["id"] == task_id:
            t["completed"] = True
            return f"Task {task_id} marked complete"
    return "Task not found"


def get_all_tasks():
    return tasks