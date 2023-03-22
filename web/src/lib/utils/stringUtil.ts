import type { Type } from "$lang/types/parser/interfaces";
import type { Program } from "$lib/models/program";
export function getStringFromType(type: Type): string {
  if (!type) return "null";
  switch (type.type) {
    case "string":
      return type.value;
      break;
    case "number":
      return type.value.toString();
      break;
    case "id":
      return type.value;
      break;
    case "function":
      const { id, params } = type;
      return id + "(" + params.map(getStringFromType).join(", ") + ")";
      break;
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
    case "function":
      return "gear";
      break;
    default:
      return "red-question-mark";
      break;
  }
}
