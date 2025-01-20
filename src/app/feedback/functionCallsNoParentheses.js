import CodeInline from "../codeInline";
import { LINE_NUMBER } from "../config";
import MiniIDE from "../miniIDE";

/** URL params */
const funcNameParam = "funcName";
const funcTypeParam = "funcType";
const funcExpectedArgsParam = "funcExpectedArgs";
const undefinedVarParam = "matchesUndefinedVarOnLine";

export default function FunctionCallsNoParentheses({misconInfo}) {
    const lineNumber = misconInfo.has(LINE_NUMBER) ? Number(misconInfo.get(LINE_NUMBER)) : -1;
    const funcName = misconInfo.has(funcNameParam) ? misconInfo.get(funcNameParam) : "";
    const funcType = misconInfo.has(funcTypeParam) ? misconInfo.get(funcTypeParam): "";
    const funcExpectedArgs = misconInfo.has(funcExpectedArgsParam) ? misconInfo.get(funcExpectedArgsParam) : ""; // Will be a string
    const undefinedVarOnLine = misconInfo.has(undefinedVarParam) ? Number(misconInfo.get(undefinedVarParam)) : -1;

    return <>
        <h1>Add <CodeInline code="()" /> after <CodeInline code={funcName} /> to call the function</h1>
        <p><CodeInline code={funcName} /> is used on line {lineNumber} without parentheses. If you meant to call the {funcType === "userDefinedFunction" ? "function" : "Python function"} with the same name, 
        add <CodeInline code="()" /> after the name and pass any expected arguments.</p>
        <p>Note: In Python, functions can be passed as arguments or assigned to variables like any other value. 
            If this was the intention on line {lineNumber}, then leave the code as it is.
        </p>
        <h2>An example</h2>
        <p>Run the code below:</p>
        {
            funcType === "userDefinedFunction" ?
                <>
                    <MiniIDE startingCode={['def squared(x):', '\treturn x * x', '', 'num = int(input("Enter a whole number: "))', 'result = squared', 'print(num, "squared is", result)']} />
                    <p>In the last line of output, notice that the <CodeInline code="result" /> variable&apos;s value is <CodeInline code="<function squared>" />. This is because the programmer has forgotten to include 
                    the parentheses and argument when calling <CodeInline code="squared" /> on line 5. Because of this, the function is not called but is assigned to the variable <CodeInline code="result" />.</p>
                    <p>Here is the corrected code. Line 5 has changed.</p>
                    <MiniIDE startingCode={['def squared(x):', '\treturn x * x', '', 'num = int(input("Enter a whole number: "))', 'result = squared(num)', 'print(num, "squared is", result)']} />
                </>
                :
                <>
                    <MiniIDE startingCode={['name = input', 'print("Hello, ", name)']} />
                    <p>In the last line of output, notice that the <CodeInline code="name" /> variable&apos;s value is <CodeInline code="<built-in function input>" />. This is because the programmer has forgotten to include 
                    the parentheses and argument when calling <CodeInline code="input" /> on line 1. Because of this, the function is not called but is assigned to the variable <CodeInline code="name" />.</p>
                    <p>Here is the corrected code. Line 1 has changed.</p>
                    <MiniIDE startingCode={['name = input("What is your name? ")', 'print("Hello, ", name)']} />
                </>
        }
    </>
}
// import CodeInline from "../codeInline";
// import { LINE_NUMBER } from "../config";
// import MiniIDE from "../miniIDE";

// /** URL params */
// const funcNameParam = "funcName";
// const funcTypeParam = "funcType";
// const funcExpectedArgsParam = "funcExpectedArgs";
// const undefinedVarParam = "matchesUndefinedVarOnLine";

// export default function FunctionCallsNoParentheses({misconInfo}) {
//     const lineNumber = misconInfo.has(LINE_NUMBER) ? Number(misconInfo.get(LINE_NUMBER)) : -1;
//     const funcName = misconInfo.has(funcNameParam) ? misconInfo.get(funcNameParam) : "";
//     const funcType = misconInfo.has(funcTypeParam) ? misconInfo.get(funcTypeParam): "";
//     const funcExpectedArgs = misconInfo.has(funcExpectedArgsParam) ? misconInfo.get(funcExpectedArgsParam) : ""; // Will be a string
//     const undefinedVarOnLine = misconInfo.has(undefinedVarParam) ? Number(misconInfo.get(undefinedVarParam)) : -1;

//     return <>
//         <h1>Add <CodeInline code="()" /> after <CodeInline code={funcName} /> to call the function</h1>
//         {
//             undefinedVarOnLine !== -1 ?
//                 <p><CodeInline code={funcName} /> is used like a variable on line {lineNumber} but it has not been 
//                 initialised with a value. There is a {funcType === "userDefinedFunction" ? "function in the file" : "Python function"} with the same name. To call that function, add parentheses 
//                 after the name and pass any expected arguments. If <CodeInline code={funcName} /> is intended to 
//                 be a variable, it will need to be given a value before it is called.</p>
//             :
//                 <p><CodeInline code={funcName} /> is used like a variable on line {lineNumber} but there is 
//                     no variable with this name in the file. There is a {funcType === "userDefinedFunction" ? "function in the file" : "Python function"} with the same name. To call that function, add parentheses 
//                     after the name and pass any expected arguments. If <CodeInline code={funcName} /> is intended to 
//                     be a variable, it will need to be given a value before it is called.</p>
//         }
//         <p>Note: In Python, functions are objects, which means they can be passed as arguments or assigned to variables like any other value. 
//             If this was the intention on line {lineNumber}, then leave the code as it is.
//         </p>
//         <h2>An example</h2>
//         <p>Run the code below:</p>
//         {
//             funcType === "userDefinedFunction" ?
//                 <>
//                     <MiniIDE startingCode={['def squared(x):', '\treturn x * x', '', 'num = int(input("Enter a whole number: "))', 'result = squared', 'print(num, "squared is", result)']} />
//                     <p>In the last line of output, notice that the <CodeInline code="result" /> variable's value is <CodeInline code="<function squared>" />. This is because the programmer has forgotten to include 
//                     the parentheses and argument when calling <CodeInline code="squared" /> on line 5. Because of this, the function is not called but is assigned to the variable <CodeInline code="result" />.</p>
//                     <p>Here is the corrected code. Spot the difference on line 5.</p>
//                     <MiniIDE startingCode={['def squared(x):', '\treturn x * x', '', 'num = int(input("Enter a whole number: "))', 'result = squared(num)', 'print(num, "squared is", result)']} />
//                 </>
//                 :
//                 <>
//                     <MiniIDE startingCode={['name = input', 'print("Hello, ", name)']} />
//                     <p>In the last line of output, notice that the <CodeInline code="name" /> variable's value is <CodeInline code="<built-in function input>" />. This is because the programmer has forgotten to include 
//                     the parentheses and argument when calling <CodeInline code="input" /> on line 1. Because of this, the function is not called but is assigned to the variable <CodeInline code="name" />.</p>
//                     <p>Here is the corrected code. Spot the difference on line 1.</p>
//                     <MiniIDE startingCode={['name = input("What is your name? ")', 'print("Hello, ", name)']} />
//                 </>
//         }
//     </>
// }