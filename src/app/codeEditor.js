import {EditorState} from "@codemirror/state"
import {keymap} from "@codemirror/view"
import { basicSetup, EditorView } from "codemirror";
import {defaultKeymap, indentWithTab} from "@codemirror/commands"
import { useRef, useEffect } from "react";
import {python} from "@codemirror/lang-python";
import styles from "./codeEditor.module.css";


const CodeEditor = ({startingCode, setView, runCode, resetCode}) => {
    const parentDiv = useRef(null);
    const startingCodeCombined = typeof startingCode === "string" ? startingCode : startingCode.join("\n");

    useEffect(() => {
        if (parentDiv.current === null) return;

        const view = new EditorView({
            state: EditorState.create({ 
                doc: startingCodeCombined,
                extensions: [
                    basicSetup, python(),
                     keymap.of([defaultKeymap, indentWithTab])
                ]
            }),
            parent: parentDiv.current
        });

        setView(view);
        return () => {
            view.destroy();
            setView(null);
            
        };
    }, [parentDiv, startingCode, setView, startingCodeCombined]);
      
    return <div className={styles.codeEditor} ref={parentDiv} >
        <div className={styles.buttons}>
            <button className="highlight-btn" id={styles.runButton} onClick={runCode}>Run</button>
            <button id={styles.resetButton} onClick={resetCode}>Reset</button>
        </div>
    </div>;
}

export default CodeEditor;