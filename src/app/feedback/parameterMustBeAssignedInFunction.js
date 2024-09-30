import CodeBlock from "../codeBlock";
import CodeInline from "../codeInline";
import MiniIDE from "../miniIDE";
import { LINE_NUMBER } from "../config";

export default function ParamMustBeAssignedInFunction({misconInfo}) {
    const lineNumber = misconInfo.has(LINE_NUMBER) ? Number(misconInfo.get(LINE_NUMBER)): -1;
    const paramName = misconInfo.has("paramName") ? misconInfo.get("paramName") : "";
    // paramName
    return <>
        <h1>The value of {paramName !== "" ? <>the argument <CodeInline code={paramName} ></CodeInline></> : "an argument"} is overwritten before it can be used</h1>
        <p><CodeInline code={paramName} /> is a parameter, which means its value is set when the function is called. However, on 
        line {lineNumber}, the passed in value is overwritten. This means that the value passed in to <CodeInline code={paramName} /> will 
        not have any effect in the function.</p>
        <h2>How to fix?</h2>
        <p>Avoid setting the value of a parameter inside a function, at least before the parameter has been called in the function. This will allow the code that calls the function 
            to determine what the parameter value should be, making the function more reusable.
        </p>
        <p>Read the code below:</p>
        <MiniIDE startingCode={['def farenheit_to_celsius(f):', '\tf = float(input("Enter the temperature in Farenheit: "))',
                                '\treturn (f - 32) * 5/9', '','print(farenheit_to_celsius(32))'
        ]} />
        <p>The value of the parameter, <CodeInline code="f" />, is overwritten on line 2. This means that the value passed 
        to <CodeInline code="f" /> when the function is called on line 5 is ignored.</p>
        <p>To fix this issue, remove the line of code that overwrites <CodeInline code="f" />:</p>
        <MiniIDE startingCode={['def farenheit_to_celsius(f):',
                                '\treturn (f - 32) * 5/9', '','print(farenheit_to_celsius(32))'
        ]} />
        <p>If the programmer still wants to prompt the user to enter a temperature to convert, they can put this code outside the 
            function then pass the user&apos;s value to the function when it is called:
        </p>
        <MiniIDE startingCode={['def farenheit_to_celsius(f):',
                                '\treturn (f - 32) * 5/9', '', 'temp = float(input("Enter the temperature in Farenheit: "))', 'print(farenheit_to_celsius(temp))'
        ]} />
    </>
}