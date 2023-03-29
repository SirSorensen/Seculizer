import type { Type } from "$lang/types/parser/interfaces";
import type { Program } from "$lib/models/program";
import type { ParticipantKnowledge } from "src/types/participant";
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
export function getStringFromKnowledges(knowledges:ParticipantKnowledge[]){
  let result = "";
  for (const knowledge of knowledges) {
    if(knowledge.type === "rawKnowledge"){
      result += getStringFromType(knowledge.knowledge) + ", ";
    }else{
      result += getStringFromKnowledges(knowledge.knowledge) + " encrypted with " + getStringFromType(knowledge.encryption) + ", ";
    }
  }
  if(result.endsWith(", ")) result = result.slice(0, -2);
  return result;
}