import { generateEvent } from "@massalabs/massa-as-sdk";

export function main(_args: string): void {
   generateEvent("Hello world!");
}