"use client";

import App from "./app";
import styles from "./page.module.css";
import { Suspense } from "react";

export default function Home() {
    
    return (
        <main className={styles.main}>
            <div id="feedback-content">
            <Suspense>
                <App />
            </Suspense>
            </div>
        </main>
    );
}
