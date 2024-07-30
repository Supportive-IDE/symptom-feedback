import styles from "./codeOutput.module.css";
import { useEffect, useState, useRef } from "react";
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
    const waitForInput = useRef(false);

    const isTrigger = commandChar => commandChar === ":" || commandChar === "/";

    const updateMode = command => {
        const currentMode = modeRef.current[0];
        const enterSecondary = command.length > 0 && isTrigger(command[command.length - 1]);
        if (currentMode === MODE.PRIMARY) {
            if (enterSecondary) {
                console.log("Adding secondary to current mode stack:", modeRef.current);
                modeRef.current.unshift(MODE.SECONDARY);
            }
        } else if (currentMode === MODE.SECONDARY) {
            if (command.length === 0) {
                console.log("Pop secondary mode");
                modeRef.current.shift();
            }
        }
    }

    const newPrompt = prompt => <RawInput key="start" prompt={prompt} submitHandler={val => commandEntered(val)} />

    const commandEntered = command => {
        updateMode(command);
        const currentMode = modeRef.current[0];
        console.log("current mode", currentMode)
        // Add the command to the commandRef
        if (command.length > 0) {
            if (currentMode === MODE.SECONDARY) {
                commandRef.current = `${commandRef.current.length > 0? commandRef.current + "\n" : ""}${command}`
            } else {
                commandRef.current = command;
            }
        }
        if (currentMode === MODE.PRIMARY) {
            console.log("Running:")
            console.log(commandRef.current);
            runInteractive(commandRef.current);
        } else {
            addOutput([newPrompt(PROMPT.SECONDARY)]);
        }
        
    }

    // Need a notion of mode - primary, secondary (after : or \)...need to track with a stack to handle nesting... back out of secondary by pressing enter twice
    const [out, setOut] = useState([newPrompt(PROMPT.PRIMARY)]);
    


    /**
     * Adds a line of output text to the "terminal". The text comes from Skulpt on code execution.
     * @param {string[] | Element[]} items 
     */
    const addOutput = items => {
        setOut(prevItems => [...prevItems, ...items]);
    }

    const skulptOutput = item => {
        // Phantom output caused by multiline statement execution
        console.log("Skulpt:", item)
        setOut(prevItems => [...prevItems, item]);
    }

    const inputFunc = prompt => {
        // console.log("input", prompt);
        waitForInput.current = true;
        const p = new Promise(function(resolve, reject) {
            // Need to let existing input resolve first
            const userIn = <RawInput prompt={prompt} submitHandler={val => {
                // console.log("resolving input", prompt)
                waitForInput.current = false;
                resolve(val);
            }} />
            // console.log("adding input");
            addOutput([userIn]);
        });
        return p;
    }

    
    /**
     * Attempts to run the last line in the REPL environment and print any output to the terminal
     * @param {string} userIn The response to the last prompt
     */
    const runInteractive = (userIn) => {
        // console.log("running with", userIn);
        const rawIn = userIn;
        const isSingleCommand = userIn.split("\n").length === 1;
        Sk.configure({
            output: skulptOutput,
            __future__: Sk.python3,
            inputfun: inputFunc,
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
            try {
                let r = eval(Sk.compile(userIn, "repl", "exec", true).code)(Sk.globals);
                console.log(Sk.globals)
                if(r.$isSuspension) {
                    if(r.data.promise) {
                        r.data.promise.then(function(result) {
                            if(outputResult) {
                                console.log("Suspension complete", rawIn, result);
                                const replaceInput = userIn.replace(/\s*input\(.*\)/, `"${result}"`);
                                commandRef.current = replaceInput;
                                console.log("After input run", commandRef.current)
                                runInteractive(replaceInput);
                            }
                        }).catch(function (error) {
                            console.log("Suspension error", rawIn);
                            console.log(error)
                        });
                    } else {
                        r = r.resume();
                    }
                } 
                if(r.__result && outputResult) {
                    commandRef.current = "";
                    if (r.__result.v !== null && isSingleCommand) {
                        console.log("Run complete", rawIn, r);
                        addOutput([Sk.ffi.remapToJs(Sk.builtin.repr(r.__result)), newPrompt(PROMPT.PRIMARY)]);
                    } else {
                        console.log("Run complete 2", rawIn);
                        addOutput([newPrompt(PROMPT.PRIMARY)]);
                    }
                } else if (!waitForInput.current) {
                    commandRef.current = "";
                    addOutput([newPrompt(PROMPT.PRIMARY)]);
                }
            } catch (evalError) {
                commandRef.current = "";
                const msgs = evalError.args.v.map(obj => "Error: " + obj.v);
                console.log("eval", rawIn, evalError);
                addOutput([...msgs, newPrompt(PROMPT.PRIMARY)]);
            }
        }
    }



    return <div className={styles.output + " " + styles.repl}>
        <CodeOutput text={out} />
    </div>
}

export default Repl;