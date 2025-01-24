import { findAndConvertUrlParam } from "../../utils";
import CodeBlock from "../codeBlock";
import CodeInline from "../codeInline";
import { LINE_NUMBER } from "../config";
import MiniIDE from "../miniIDE";

const textParam = "text";
const unusedMethodParam = "unusedMethod";
const unusedReturnTypeParam = "unusedReturnType";
const stringValueParam = "stringValue";

export default function StringMethodsModifyTheString({misconInfo}) {
    const lineNumber = misconInfo.has(LINE_NUMBER) ? Number(misconInfo.get(LINE_NUMBER)) : -1;
    const fullText = findAndConvertUrlParam(misconInfo, textParam);
    const unusedMethod = <CodeInline code={findAndConvertUrlParam(misconInfo, unusedMethodParam) + "()"} />;
    const unusedReturnType = findAndConvertUrlParam(misconInfo, unusedReturnTypeParam);
    const stringValue = <CodeInline code={findAndConvertUrlParam(misconInfo, stringValueParam)} />;
    

    return <>
        <h1>String methods don&apos;t change the string</h1>
        <p>The code on line {lineNumber} calls the {unusedMethod} method on {stringValue}:</p>
        <CodeBlock code={fullText} />
        <p>String methods like {unusedMethod} do not change the string. They return a new value instead. This means the code above 
            will not change {stringValue}.
        </p>
        <p>Save the new {unusedReturnType} created by {unusedMethod} to a variable. You can create a new variable or reuse {stringValue}.</p>
        <CodeBlock code={['test = "abc"', '', 'test.upper() # This code does not change test', 
                            'new_var = test.upper() # Creates a new variable with the value "ABC"', 
                            'test = test.upper() # Changes the value of test to "ABC"']} />
        <h2>Try it out</h2>
        <p>The <CodeInline code={"swapcase()"} /> method swaps the case of each letter in a string. In this code, the method has no 
        effect because it is not saved to a variable:</p>
        <MiniIDE startingCode={['my_string = "Hello, World!"', ' ', 'my_string.swapcase() # This code has no effect', 'print(my_string)']} />
        <p>Assigning the result of <CodeInline code="swapcase()" /> to <CodeInline code="my_string" /> fixes the issue:</p>
        <MiniIDE startingCode={['my_string = "Hello, World!"', ' ', 'my_string = my_string.swapcase() # Saves the result of swapcase()', 'print(my_string)']} />

    </>
}