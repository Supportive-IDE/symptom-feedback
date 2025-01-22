import CodeBlock from "../codeBlock";
import CodeInline from "../codeInline";
import { LINE_NUMBER } from "../config";
import MiniIDE from "../miniIDE";

export default function ReturnCall({misconInfo}) {
    const lineNumber = misconInfo.has(LINE_NUMBER) ? Number(misconInfo.get(LINE_NUMBER)) : -1;
    const returnStatement = misconInfo.has("text") ? misconInfo.get("text") : ""
    const returnValueType = misconInfo.has("returnValueType") ? misconInfo.get("returnValueType") : "";
    const returnValueText = misconInfo.has("returnValueText") ? <CodeInline code={misconInfo.get("returnValueText")} /> : <CodeInline code="'''Oops! Missing value!'''" />

    return <>
        <h1><CodeInline code="return" /> does not need <CodeInline code="()" /></h1>
        <p>The value returned on line {lineNumber} is inside brackets, <CodeInline code="()" />:</p>
        <CodeBlock code={returnStatement} />
        <p>These brackets are not necessary and should be removed. For example, instead of:</p>
        <CodeBlock code={["def my_func():", "\t# Unnecessary brackets", "\treturn ('Hello, World!')"]} ></CodeBlock>
        <p>...return the value directly:</p>
        <CodeBlock code={["def my_func():", "\t# Better", "\treturn 'Hello, World!'"]} ></CodeBlock>
        <h2>Why does this matter?</h2>
        <p>Extra brackets do not affect how your code runs. But, they can make the code harder to read. Avoid adding code that is not needed.</p>
        <p>The <CodeInline code="add_two()" /> function below has unnecessary brackets around the return value:</p>
        <MiniIDE startingCode={['# Unnecessary brackets', ' ','def add_two(a, b):', '\treturn(a + b)', '', 'result = add_two(1.3, 2.4)', 'print(result)']} />
        <p>Try running the revised code below. The unnecessary brackets have been removed. You will see that this version has the same output as before.</p>
        <MiniIDE startingCode={['# Better', ' ', 'def add_two(a, b):', '\treturn a + b', '', 'result = add_two(1.3, 2.4)', 'print(result)']} />
        <h3>What if there are multiple return values?</h3>
        <p>Brackets are still not needed when returning more than one value from a function. Python will automatically put the values into 
            a <strong>tuple</strong>—a collection of values inside brackets.
        </p>
        <p>In the code below, <CodeInline code="v1()" /> and <CodeInline code="v2()" /> are almost the same. <CodeInline code="v1()" /> puts the return 
        values in brackets but <CodeInline code="v2()" /> does not. Run the code to see that both functions have the same output.</p>
        <MiniIDE startingCode={['# Unnecessary brackets', 'def v1():', '\treturn (1, 2, 3)', '', '# Better', 'def v2():', '\treturn 1, 2, 3', '', 'result1 = v1()', 'result2 = v2()', 'print("v1:", result1)', 'print("v2:", result2)']} />
    </>
}