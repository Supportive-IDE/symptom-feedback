import styles from "./codeOutput.module.css";
import { useState } from "react";
import CodeOutput from "./codeOutput";
import Sk from "skulpt";
import RawInput from "./rawInput";

const Repl = () => {

    const commandEntered = command => {
        // Execute the user's command
        runInteractive(command);
        // replace the prompt in the out array with the text
        // setOut(prevLines => {
        //     const lines = [...prevLines.slice(0, -1)];
        //     lines.push(`>>> ${command}`);
        //     return lines
        // });
    }

    const newPrompt = () => <RawInput key="start" prompt={">>> "} submitHandler={val => commandEntered(val)} />

    const [out, setOut] = useState([newPrompt()]);


    /**
     * Adds a line of output text to the "terminal". The text comes from Skulpt on code execution.
     * @param {string[] | Element[]} items 
     */
    const addOutput = items => {
        console.log("addOutput", items);
        setOut(prevItems => [...prevItems, ...items]);
    }

    const skulptOutput = item => {
        console.log("skulptOutput", item)
        setOut(prevItems => [...prevItems, item]);
    }

    // VERY BROKEN!
    const inputFunc = prompt => {
        const p = new Promise(function(resolve, reject) {
            const userIn = <RawInput prompt={prompt} submitHandler={val => {
                resolve(val);
                // convert raw input to text
                // setOut(prevLines => {
                //     const lines = [...prevLines.slice(0, -1)];
                //     lines.push(`${prompt}${val}`);
                //     return lines
                // });
            }} />
            // addOutput([userIn]);
        });
        return p;
    }

    const runInteractive = userIn => {
        console.log("running with", userIn);
        const rawIn = userIn;
        // Configure Skulpt to execute the code
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
            } else {
                userIn = "__result = " + userIn;	
            }
            try {
                let r = eval(Sk.compile(userIn, "repl", "exec", true).code)(Sk.globals);
                let startTime = new Date().getTime();
                while(r.$isSuspension) {
                    if(r.data.promise) {
                        r.data.promise.then(function(result) {
                            if(outputResult) {
                                addOutput([Sk.ffi.remapToJs(Sk.builtin.repr(result)), newPrompt()]);	
                            }
                        }).catch(function (error) {
                            console.log(error)
                        });
                    } else {
                        r = r.resume();
                    }
                    let now = new Date().getTime();
                    if(now - startTime > 5000) {
                        addOutput(["Stopped after 5s to prevent browser crashing"]);
                        break;
                    }
                } 
                if(r.__result && outputResult) {
                    if (r.__result.v) {
                        addOutput([Sk.ffi.remapToJs(Sk.builtin.repr(r.__result)), newPrompt()]);
                    } else {
                        addOutput([newPrompt()]);
                    }
                }
            } catch (evalError) {
                console.log("eval", evalError);
            }
            
        }
    }

    /**
     * Attempts to run the last line in the REPL environment and print any output to the terminal
     * @param {string} code The response the last prompt
     * @returns {null}
     */
    // const runInteractiveOLD = () => {
    //     // UPDATING STATE ON EACH LINE WILL REFRESH THE STATE... (previous executions will be dropped)... NEED A DIFFERENT APPROACH? 
    //     // Configure Skulpt to execute the code
    //     Sk.configure({
    //         output: addOutput,
    //         __future__: Sk.python3,
    //         inputfun: inputFunc,
    //         inputfunTakesPrompt: true
    //     });

    //     Sk.inputfun(">>> ").then(function(result) {
    //         console.log(result);
    //         let outputResult = false;
    //         if(result.length > 0) {
    //             outputResult = true;
    //             if(code.match(/\s*import/)) {
    //                 outputResult = false;
    //             } else {
    //                 code = "__result = " + code;	
    //             }
    //             let r = eval(Sk.compile(code, "repl", "exec", true).code)(Sk.globals);
    //             let startTime = new Date().getTime();
    //             while(r.$isSuspension) {
    //                 if(r.data.promise) {
    //                     r.data.promise.then(function(result) {
    //                         if(outputResult) {
    //                             addOutput(Sk.ffi.remapToJs(Sk.builtin.repr(result)));	
    //                         }
    //                     }).catch(function (error) {"ERROR", console.log(error)});
    //                 } else {
    //                     r = r.resume();
    //                 }
    //                 let now = new Date().getTime();
    //                 if(now - startTime > 5000) {
    //                     //PythonIDE.showHint("Stopped after 5s to prevent browser crashing");
    //                     break;
    //                 }
    //             } 
    //             if(r.__result && outputResult) {
    //                 console.log("b")
    //                 addOutput(Sk.ffi.remapToJs(Sk.builtin.repr(r.__result)));
    //             }
    //         }
    //     }).catch(function (error) {console.log(error)});
    // }


    return <div className={styles.output + " " + styles.repl}>
        <CodeOutput text={out} />
    </div>
}

export default Repl;