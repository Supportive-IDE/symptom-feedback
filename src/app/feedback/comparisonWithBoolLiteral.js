import CodeBlock from "../codeBlock";
import CodeInline from "../codeInline";
import { LINE_NUMBER } from "../config";
import MiniIDE from "../miniIDE";

export default function ComparisonWithBoolLiteral({misconInfo}) {
    const lineNumber = misconInfo.has(LINE_NUMBER) ? Number(misconInfo.get(LINE_NUMBER)) : -1;
    const comparison = misconInfo.has("text") ? misconInfo.get("text") : "";
    const boolValue = misconInfo.has("boolValue") ? misconInfo.get("boolValue") : "";
    const boolLiteral = misconInfo.has("boolLiteral") ? misconInfo.get("boolLiteral") : "";

    return <>
        {
            boolLiteral === "True" ?
                <h1><CodeInline code="== True" /> is not needed</h1>
                :
                <h1><CodeInline code={comparison} /> is the same as <CodeInline code={`not ${boolValue}`} /></h1>
        }
        <p><CodeInline code={boolValue} /> is a boolean expression. Its value is either <CodeInline code="True" /> or <CodeInline code="False" />. The 
        comparison on line {lineNumber} is also a boolean expression. Its value is either <CodeInline code="True" /> or <CodeInline code="False" />.</p>
        <CodeBlock code={comparison} />
        {
            boolLiteral === "True" ?
                <>
                    <p>The value of the comparison will be the same as the value of <CodeInline code={boolValue} />. This means the comparison is not needed. You can just use <CodeInline code={boolValue} /> instead.</p>
                    <p>Here is a similar example:</p>
                    <CodeBlock code={['ready = True', '', '# Unnecessary comparison', 'if ready == True:', '\tprint("I am ready!")', '', '# Better', 'if ready:', '\tprint("I am ready!")']} />
                </>
                :
                <>
                    <p>The value of the comparison will be the same as <CodeInline code={`not ${boolValue}`} />. This means you can use <CodeInline code={`not ${boolValue}`} /> instead 
                    of the full comparison.</p>
                    <p>Here is a similar example:</p>
                    <CodeBlock code={['ready = False', '', '# Unnecessary comparison', 'if ready == False:', '\tprint("I am not ready!")', '', '# Shorter', 'if not ready:', '\tprint("I am not ready!")']} />
                </>
        }
        
        <h2>Try it out</h2>
        <p>The code below shows both ways to check if a boolean value is <CodeInline code="True" />. Run the code and check that both options print the same value.</p>
        <MiniIDE startingCode={['is_the_weekend = True', '', 'print(is_the_weekend == True)', 'print(is_the_weekend)']} />
        <p>Try setting <CodeInline code="is_the_weekend" /> to <CodeInline code="False" />. Both options will still print the same output.</p>
        <p>The code below shows two ways to check if a boolean value is <CodeInline code="False" />.</p>
        <MiniIDE startingCode={['is_the_weekend = True', '', 'print(is_the_weekend == False)', 'print(not is_the_weekend)']} />
    </>
}