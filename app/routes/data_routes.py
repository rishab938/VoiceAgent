from fastapi import APIRouter
from app.tools.todo_tools import get_all_tasks
from app.memory.memory_store import get_memory

router = APIRouter()

@router.get("/data")
def get_data():
    return {
        "tasks": get_all_tasks(),
        "memory": get_memory()
    }