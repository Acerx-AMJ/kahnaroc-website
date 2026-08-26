import json
from collections import Counter

with open('dictionary/words.json', 'r', encoding='utf-8') as f:
   data = json.load(f)

words: list[str] = [entry[0] for entry in data]

letter_freq = Counter()
bigram_freq = Counter()
trigram_freq = Counter()

for word in words:
   word = word.lower().strip()
   letter_freq.update(word)
   bigram_freq.update([word[i:i+2] for i in range(len(word) - 1)])
   trigram_freq.update([word[i:i+3] for i in range(len(word) - 2)])

print("Letter Frequency:")
for k, v in letter_freq.most_common():
   print(f"{k}: {v}")

print("\nBigram Frequency:")
for k, v in bigram_freq.most_common():
   if v >= 100:
      print(f"{k}: {v}")

print("\nTrigram Frequency:")
for k, v in trigram_freq.most_common():
   if v >= 55:
      print(f"{k}: {v}")