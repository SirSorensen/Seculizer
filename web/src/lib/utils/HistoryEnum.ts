import type { Type } from "$lang/types/parser/interfaces";
import type { ParticipantKnowledge } from "src/types/participant";
import { getStringFromKnowledges, getStringFromType } from "./stringUtil";
const HistoryTemplates = {
  clear: (knowledge: Type) => {
    return `Cleared ${getStringFromType(knowledge)} from knowledge`;
  },
  new: (participant: string, knowledge: Type) => {
    return `${participant} created ${getStringFromType(knowledge)}`;
  },
  set: (participant: string, knowledge: Type, value: string) => {
    return `${participant} set ${getStringFromType(knowledge)} to ${value}`;
  },
  send: (sender:string, reciever:string, knowledge:ParticipantKnowledge[]) => {
    return `${sender} sent ${getStringFromKnowledges(knowledge)} to ${reciever}`;
  }
};



export default HistoryTemplates;
