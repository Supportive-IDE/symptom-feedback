import { findAndConvertUrlParam } from "../../utils";
import CodeInline from "../codeInline";
import { LINE_NUMBER } from "../config";
import MiniIDE from "../miniIDE";

export default function LocalVariablesAreGlobal({misconInfo}) {
    const lineNumber = misconInfo.has(LINE_NUMBER) ? Number(misconInfo.get(LINE_NUMBER)) : -1;
    const varName = findAndConvertUrlParam(misconInfo, "text");

    return <>
        <h1><CodeInline code={varName} /> on line {lineNumber} is undefined</h1>
        <p><CodeInline code={varName} /> on line {lineNumber} is in global scope, where it has not been 
        assigned a value. There is a variable with the same name in a function in this file. That variable is 
        not accessible outside of the function. </p>
        <p>If this error is caused by a typo, it can be fixed by assigning <CodeInline code={varName} /> a value 
        before calling it on line {lineNumber}.</p>
        <p>If the intention is to call the variable that is in function scope, it will need to be returned from the function.</p>
        <h2>Examples</h2>
        <p>Run the code below and take note of the error message:</p>
        <MiniIDE startingCode={['def squared(x):', '\treturn x * x', '', 'print(squared(x))']} />
        <p>The error occurs because <CodeInline code="x" /> on line 4 has not been assigned a value in this scope. This error can easily be fixed by 
        assigning <CodeInline code="x" /> a value before it is called:</p>
        <MiniIDE startingCode={['def squared(x):', '\treturn x * x', '', 'x = 100', 'print(squared(x))']} />
        <p>This next example is a little different:</p>
        <MiniIDE startingCode={['def one_to_n(n):', '\ttotal = 0', '\tfor i in range(1, n + 1, 1):', '\t\ttotal += i', '', 'one_to_n(10)', 'print(total)']} />
        <p>This time the error occurs because the programmer has tried to access the variable <CodeInline code="total" / > which only exists inside the <CodeInline code="one_to_n()" /> function. To fix this, 
        return <CodeInline code="total" /> from the function and assign it to a different variable outside of the function:</p>
        <MiniIDE startingCode={['def one_to_n(n):', '\ttotal = 0', '\tfor i in range(1, n + 1, 1):', '\t\ttotal += i', '\treturn total', '', 'test = one_to_n(10)', 'print(test)']} />
    </>
}