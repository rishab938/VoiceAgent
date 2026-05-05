from app.services.llm_service import get_llm_response
from app.tools.todo_tools import add_task, list_tasks, delete_task, update_task
from app.memory.memory_store import store_memory, get_memory


def run_agent(user_input: str) -> str:
    past_memory = get_memory()

    text = user_input.lower()

    # 🔹 MEMORY HANDLING
    if any(word in text for word in ["remind", "remember", "memory"]):
        store_memory(user_input)
        return "Noted!"

    prompt = f"""
You are a voice assistant for managing a To-Do list.

STRICT RULES:
- ONLY use tools for task-related commands
- ALWAYS follow TOOL format
- Keep responses SHORT (1 line)
- ALWAYS respond in English

Tool format:
TOOL:add_task:item
TOOL:list_tasks
TOOL:delete_task:id
TOOL:update_task:id:new
TOOL:complete_task:id

Examples:
- "add milk" → TOOL:add_task:milk
- "add task buy milk" → TOOL:add_task:buy milk
- "add wheat, flour" → TOOL:add_task:wheat, flour
- "mark task 1 as complete" → TOOL:complete_task:1

User: {user_input}
"""

    decision = get_llm_response(prompt).strip()

    # 🔥 AUTO-FIX WRONG OUTPUT
    if decision.startswith("add_task:"):
        decision = "TOOL:" + decision
    elif decision.startswith("list_tasks"):
        decision = "TOOL:list_tasks"
    elif decision.startswith("delete_task:"):
        decision = "TOOL:" + decision
    elif decision.startswith("update_task:"):
        decision = "TOOL:" + decision
    elif decision.startswith("complete_task:"):
        decision = "TOOL:" + decision

    # 🔹 ADD TASK
    if decision.startswith("TOOL:add_task:"):
        titles = decision.split("TOOL:add_task:")[1]
        items = [t.strip() for t in titles.split(",")]

        responses = []
        for item in items:
            if item:
                responses.append(add_task(item))

        return " | ".join(responses)

    # 🔹 LIST TASKS
    elif decision.startswith("TOOL:list_tasks"):
        tasks = list_tasks()
        if not tasks:
            return "No tasks"
        return " | ".join([t["title"] for t in tasks])

    # 🔹 DELETE TASK
    elif decision.startswith("TOOL:delete_task:"):
        try:
            task_id = int(decision.split("TOOL:delete_task:")[1])
            return delete_task(task_id)
        except:
            return "Invalid task ID"

    # 🔹 UPDATE TASK
    elif decision.startswith("TOOL:update_task:"):
        try:
            parts = decision.split("TOOL:update_task:")[1].split(":")
            task_id = int(parts[0])
            new_title = parts[1]
            return update_task(task_id, new_title)
        except:
            return "Invalid update format"

    # 🔹 COMPLETE TASK
    elif decision.startswith("TOOL:complete_task:"):
        try:
            from app.tools.todo_tools import mark_complete
            task_id = int(decision.split("TOOL:complete_task:")[1])
            return mark_complete(task_id)
        except:
            return "Invalid task ID"

    # 🔹 NORMAL RESPONSE
    else:
        return decision[:120]