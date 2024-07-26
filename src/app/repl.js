import styles from "./codeOutput.module.css";
import { useState } from "react";
import Sk from "skulpt";
import RawInput from "./rawInput";

const Repl = () => {
    const [out, setOut] = useState([]);

    /**
     * Adds a line of output text to the "terminal". The text comes from Skulpt on code execution.
     * @param {string} text 
     */
    const addOutput = text => {
        setOut(prevItems => [...prevItems, text]);
    }

    /**
     * Attempts to run the last line in the REPL environment and print any output to the terminal
     * @param {string} code The response the last prompt
     * @returns {null}
     */
    const runInteractive = (code) => {
        // UPDATING STATE ON EACH LINE WILL REFRESH THE STATE... (previous executions will be dropped)... NEED A DIFFERENT APPROACH
        // Configure Skulpt to execute the code
        Sk.configure({
            output: addOutput,
            __future__: Sk.python3,
            inputfun: inputFunc,
            inputfunTakesPrompt: true
        });

        // Run the code using Skulpt
        const runner = Sk.misceval.asyncToPromise(() => Sk.importMainWithBody("<stdin>", false, code, true));
        runner.then(_ => {
            console.log("success");
        }, err => {
            addOutput(err.toString());
        });
    }

    return <div className={styles.output + " " + styles.repl}>
        {out.map((line, i) => <div key={i}>{line}</div>)}
    </div>
}

export default Repl;