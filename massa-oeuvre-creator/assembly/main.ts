import { generateEvent, Args, transferCoinsOf, createSC, fileToBase64, call } from "@massalabs/massa-as-sdk";
import {get, set, has} from "@massalabs/massa-as-sdk/assembly/std/storage"

export function setColor(args : string): string {
    const args_tab = args.split(",");
    const args_tab32 = new Array<i32>(5);
    for(let i = 0; i < 5; i++){
        args_tab32[i] = parseInt(args_tab[i]) as i32;
    }
    let my_arg = new Args().add(args_tab32[0] as i32).add(args_tab32[1] as i32).add(args_tab32[2] as i32).add(args_tab32[3] as i32).add(args_tab32[4] as i32);
    return (setColorArgs(my_arg.serialize()));
}

export function getColor(args : string): string {
    const args_tab = args.split(",");
    const args_tab32 = new Array<i32>(2);
    for(let i = 0; i < 2; i++){
        args_tab32[i] = parseInt(args_tab[i]) as i32;
    }
    let my_arg = new Args().add(args_tab32[0] as i32).add(args_tab32[1] as i32);
    return (getColorArgs(my_arg.serialize()));
}


export function setColorArgs(string_args : string): string {
    generateEvent("setColor called");
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

export function getColorArgs(string_args : string): string {
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
