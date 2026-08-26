import json

def check_entry(word: str, description: str, tags: str) -> bool:
   split: list[str] = tags.split(',')

   for sp in split:
      if not sp[0].isupper:
         return False
   return True

def find_invalid_entries() -> list[int]:
   with open('dictionary/words.json', 'r', encoding='utf-8') as f:
      data = json.load(f)

   invalid_lines: list[int] = []
   for idx, entry in enumerate(data, start=1):
      if not isinstance(entry, list) or len(entry) != 3:
         invalid_lines.append(idx + 1)
         continue

      word, description, tags = entry
      if not check_entry(word, description, tags):
         invalid_lines.append(idx + 1)

   return invalid_lines

if __name__ == "__main__":
   print("Invalid entries at lines:", find_invalid_entries())