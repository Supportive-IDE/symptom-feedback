import { findAndConvertUrlParam } from "../../utils";
import CodeInline from "../codeInline";
import { LINE_NUMBER } from "../config";
import MiniIDE from "../miniIDE";


export default function LocalVariablesAreGlobal({misconInfo}) {
    const lineNumber = misconInfo.has(LINE_NUMBER) ? Number(misconInfo.get(LINE_NUMBER)) : -1;
    const localScopes = misconInfo.has("localScope") ? misconInfo.getAll("localScope") : [];
    const localFunctions = misconInfo.has("localFunction") ? misconInfo.getAll("localFunction") : [];
    const varName = findAndConvertUrlParam(misconInfo, "text");


    const explainCustomScopeIssue = () => {
        if (localFunctions.length === 1 && localFunctions[0] !== "NA") {
            return <>
                <h2>Why doesn&apos;t <CodeInline code={varName} /> on line {lineNumber} get it&apos;s value from <CodeInline code={varName} /> in <CodeInline code={localFunctions[0] + "()"} />?</h2>
                <p>The answer is <strong>scope</strong>. Variables defined in functions have <strong>local scope</strong>. This means 
                they only exist in the function where they were defined.</p>
                <p>In your code, <CodeInline code={varName} /> in <CodeInline code={localFunctions[0] + "()"} /> is <strong>local</strong> to 
                the function <CodeInline code={localFunctions[0] + "()"} />.</p>
                <p>The code on line {lineNumber} is in <strong>global</strong> scope. Code in global scope is outside of a function and cannot access code in local scope. Python 
                considers <CodeInline code={varName} /> on line {lineNumber} to be a completely different variable from <CodeInline code={varName} /> in <CodeInline code={localFunctions[0] + "()"}/>.</p>
                <p>The examples below provide hints for how to fix scope issues.</p>
            </>
        }
        else if (localFunctions.length === 1 && localFunctions[0] === "NA") {
            return <>
                <h2>But there is already a variable called <CodeInline code={varName} /> defined in my code...</h2>
                <p>Python views <CodeInline code={varName} /> on line {lineNumber} as different to the other <CodeInline code={varName} /> because of <strong>scope</strong>. Variables defined in functions 
                have <strong>local scope</strong>. This means they only exist in the function where they were defined.</p>
                <p>In your code, line {lineNumber} is in <strong>global</strong> scope. Code in global scope is outside of a function and cannot access code in local scope. Python 
                considers <CodeInline code={varName} /> on line {lineNumber} to be a completely different variable from <CodeInline code={varName} /> in local scope.</p>
                <p>The examples below provide hints for how to fix scope issues.</p>
            </>
        }
        else if (localFunctions.length > 1) {
            return <>
                <h2>But there is already a variable called <CodeInline code={varName} /> defined in my code...</h2>
                <p>Python views <CodeInline code={varName} /> on line {lineNumber} as different to the other <CodeInline code={varName} /> variables because of <strong>scope</strong>. Variables defined in functions 
                have <strong>local scope</strong>. This means they only exist in the function where they were defined.</p>
                <p>In your code, line {lineNumber} is in <strong>global</strong> scope. Code in global scope is outside of a function and cannot access code in local scope. Python 
                considers <CodeInline code={varName} /> on line {lineNumber} to be a completely different variable from <CodeInline code={varName} /> in local scope.</p>
                <p>The examples below provide hints for how to fix scope issues.</p>
            </>
        }
        return <>
            <h2>Could you have a scope issue?</h2>
            <p>Variables defined in functions have <strong>local scope</strong>. This means 
                they only exist in the function where they were defined.</p>
            <p>In your code, there is another <CodeInline code={varName} /> variable defined in a function. Variables defined in functions 
            have <strong>local scope</strong>. This means they only exist in the function where they were defined.</p>
                <p>The code on line {lineNumber} is in <strong>global</strong> scope. Code in global scope is outside of a function and cannot access code in local scope. Python 
                considers <CodeInline code={varName} /> on line {lineNumber} to be a completely different variable from <CodeInline code={varName} /> in local scope.</p>
                <p>The examples below provide hints for how to fix scope issues.</p>
        </>
    }


    return <>
        <h1><CodeInline code={varName} /> on line {lineNumber} is undefined</h1>
        <p>Did you forget to assign <CodeInline code={varName} /> a value? If so, you can fix this error by assigning a value to <CodeInline code={varName} /> before using it on line {lineNumber}.</p>
        { explainCustomScopeIssue() }
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


// import { findAndConvertUrlParam } from "../../utils";
// import CodeInline from "../codeInline";
// import { LINE_NUMBER } from "../config";
// import MiniIDE from "../miniIDE";

// export default function LocalVariablesAreGlobal({misconInfo}) {
//     const lineNumber = misconInfo.has(LINE_NUMBER) ? Number(misconInfo.get(LINE_NUMBER)) : -1;
//     const varName = findAndConvertUrlParam(misconInfo, "text");

//     return <>
//         <h1><CodeInline code={varName} /> on line {lineNumber} is undefined</h1>
//         <p><CodeInline code={varName} /> on line {lineNumber} is in global scope, where it has not been 
//         assigned a value. There is a variable with the same name in a function in this file. That variable is 
//         not accessible outside of the function. </p>
//         <p>If this error is caused by a typo, it can be fixed by assigning <CodeInline code={varName} /> a value 
//         before calling it on line {lineNumber}.</p>
//         <p>If the intention is to call the variable that is in function scope, it will need to be returned from the function.</p>
//         <h2>Examples</h2>
//         <p>Run the code below and take note of the error message:</p>
//         <MiniIDE startingCode={['def squared(x):', '\treturn x * x', '', 'print(squared(x))']} />
//         <p>The error occurs because <CodeInline code="x" /> on line 4 has not been assigned a value in this scope. This error can easily be fixed by 
//         assigning <CodeInline code="x" /> a value before it is called:</p>
//         <MiniIDE startingCode={['def squared(x):', '\treturn x * x', '', 'x = 100', 'print(squared(x))']} />
//         <p>This next example is a little different:</p>
//         <MiniIDE startingCode={['def one_to_n(n):', '\ttotal = 0', '\tfor i in range(1, n + 1, 1):', '\t\ttotal += i', '', 'one_to_n(10)', 'print(total)']} />
//         <p>This time the error occurs because the programmer has tried to access the variable <CodeInline code="total" / > which only exists inside the <CodeInline code="one_to_n()" /> function. To fix this, 
//         return <CodeInline code="total" /> from the function and assign it to a different variable outside of the function:</p>
//         <MiniIDE startingCode={['def one_to_n(n):', '\ttotal = 0', '\tfor i in range(1, n + 1, 1):', '\t\ttotal += i', '\treturn total', '', 'test = one_to_n(10)', 'print(test)']} />
//     </>
// }