import CodeBlock from "../codeBlock";
import CodeInline from "../codeInline";
import { LINE_NUMBER } from "../config";
import MiniIDE from "../miniIDE";

export default function AssignCompares({misconInfo}) {
    const lineNumber = misconInfo.has(LINE_NUMBER) ? Number(misconInfo.get(LINE_NUMBER)) : -1;
    const parentText = misconInfo.has("parentText") ? misconInfo.get("parentText") : ""

    // CHECK TYPES OF EXPRESSION if, elif, while - create function to use appropriate wording e.g. AN if STATEMENT, vs A while LOOP
    return <>
        <h1>Use <CodeInline code="==" /> to check equality</h1>
        <p>It looks like you are checking if two or more values are equal on line {lineNumber}.</p>
        {
            parentText !== "" &&
                <CodeBlock code={parentText} />
        }
        <p>The code above will cause a <CodeInline code="SyntaxError" /> because you are using <CodeInline code="=" /> instead of <CodeInline code="==" />.</p>
        <p>Use <CodeInline code="==" /> to check if two values are equal.</p>
        <CodeBlock code={["day = 'Tuesday'", "", "# Incorrect", "if day = 'Saturday':", "\t# Code omitted", "", "# Correct", "if day == 'Saturday':", "\t# Code omitted"]} ></CodeBlock>
        <h2>Try it out</h2>
        <p><CodeInline code="=" /> is only used to assign a value to a variable. This means <CodeInline code="=" /> should never be used 
        in <CodeInline code="if" />, <CodeInline code="elif" />, <CodeInline code="while" />, or <CodeInline code="return" /> statements.</p>
        <p>The code below causes a <CodeInline code="SyntaxError" />:</p>
        <MiniIDE startingCode={['age = 9', '','# Incorrect syntax', 'if age = 10:', '\tprint("You are 10!")', 'else:', '\tprint("You are not 10")']} />
        <p>To fix the error, change <CodeInline code="=" /> to <CodeInline code="==" />:</p>
        <MiniIDE startingCode={['age = 9', '','# Correct syntax', 'if age == 10:', '\tprint("You are 10!")', 'else:', '\tprint("You are not 10")']} />
        
    </>
}