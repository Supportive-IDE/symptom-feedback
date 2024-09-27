"use client";
import { COMPARE_MULTIPLE_WITH_OR, CONDITIONAL_SEQUENCE, MISCON, PRINT_RETURN } from "./config";
import CompareMultipleWithOr from "./feedback/compareMultipleWithOr";
import ConditionalIsSequence from "./feedback/conditionalIsSequence";
import PrintSameAsReturn from "./feedback/printSameAsReturn";
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
                    case CONDITIONAL_SEQUENCE:
                        return <ConditionalIsSequence misconInfo={searchParams} />
                    case PRINT_RETURN:
                        return <PrintSameAsReturn misconInfo={searchParams} />
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
