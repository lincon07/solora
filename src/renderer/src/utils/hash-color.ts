export function hashColor(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  }

  const colors = [
    "#3b82f6",
    "#22c55e",
    "#a855f7",
    "#f97316",
    "#ef4444",
    "#06b6d4",
  ];

  return colors[h % colors.length];
}
