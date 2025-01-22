import CodeBlock from "../codeBlock";
import CodeInline from "../codeInline";
import { LINE_NUMBER } from "../config";
import MiniIDE from "../miniIDE";

export default function ColonAssigns({misconInfo}) {
    const lineNumber = misconInfo.has(LINE_NUMBER) ? Number(misconInfo.get(LINE_NUMBER)) : -1;
    const fullText = misconInfo.has("text") ? misconInfo.get("text") : "";
    const variableName = misconInfo.has("variableName") ? <CodeInline code={misconInfo.get("variableName")} /> : "a variable";
    const assignedValue = misconInfo.has("assignedValue") ? <CodeInline code={misconInfo.get("assignedValue")} /> : "a value";

    return <>
        <h1>Use <CodeInline code="=" /> to assign a value to a variable</h1>
        <p>It looks like you are trying to assign {assignedValue} to {variableName} on line {lineNumber}.</p>
        {
            fullText !== "" && fullText !== "undefined" &&
                <CodeBlock code={fullText} />
        }
        <p>The code above will cause a <CodeInline code="SyntaxError" />. To fix this, replace <CodeInline code=":" /> with <CodeInline code="=" />.</p>
        <CodeBlock code={['# Incorrect', "day: 'Tuesday'", "", "# Correct", "day = 'Tuesday'"]} ></CodeBlock>
        <h2>Try it out</h2>
        <p>The code below will not assign 0.99 to <CodeInline code="price" />:</p>
        <MiniIDE startingCode={['# Incorrect syntax', 'price: 0.99', 'print(price)']} />
        <p>To fix the error, change <CodeInline code=":" /> to <CodeInline code="=" />:</p>
        <MiniIDE startingCode={['# Incorrect syntax', 'price = 0.99', 'print(price)']} />
        
    </>
}