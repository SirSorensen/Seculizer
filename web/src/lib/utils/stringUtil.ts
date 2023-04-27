import type { EncryptExpression, Expression, SignExpression, Type } from "$lang/types/parser/interfaces";
import type { Program } from "$lib/models/program";
import katex from "katex";

export function getStringFromType(type: Type): string {
  if (!type) return "null";
  switch (type.type) {
    case "string": {
      return type.value;
      break;
    }
    case "number": {
      return type.value.toString();
      break;
    }
    case "id": {
      return type.value;
      break;
    }
    case "function": {
      const { id, params } = type;
      return id + "(" + params.map(getStringFromType).join(", ") + ")";
      break;
    }
    default:
      return "null";
      break;
  }
}
export function getIconFromType(type: Type, program: Program): string {
  if (!type) return "null";
  switch (type.type) {
    case "string":
      return "📝";
      break;
    case "number":
      return "input-numbers";
      break;
    case "id":
      return program.getIcon(type.value);
      break;
    case "function": {
      const icon = program.getIcon(type.id);
      if(icon === "red-question-mark") return "gear";
      return icon;
      break;
    }
    default:
      return "red-question-mark";
      break;
  }
}

export function getSimpleStringFromExpression(expression: Expression): string {
  const result: string[] = [];
  if (expression.child.type == "encryptExpression") {
    const encryptedExpression = expression.child as EncryptExpression;
    result.push(`encrypt(${getStringFromType(encryptedExpression.outer)},`);
    if (encryptedExpression.inner.length > 2) result.push("[");
    for (let i = 0; i < encryptedExpression.inner.length; i++) {
      const innerExpression = encryptedExpression.inner[i];
      const s = getSimpleStringFromExpression(innerExpression);
      if (i === encryptedExpression.inner.length - 1) {
        result.push(s);
      } else {
        result.push(s);
        result.push(", ");
      }
    }

    if (encryptedExpression.inner.length > 2) result.push("]");
    return result.join("") + ")";
  } else if (expression.child.type == "signExpression") {
    const signExpression = expression.child as SignExpression;
    result.push(`sign(${getStringFromType(signExpression.outer)},`);
    if (signExpression.inner.length > 2) result.push("[");
    for (let i = 0; i < signExpression.inner.length; i++) {
      const innerExpression = signExpression.inner[i];
      const s = getSimpleStringFromExpression(innerExpression);
      if (i === signExpression.inner.length - 1) {
        result.push(s);
      } else {
        result.push(s);
        result.push(", ");
      }
    }
    if (signExpression.inner.length > 2) result.push("]");
    return result.join("") + ")";
  } else {
    const type = expression.child as Type;
    return getStringFromType(type);
  }
}

export function getStringFromExpression(expression: Expression, program: Program): string {
  const result: string[] = [];
  if (expression.child.type == "encryptExpression") {
    const encryptedExpression = expression.child as EncryptExpression;
    for (let i = 0; i < encryptedExpression.inner.length; i++) {
      const innerExpression = encryptedExpression.inner[i];
      const s = getStringFromExpression(innerExpression, program);
      if (i === encryptedExpression.inner.length - 1) {
        result.push(s);
      } else {
        result.push(s);
        if (i === encryptedExpression.inner.length - 2) result.push(" and ");
        else result.push(", ");
      }
    }

    return result.join("") + " encrypted with " + getFormattedTypeAsHTML(encryptedExpression.outer, program);
  } else if (expression.child.type == "signExpression") {
    const signExpression = expression.child as SignExpression;
    for (let i = 0; i < signExpression.inner.length; i++) {
      const innerExpression = signExpression.inner[i];
      const s = getStringFromExpression(innerExpression, program);
      if (i === signExpression.inner.length - 1) {
        result.push(s);
      } else {
        result.push(s);
        if (i === signExpression.inner.length - 2) result.push(" and ");
        else result.push(", ");
      }
    }
    return result.join("") + " signed with " + getFormattedTypeAsHTML(signExpression.outer, program);
  } else {
    const type = expression.child as Type;
    return getFormattedTypeAsHTML(type, program);
  }
}

export function getFormattedTypeAsHTML(type: Type, program: Program): string {
  if (program.getFormats().contains(type)) {
    let s = program.getFormats().getConstructedLatex(type);
    if (s.startsWith("$")) s = s.slice(1);
    if (s.endsWith("$")) s = s.slice(0, -1);
    return katex.renderToString(s, {
      throwOnError: false,
      displayMode: false,
    });
  } else {
    return getStringFromType(type);
  }
}
