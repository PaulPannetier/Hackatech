import { Address, Args, call, generateEvent, transferCoinsOf } from "@massalabs/massa-as-sdk";
import { callee, caller } from "@massalabs/massa-as-sdk/assembly/std/context";
export function foo(_args: string): string {
    generateEvent("foo called");
    const address = caller()
    transferCoinsOf(address, callee(), 1_000_000_000);

    const args = new Args().add(1 as i32).add(1 as i32).add(0 as i32).add(0 as i32).add(0 as i32);
    const args2 = new Args().add(1 as i32).add(1 as i32).add(255 as i32).add(255 as i32).add(255 as i32);
    call(address, "setColor", args,0);
    call(address, "setColor", args2,0);

    call(address, "getColor", new Args().add(1 as i32).add(1 as i32),0);
    call(address, "getColor", new Args().add(1 as i32).add(1 as i32),0);
    return "0";



    
}
