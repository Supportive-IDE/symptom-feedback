"use client";
import MiniIDE from "./miniIDE";
import styles from "./page.module.css";
import Repl from "./repl";

export default function Home() {
    return (
        <main className={styles.main}>
            <Repl />
            {/* <MiniIDE /> */}
        </main>
    );
}
