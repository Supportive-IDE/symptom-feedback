import Prism from "prismjs";
import { useEffect } from "react";
import "prismjs/themes/prism.css";
import "prismjs/components/prism-python";
import styles from "./codeBlock.module.css";

export default function CodeBlock({code}) {
    useEffect(() => {
        Prism.highlightAll();
    }, []);

    return <pre className={styles.code}>
        <code className="language-python">{typeof code === "string" ? code : code.join("\n")}</code>
    </pre>
}