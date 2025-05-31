// Función auxiliar para reducir un número a un dígito o número maestro (11, 22, 33)
function reduceNumber(num) {
  const masterNumbers = [11, 22, 33];
  if (masterNumbers.includes(num)) return num;

  while (num > 9) {
    num = num
      .toString()
      .split("")
      .reduce((acc, val) => acc + Number(val), 0);
    if (masterNumbers.includes(num)) return num;
  }

  return num;
}

// Mapa de letras a valores numerológicos (A=1, B=2,... I=9, luego ciclo)
const letterValues = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
  J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
  S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8
};

// Calcula el número de expresión desde el nombre completo
export function calculateExpressionNumber(fullName) {
  if (!fullName) return null;

  const letters = fullName
    .toUpperCase()
    .replace(/[^A-Z]/g, "")
    .split("");

  const sum = letters.reduce((acc, letter) => acc + (letterValues[letter] || 0), 0);
  return reduceNumber(sum);
}
