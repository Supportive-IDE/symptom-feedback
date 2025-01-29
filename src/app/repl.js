import styles from "./codeOutput.module.css";
import { useState, useRef } from "react";
import CodeOutput from "./codeOutput";
import Sk from "skulpt";
import RawInput from "./rawInput";

const MODE = {
    PRIMARY: 0,
    SECONDARY: 1
}

const PROMPT = {
    PRIMARY: ">>> ", 
    SECONDARY: "... "
};

const Repl = () => {


    const modeRef = useRef([MODE.PRIMARY]);
    const commandRef = useRef("");

    const isTrigger = commandChar => commandChar === ":" || commandChar === "/";

    /**
     * Checks if the repl mode should be primary or secondary and updates as needed
     * @param {string} command last line entered by user
     */
    const updateMode = command => {
        const currentMode = modeRef.current[0];
        const enterSecondary = command.length > 0 && isTrigger(command[command.length - 1]);
        if (currentMode === MODE.PRIMARY) {
            if (enterSecondary) {
                modeRef.current.unshift(MODE.SECONDARY);
            }
        } else if (currentMode === MODE.SECONDARY) {
            if (command.length === 0) {
                modeRef.current.shift();
            }
        }
    }

    const newPrompt = () => <RawInput key="start" prompt={modeRef.current[0] === MODE.PRIMARY ? PROMPT.PRIMARY : PROMPT.SECONDARY} submitHandler={val => commandEntered(val)} />

    /**
     * Event handler called when RawInput receives an Enter key.
     * @param {string} command 
     */
    const commandEntered = command => {
        updateMode(command);
        const currentMode = modeRef.current[0];
        // Add the command to the commandRef
        if (command.length > 0) {
            if (currentMode === MODE.SECONDARY) {
                commandRef.current = `${commandRef.current.length > 0? commandRef.current + "\n" : ""}${command}`
            } else {
                commandRef.current = command;
            }
        }
        if (currentMode === MODE.PRIMARY) {
            runInteractive(commandRef.current);
        } else {
            addOutput([newPrompt(PROMPT.SECONDARY)]);
        }
        
    }

    const [out, setOut] = useState([newPrompt(PROMPT.PRIMARY)]);
    


    /**
     * Adds a line of output text to the "terminal". The text comes from Skulpt on code execution.
     * @param {string[] | Element[]} items 
     */
    const addOutput = items => {
        setOut(prevItems => [...prevItems, ...items]);
    }

    const skulptOutput = item => {
        setOut(prevItems => [...prevItems, item]);
    }

    // const inputFunc = prompt => {
    //     const p = new Promise(function(resolve, reject) {
    //         waiting.current = true;
    //         const userIn = <RawInput key={Date.now()} prompt={prompt} submitHandler={val => {
    //             waiting.current = false;
    //             // addOutput(newPrompt());
    //             return resolve(val);
    //         }} />
    //         addOutput([userIn]);
    //     });
    //     return p.then(() => {
    //         addOutput([newPrompt()])
    //     });
    // }

    
    /**
     * Attempts to run the last line in the REPL environment and print any output to the terminal
     * @param {string} userIn The response to the last prompt
     */
    const runInteractive = (userIn) => {
        const isSingleCommand = userIn.split("\n").length === 1;
        Sk.configure({
            output: skulptOutput,
            __future__: Sk.python3,
            inputfunTakesPrompt: true
        });
        let $compiledmod; // Seems to fix the weird $compiledmod is not defined error
        if(userIn.length > 0) {
            let outputResult = true;
            if(userIn.match(/\s*import/)) {
                outputResult = false;
            } else if (isSingleCommand) {
                userIn = "__result = " + userIn;
            }
            const optMessages = [];
            try {
                let r = eval(Sk.compile(userIn, "repl", "exec", true).code)(Sk.globals);
                if(r.__result && outputResult) {
                    if (r.__result.v !== null && isSingleCommand) {
                        optMessages.push(Sk.ffi.remapToJs(Sk.builtin.repr(r.__result)));
                    } 
                } 
            } catch (evalError) {
                optMessages.push(evalError.toString());
            }
            commandRef.current = "";
            optMessages.push(newPrompt());
            addOutput(optMessages);
        }
    }



    return <div className={styles.repl}>
        <CodeOutput text={out} prefix="" />
    </div>
}

export default Repl;