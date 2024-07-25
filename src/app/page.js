"use client";
import CodeEditor from "./codeEditor";
import styles from "./page.module.css";
import { useState } from "react";

export default function Home() {
    const [view, setView] = useState(null);

    return (
        <main className={styles.main}>
            <p>Child components will go here</p>
            <CodeEditor startingCode="Hello" setView={setView}/>
        </main>
    );
}
