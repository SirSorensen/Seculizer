import { EOL } from "os";

export default (template: string, end: number, start: number = 0): number => {
  return (EOL + template).substring(start, end + EOL.length).split(/\r\n|\r|\n/)
    .length; // We are adding an EOF line at the beginning such that "html" and "html\n" both don't return 1
};
