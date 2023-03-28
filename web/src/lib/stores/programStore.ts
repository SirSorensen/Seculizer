import type { Program } from "$lib/models/program";
import { writable } from "svelte/store";

export const program = writable<Program>(undefined);