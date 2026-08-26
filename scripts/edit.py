import json

def fix_entry(word: str) -> str:
    return word.replace('aa', 'a')

def fix_invalid_entries() -> None:
    with open('dictionary/words.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    fixed_data = []
    for entry in data:
        if isinstance(entry, list) and len(entry) == 3:
            word, desc, tags = entry
            fixed_word = fix_entry(word)
            fixed_data.append([fixed_word, desc, tags])

    with open('dictionary/words.json', 'w', encoding='utf-8') as f:
        f.write('[\n')
        for i, entry in enumerate(fixed_data):
            line = json.dumps(entry, ensure_ascii=False)
            if i < len(fixed_data) - 1:
                f.write(f'   {line},\n')
            else:
                f.write(f'   {line}\n')
        f.write(']\n')

if __name__ == "__main__":
    fix_invalid_entries()
