import CodeEditor from "./codeEditor";
import { useEffect, useRef, useState } from "react";
import Sk from "skulpt";
import CodeOutput from "./codeOutput";
import styles from "./miniIDE.module.css";
import RawInput from "./rawInput";
import { sendData } from "../utils";

/**
 * A Python code editor with a run button and terminal.
 * 
 * @component
 * @param {Object} props - An object with a startingCode property
 * @param {string} props.startingCode - The Python code to display in the editor when it loads.
 * @returns {JSX.Element} The rendered component.
 */
const MiniIDE = ({startingCode}) => {
    //const [view, setView] = useState(null);
    const [out, setOut] = useState([]);
    const view = useRef(null);
    const code = useRef(startingCode);

    useEffect(() => {
        //console.log("out updated", out);
    }, [out]);

    
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
        if (view.current === null) return;
        // Log
        sendData({eventType: "runCode", notes: view.current.state.doc.toString()});
        // This gets ignored after an input
        setOut([]);
        // Get the code in the editor view
        code.current = view.current.state.doc.toString();
        // Configure Skulpt to execute the code
        Sk.configure({
            output: addOutput,
            __future__: Sk.python3,
            inputfun: inputFunc,
            inputfunTakesPrompt: true
        });

        // Run the code using Skulpt
        const runner = Sk.misceval.asyncToPromise(() => Sk.importMainWithBody("<stdin>", false, code.current, true));
        runner.then(_ => {
            console.log("success");
        }, err => {
            console.log(err);
            addOutput(err.toString());
        });

    }

    const resetCode = () => {
        code.current = startingCode;
        view.current.state.doc = typeof startingCode === "string" ? startingCode : startingCode.join("\n");
        // Log
        sendData({eventType: "resetCode", notes: view.current.state.doc.toString()});
        setOut([]);
    }

    const inputFunc = prompt => {
        const p = new Promise(function(resolve, reject) {
            const userIn = <RawInput key={Date.now()} prompt={prompt} submitHandler={val => resolve(val)} />
            addOutput(userIn);
        });
        return p;
    }

    return (
        <div className={styles.miniIDE}>
            <CodeEditor startingCode={code.current} setView={v => { view.current = v; }} runCode={runCode} resetCode={resetCode} />
            <CodeOutput text={out} prefix="%" />
        </div>
    )
};

export default MiniIDE;