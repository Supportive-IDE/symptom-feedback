import Prism from "prismjs";
import { useEffect } from "react";
import "prismjs/themes/prism.css";
import "prismjs/components/prism-python";

export default function CodeBlock({code}) {
    useEffect(() => {
        Prism.highlightAll();
    }, []);

    return <pre>
        <code className="language-python">{typeof code === "string" ? code : code.join("\n")}</code>
    </pre>
}