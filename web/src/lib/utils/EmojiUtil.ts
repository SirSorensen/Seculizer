export function getEmoji(input: string): { type: "class" | "background"; value: string }{
  if (containsLatinCodepoints(input)) {
    return { type: "class", value: input };
  } else {
    let hexArray: string[] = [];
    for (const codePoint of input) {
      let hex = codePoint.codePointAt(0);
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
  return /[\u0000-\u00ff]/.test(s);
}
