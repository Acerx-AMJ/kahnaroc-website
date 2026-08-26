import json

forbidden: set[str] = set("iklqswxy")

def check_name(name: str) -> bool:
    return not any(char in forbidden for char in name.lower())

with open("dictionary/words.json") as f:
    data = json.load(f)

for i, entry in enumerate(data, start=1):
    if not check_name(entry[0]):
        print(f"Failed at line {i + 1}")
