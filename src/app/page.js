"use client";
import MiniIDE from "./miniIDE";
import styles from "./page.module.css";

export default function Home() {
    return (
        <main className={styles.main}>
            <MiniIDE />
        </main>
    );
}
