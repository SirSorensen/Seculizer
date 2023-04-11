export function calcPositions(amount: number, box: HTMLElement) {
  const boxRect = box.getBoundingClientRect();

  const pos1 = [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ];
  const pos2 = [
    [0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ];
  const pos3 = [
    [1, 0, 0, 0, 1],
    [0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ];
  const pos4 = [
    [0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0],
    [1, 0, 0, 0, 1],
    [0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0],
  ];
  const pos5 = [
    [1, 0, 0, 0, 1],
    [0, 0, 0, 0, 0],
    [1, 0, 0, 0, 1],
    [0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0],
  ];
  const pos6 = [
    [0, 1, 0, 1, 0],
    [0, 0, 0, 0, 0],
    [1, 0, 0, 0, 1],
    [0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0],
  ];
  const pos7 = [
    [1, 0, 1, 0, 1],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [1, 0, 0, 0, 1],
    [0, 1, 0, 1, 0],
  ];
  const pos8 = [
    [0, 1, 0, 1, 0],
    [1, 0, 0, 0, 1],
    [0, 0, 0, 0, 0],
    [1, 0, 0, 0, 1],
    [0, 1, 0, 1, 0],
  ];

  const options = [pos1, pos2, pos3, pos4, pos5, pos6, pos7, pos8];
  const pos = options[amount - 1];
  const flat: {
    x: number;
    y: number;
  }[] = pos
    .flatMap((row, y) => {
      const xWidth = boxRect.width / row.length;
      return row.map((col, x) => {
        const yWidth = boxRect.height / pos.length;
        return col ? { x: x * xWidth + xWidth / 2, y: y * yWidth + yWidth / 2 } : null;
      });
    })
    .filter((point): point is { x: number; y: number } => point !== null);
  return flat;
}
