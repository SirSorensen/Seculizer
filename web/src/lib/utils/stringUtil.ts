import type { Type } from "$lang/types/parser/interfaces"
export function getStringFromType(type: Type): string {
  if (!type) return "null"
  switch (type.type) {
    case "string":
      return type.value
      break
    case "number":
      return type.value.toString()
      break
    case "id":
      return type.value
      break
    case "function":
      const { id, params } = type
      return id + "(" + params.map(getStringFromType).join(", ") + ")"
      break
    default:
      return "null"
      break
  }
}
