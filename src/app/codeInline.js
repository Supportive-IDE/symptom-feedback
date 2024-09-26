import Prism from "prismjs";
import { useEffect } from "react";
import "prismjs/themes/prism.css";
import "prismjs/components/prism-python";

export default function CodeInline({code}) {
    useEffect(() => {
        Prism.highlightAll();
    }, []);

    return <code className="language-python">{typeof code === "string" ? code : code.join("\n")}</code>
}