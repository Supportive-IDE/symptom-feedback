import {EditorState, Compartment} from "@codemirror/state"
import {keymap} from "@codemirror/view"
import { basicSetup, EditorView } from "codemirror";
import {defaultKeymap, indentWithTab} from "@codemirror/commands"
import { useRef, useEffect } from "react";
import { darkTheme, lightTheme } from "../themes";
import {python} from "@codemirror/lang-python";
import styles from "./codeEditor.module.css";


const CodeEditor = ({startingCode, setView, runCode, resetCode}) => {
    const parentDiv = useRef(null);
    const startingCodeCombined = typeof startingCode === "string" ? startingCode : startingCode.join("\n");
    const theme = new Compartment;

    useEffect(() => {
        if (parentDiv.current === null) return;

        const view = new EditorView({
            state: EditorState.create({ 
                doc: startingCodeCombined,
                extensions: [
                    basicSetup, python(),
                    keymap.of([defaultKeymap, indentWithTab],),
                    theme.of(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? darkTheme : lightTheme)
                ]
            }),
            parent: parentDiv.current
        });

        setView(view);

        const updateTheme = event => {
            view.dispatch({
                effects: theme.reconfigure(event.matches ? darkTheme : lightTheme)
            });
        }

        if (window.matchMedia) {
            const checkMode = window.matchMedia('(prefers-color-scheme: dark)');
            checkMode.addEventListener("change", updateTheme)
        }

        return () => {
            view.destroy();
            setView(null);
        };

    }, [parentDiv, startingCode, setView, startingCodeCombined]);
      
    return <div className={styles.codeEditor} ref={parentDiv}>
        <div className={styles.buttons}>
            <button className="highlight-btn" id={styles.runButton} onClick={runCode}>Run</button>
            <button id={styles.resetButton} onClick={resetCode}>Reset</button>
        </div>
    </div>;
}

export default CodeEditor;