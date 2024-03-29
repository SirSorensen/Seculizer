export function getEmoji(input: string): { type: "class" | "background"; value: string } {
  if (containsLatinCodepoints(input)) {
    return { type: "class", value: input };
  } else {
    const hexArray: string[] = [];
    for (const codePoint of input) {
      const hex = codePoint.codePointAt(0);
      if (hex === undefined) continue;
      hexArray.push(hex.toString(16).toUpperCase());
    }

    return {
      type: "background",
      value: `https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji@14.0.0/color/svg/${hexArray.join("-")}.svg`,
    };
  }
}

function containsLatinCodepoints(s: string): boolean {
  // eslint-disable-next-line no-control-regex
  return /[\u0000-\u00ff]/.test(s);
}
