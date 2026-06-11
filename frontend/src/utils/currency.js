export function formatLKR(amount) {
  const num = Number(amount) || 0;
  try {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      currencyDisplay: 'narrowSymbol',
      maximumFractionDigits: 2
    }).format(num);
  } catch (e) {
    return `Rs ${num.toFixed(2)}`;
  }
}
