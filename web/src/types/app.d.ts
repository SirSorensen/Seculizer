import type { Frame } from "$lib/models/Frame";
interface Navigation {
  prev: Frame | null;
  next: Frame | null; //Null is either end of program or a choice
}
type NextFrameNavigation = (frame: Frame | string) => void;
