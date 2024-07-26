"use client";
import CodeEditor from "./codeEditor";
import CodeOutput from "./codeOutput";
import styles from "./page.module.css";
import { useState } from "react";
import Sk from "skulpt"

export default function Home() {
    const [view, setView] = useState(null);
    const [out, setOut] = useState("");

    const runCode = () => {
        if (view === null) return;
        const code = view.state.doc.toString();
        //mypre.innerHTML = ''; 
        //Sk.pre = "output";
        Sk.configure({
                        output:setOut, 
                        // read:builtinRead,
                        __future__: Sk.python3,
                        // inputfun: inputFunc,
                        // inputfunTakesPrompt: true
                    }); 
        const myPromise = Sk.misceval.asyncToPromise(function() {
            return Sk.importMainWithBody("<stdin>", false, code, true);
            
        });
        myPromise.then(function(mod) {
            console.log('success');
        },
        function(err) {
            console.log(err.toString());
        });
    };

    return (
        <main className={styles.main}>
            <p>Child components will go here</p>
            <CodeEditor startingCode="Hello" setView={setView}/>
            <CodeOutput text={out} />
            <button onClick={runCode}>Run</button>
        </main>
    );
}
