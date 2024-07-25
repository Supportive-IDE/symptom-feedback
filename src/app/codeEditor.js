import {EditorState} from "@codemirror/state"
import {keymap} from "@codemirror/view"
import { basicSetup, EditorView } from "codemirror";
import {defaultKeymap, indentWithTab} from "@codemirror/commands"
import { useRef, useEffect } from "react";
import {python} from "@codemirror/lang-python"
import styles from "./codeEditor.module.css";


const CodeEditor = ({startingCode, setView}) => {
    const parentDiv = useRef(null);

    useEffect(() => {
        if (parentDiv.current === null) return;

        const view = new EditorView({
            state: EditorState.create({ 
                doc: startingCode, 
                extensions: [basicSetup, python(), keymap.of([defaultKeymap, indentWithTab])]
            }),
            parent: parentDiv.current
        });

        setView(view);
        return () => {
            view.destroy();
            setView(null);
            
        };
    }, [parentDiv, startingCode, setView]);
      
    return <div className={styles.codeEditor} ref={parentDiv} ></div>;
}

export default CodeEditor;