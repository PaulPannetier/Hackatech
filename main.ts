import { generateEvent, Args } from "@massalabs/massa-as-sdk";
import {get, set, has} from "@massalabs/massa-as-sdk/assembly/std/storage"

export function setColor(string_args : string): string {
    const args = new Args(string_args);
    const x = args.nextI32();
    const y = args.nextI32();
    const key = `${x}` + "-" + `${y}`;

    if (has(key)) {
        generateEvent("Already set");
        return "Already set";
    }else{
        const r = args.nextI32();
        const g = args.nextI32();
        const b = args.nextI32();
        set(`${x}` + "-" + `${y}`, `${r}` + "," + `${g}` + "," + `${b}`);
        generateEvent("Set to " + `${r}` + "," + `${g}` + "," + `${b}`);
        return "Set to " + `${r}` + "," + `${g}` + "," + `${b}`;
    }
}

export function getColor(string_args : string): string {
    const args = new Args(string_args);
    const x = args.nextI32();
    const y = args.nextI32();
    const key = `${x}` + "-" + `${y}`;

    if (has(key)) {
        const color = get(`${x}` + "-" + `${y}`);
        generateEvent("rgb(" + color + ")");

        return "rgb(" + color + ")";
    }else{
        generateEvent("Not set");
        return "Not set";
    }
    
}
