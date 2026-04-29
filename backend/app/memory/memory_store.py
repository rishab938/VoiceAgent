# memory_store.py

memory = []

def store_memory(user_input):
    text = user_input.lower()

    for word in ["remind me", "remember", "add memory", "memory"]:
        text = text.replace(word, "")

    text = text.strip()

    if text and text not in memory:
        memory.append(text)


def get_memory():
    return memory