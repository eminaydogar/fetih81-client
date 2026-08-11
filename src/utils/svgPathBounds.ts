export interface PathBounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

// Sadece kart arka planlarını o ilin şekline kırpmak için kullanılan yaklaşık
// bir sınır kutusu hesaplayıcı — eğri kontrol noktalarını da sınıra dahil eder,
// bu yüzden gerçek çizimden biraz daha geniş olabilir (kırpma için sorun değil).
const PARAM_COUNTS: Record<string, number> = {
  M: 2,
  L: 2,
  T: 2,
  H: 1,
  V: 1,
  C: 6,
  S: 4,
  Q: 4,
  A: 7,
  Z: 0,
};

export function getPathBounds(d: string): PathBounds {
  const tokens = d.match(/[a-zA-Z]|-?\d*\.?\d+(?:e-?\d+)?/g) ?? [];
  let i = 0;
  let cx = 0;
  let cy = 0;
  let cmd = '';
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  function visit(x: number, y: number) {
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  }

  while (i < tokens.length) {
    if (/[a-zA-Z]/.test(tokens[i])) {
      cmd = tokens[i];
      i++;
    }
    const upper = cmd.toUpperCase();
    const relative = cmd !== upper;

    if (upper === 'Z') {
      continue;
    }

    if (upper === 'H') {
      const v = parseFloat(tokens[i]);
      i++;
      cx = relative ? cx + v : v;
      visit(cx, cy);
      continue;
    }

    if (upper === 'V') {
      const v = parseFloat(tokens[i]);
      i++;
      cy = relative ? cy + v : v;
      visit(cx, cy);
      continue;
    }

    const count = PARAM_COUNTS[upper] ?? 2;
    const params: number[] = [];
    for (let p = 0; p < count; p++) {
      params.push(parseFloat(tokens[i]));
      i++;
    }
    for (let p = 0; p + 1 < params.length; p += 2) {
      const px = relative ? cx + params[p] : params[p];
      const py = relative ? cy + params[p + 1] : params[p + 1];
      visit(px, py);
    }
    cx = relative ? cx + params[params.length - 2] : params[params.length - 2];
    cy = relative ? cy + params[params.length - 1] : params[params.length - 1];
  }

  if (!isFinite(minX)) {
    return { minX: 0, minY: 0, maxX: 0, maxY: 0 };
  }

  return { minX, minY, maxX, maxY };
}
