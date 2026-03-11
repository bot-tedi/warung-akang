export function fuzzyMatch(str, query) {
  if (!query) return true;
  if (!str) return false;
  
  const s = str.toLowerCase();
  const q = query.toLowerCase();
  
  // Direct substring match is faster and prioritized
  if (s.includes(q)) return true;

  // Fuzzy match: checks if all characters in query appear in string in the same order
  let i = 0;
  let j = 0;
  
  while (i < s.length && j < q.length) {
    if (s[i] === q[j]) {
      j++;
    }
    i++;
  }
  
  return j === q.length;
}
