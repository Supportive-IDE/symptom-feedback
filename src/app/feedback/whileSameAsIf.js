import CodeBlock from "../codeBlock";
import CodeInline from "../codeInline";
import { LINE_NUMBER } from "../config";
import MiniIDE from "../miniIDE";
import { Fragment } from "react";

// URL params
const definitionParam = "definitionText";
const loopTextParam = "loopText";
const loopVarParam = "loopVar";
const exitLineParam = "earlyExitLine";
const exitTextParam = "earlyExitText";

export default function WhileSameAsIf({misconInfo}) {
    const lineNumber = misconInfo.has(LINE_NUMBER) ? Number(misconInfo.get(LINE_NUMBER)) : -1;
    const definitionText = misconInfo.has(definitionParam) ? <CodeInline code={misconInfo.get(definitionParam)} /> : "";
    const loopText = misconInfo.has(loopTextParam) ? misconInfo.get(loopTextParam) : "";
    const unmodifiedLoopVars = misconInfo.getAll(loopVarParam);
    const exitLines = misconInfo.getAll(exitLineParam);
    const exitTexts = misconInfo.getAll(exitTextParam);

    const adjustIndents = () => {
        const spaces = loopText.indexOf("while");
        let indent = "";
        for (let i = 0; i < spaces; i++) {
            indent = `${indent} `;
        }
        const lines = loopText.split("\n");
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].indexOf(indent) === 0) {
                lines[i] = lines[i].substring(spaces);
            }
        }
        return lines.join("\n");
    }

    const explainExits = () => {
        const parts = exitTexts.map((t, i) => {
            return <>{<CodeInline code={t} />} on line {exitLines[i]}</>
        });
        return parts;
    }

    return <>
        <h1>A <CodeInline code="while" /> loop only runs once</h1>
        <p>The code inside this <CodeInline code="while" /> loop only runs once:</p>
        <CodeBlock code={adjustIndents()} />
        <p>If you only want the loop to run once, you can change <CodeInline code="while" /> to <CodeInline code="if" />.</p>
        <h2>Why does it matter?</h2>
        <p>The purpose of a <CodeInline code="while" /> loop is to repeat some code as long as a condition is true. If you don&apos;t 
        need to repeat the code, it is clearer and more efficient to use <CodeInline code="if" />.</p>
        <h2>But I want the loop to run more than once!</h2>
        <p>The <CodeInline code="while" /> loop only runs once because the following lines cause the loop to end:</p>
        <ul>
            {explainExits().map((val, i) => <li key={i} >{val}</li>)}
        </ul>
        <p>You will need to remove or move any code that causes the loop to end.</p>
        <h2>Example - Fixing a broken loop</h2>
        <p>The loop in this code will always end the first time it runs:</p>
        <MiniIDE startingCode={['# Incorrect', '', 'def remove_exclamation(message):', '\twhile message[-1] == "!":', '\t\tmessage = message[:-1]', '\t\treturn message', '', 'result = remove_exclamation("Hello!!!!")', 'print(result) # Should print "Hello"']} />
        <p>The loop ends because of the <CodeInline code="return" /> inside the loop. Moving the <CodeInline code="return" /> outside the loop will fix this example:</p>
        <MiniIDE startingCode={['# Correct', '', 'def remove_exclamation(message):', '\twhile message[-1] == "!":', '\t\tmessage = message[:-1]', '\treturn message', '', 'result = remove_exclamation("Hello!!!!")', 'print(result) # Should print "Hello"']} />       
    </>
}