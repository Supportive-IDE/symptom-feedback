import CodeEditor from "./codeEditor";
import { useState } from "react";
import Sk from "skulpt";
import CodeOutput from "./codeOutput";
import styles from "./miniIDE.module.css";
import RawInput from "./rawInput";

/**
 * A Python code editor with a run button and terminal.
 * 
 * @component
 * @param {Object} props - An object with a startingCode property
 * @param {string} props.startingCode - The Python code to display in the editor when it loads.
 * @returns {JSX.Element} The rendered component.
 */
const MiniIDE = ({startingCode}) => {
    const [view, setView] = useState(null);
    const [out, setOut] = useState([]);

    /**
     * Adds a line of output text to the "terminal". The text comes from Skulpt on code execution.
     * @param {string} text 
     */
    const addOutput = text => {
        setOut(prevItems => [...prevItems, text]);
    }

    /**
     * Attempts to run the code in the editor and print any output to the terminal
     * @returns {null}
     */
    const runCode = () => {
        if (view === null) return;
        setOut([]);
        // Get the code in the editor view
        const code = view.state.doc.toString();
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

    const inputFunc = prompt => {
        const p = new Promise(function(resolve, reject) {
            const userIn = <RawInput prompt={prompt} submitHandler={val => {
                resolve(val);
                // convert raw input to text
                setOut(prevLines => {
                    const lines = [...prevLines.slice(0, -1)];
                    lines.push(`${prompt}${val}`);
                    return lines
                });
            }} />
            addOutput(userIn);
        });
        return p;
    }

    return (
        <div className={styles.miniIDE}>
            <CodeEditor startingCode={startingCode} setView={setView} runCode={runCode} />
            <CodeOutput text={out} />
        </div>
    )
};

export default MiniIDE;