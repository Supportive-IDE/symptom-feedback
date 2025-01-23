import CodeBlock from "../codeBlock";
import CodeInline from "../codeInline";
import { LINE_NUMBER } from "../config";
import MiniIDE from "../miniIDE";

export default function IterationRequiresTwoLoops({misconInfo}) {
    const lineNumber = misconInfo.has(LINE_NUMBER) ? Number(misconInfo.get(LINE_NUMBER)) : -1;
    const outerLoopText = misconInfo.has("outerLoopText") ? misconInfo.get("outerLoopText") : "";
    const loopVariable = misconInfo.has("outerLoopVariable") ? <CodeInline code={misconInfo.get("outerLoopVariable")} /> : "";
    const modifiedLoopTypes = misconInfo.getAll("modifiedInType");
    const modifiedInStartLines = misconInfo.getAll("modifiedInStartLine");

    return <>
        <h1>A <CodeInline code="while" /> loop might not be needed</h1>
        <p>The <CodeInline code="while" /> loop on line {lineNumber} has a "loop variable", {loopVariable}.</p>
        <CodeBlock code={outerLoopText} />
        {
            modifiedLoopTypes.length === 1 ?
                <p>The value of a <CodeInline code="while" /> loop variable should be changed each time the 
                loop runs. In your code, {loopVariable} is only changed inside a nested <CodeInline code={modifiedLoopTypes[0]} /> loop 
                that starts on line {modifiedInStartLines[0]}. This means the <CodeInline code="while" /> loop might 
                not be needed.</p>
                :
                modifiedLoopTypes.length > 1 ?
                    <>
                        <p>The value of a <CodeInline code="while" /> loop variable should be changed each time the 
                loop runs. In your code, {loopVariable} is only changed inside nested loops: <CodeInline code={modifiedLoopTypes[0]} /> loop 
                that starts on line {modifiedInStartLines[0]}.</p>
                        <ul>
                            {
                                modifiedLoopTypes.map((loopType, i) => <li key={i}>A <CodeInline code={loopType} /> loop starting on line {modifiedInStartLines[i]}</li>)
                            }
                        </ul>
                        <p>This means the <CodeInline code="while" /> loop might 
                        not be needed.</p>
                    </>
                    :
                    <p>The value of a <CodeInline code="while" /> loop variable should be changed each time the 
                loop runs. In your code, {loopVariable} is only changed inside nested loops. This means the <CodeInline code="while" /> loop might 
                not be needed.</p>
        }
        <h2>Example</h2>
        <p>The <CodeInline code="while" /> loop in this example doesn&apos;t do anything:</p>
        <MiniIDE startingCode={['i = 0', 'message = "hello"', '', '# Unnecessary while loop', 'while i < len(message):', '\tfor letter in message:', '\t\tprint(letter)', '\t\ti += 1']} />
        <p>Here is an improved version without the extra <CodeInline code="while" /> loop:</p>
        <MiniIDE startingCode={['message = "hello"', '', 'for letter in message:', '\tprint(letter)']} />
        <p>If you run both examples, you will see the output is the same.</p>
    </>
}