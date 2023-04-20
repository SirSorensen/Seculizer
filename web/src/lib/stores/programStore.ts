import type { Frame } from "$lib/models/Frame";
import type { Program } from "$lib/models/program";
import { writable } from "svelte/store";

export const program = writable<Program>(undefined);
export const currentFrame = writable<Frame>(undefined);
