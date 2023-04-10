import type { Expression, Type } from "$lang/types/parser/interfaces";
import type { Program } from "$lib/models/program";
import { getFormattedTypeAsHTML, getStringFromExpression, getStringFromType } from "./stringUtil";
import { program } from "../stores/programStore";
import { getEmoji } from "./EmojiUtil";

const HistoryTemplates = {
  clear: (knowledge: Type, program: Program) => {
    return `Cleared ${getFormattedTypeAsHTML(knowledge, program)} from knowledge`;
  },
  new: (participant: string, knowledge: Type, program: Program) => {
    return `${formatId(participant,program)} created ${getFormattedTypeAsHTML(knowledge, program)}`;
  },
  set: (participant: string, knowledge: Type, value: Type, program: Program) => {
    return `${formatId(participant,program)} set ${getFormattedTypeAsHTML(knowledge, program)} to ${getFormattedTypeAsHTML(value, program)}`;
  },
  send: (sender: string, reciever: string, expression: Expression, program: Program) => {
    return `${formatId(sender, program)} sent ${getStringFromExpression(expression, program)} to ${formatId(reciever, program)}`;
  },
  matchCase: (identifier: string) => {
    return `Matched ${identifier}`;
  },
};

function formatId(id: string, program: Program):string {
  const icon = program.getIcons().get(id);
  if (icon) {
    let omaEmoji = getEmoji(icon);
    let s = "";
    if(omaEmoji.type === "class"){
      s += `<i class="oma oma-${omaEmoji.value}"></i>`;
    }else if (omaEmoji.type === "background"){
      s += `<i class="oma" style="background-image: url(${omaEmoji.value})" ></i>`;
    }
    return s + " " + id;
  }
  return id;
}

export default HistoryTemplates;
