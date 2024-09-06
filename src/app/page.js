"use client";
import { COMPARE_MULTIPLE_WITH_OR, MISCON } from "./config";
import CompareMultipleWithOr from "./feedback/compareMultipleWithOr";
import MiniIDE from "./miniIDE";
import styles from "./page.module.css";
import Repl from "./repl";
import { useSearchParams } from "next/navigation";

export default function Home() {
    const searchParams = useSearchParams();
    return (
        <main className={styles.main}>
            {/* 
            <Repl />
            <MiniIDE /> 
            */}
            { (() => {
                switch (searchParams.get(MISCON)) {
                    case COMPARE_MULTIPLE_WITH_OR:
                        return <CompareMultipleWithOr misconInfo={searchParams} />
                    default:
                        return <>
                            <p>Nothing here... Here&apos;s a REPL to play with:</p>
                            <Repl />
                        </>
                }})()
            }
        </main>
    );
}
