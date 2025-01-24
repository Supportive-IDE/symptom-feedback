import { getParamValue } from "../../utils";
import CodeBlock from "../codeBlock";
import CodeInline from "../codeInline";
import { LINE_NUMBER } from "../config";
import MiniIDE from "../miniIDE";

export default function ForLoopVarIsLocal({misconInfo}) {
    const lineNumber = misconInfo.has(LINE_NUMBER) ? Number(misconInfo.get(LINE_NUMBER)) : -1;
    let loopVariable = getParamValue("loopVariable", "", misconInfo);
    loopVariable = loopVariable !== "" ? <CodeInline code={loopVariable} /> : "the loop variable";
    const forDefinition = misconInfo.has("forDefinition") ? misconInfo.get("forDefinition") : "";
    const overwrittenVarLine = misconInfo.has("overwrittenVarLine") ? Number(misconInfo.get("overwrittenVarLine")) : -1;
    const overwrttenIsDefinition = misconInfo.has("overwrittenIsDefinition") ? misconInfo.get("overwrittenIsDefinition") == "true" : false;

    if (overwrttenIsDefinition) {
        return <>
            <h1>For loop variables don&apos;t need to be defined outside the loop</h1>
            <p>The &quot;loop variable&quot; in this <CodeInline code="for" /> loop is {loopVariable}:</p>
            <CodeBlock code={forDefinition} />
            <p>The value of a <CodeInline code="for" /> loop variable is set by the <CodeInline code="for" /> loop. This means you do not 
            need to define {loopVariable} on line {overwrittenVarLine}.</p>
            <h2>Try it out</h2>
            <p>In this example, the <CodeInline code="for" /> loop variable, <CodeInline code="i" />, is defined before the loop 
            on line 1.</p>
            <MiniIDE startingCode={['i = 0 # This definition is not needed', '', 'for i in range(3):', '\tprint(i)']} />
            <p>Here is the same example without the extra definition. Run the code. You will see it produces the same output as before.</p>
            <MiniIDE startingCode={['# Better', '', 'for i in range(3):', '\tprint(i)']} />
        </>
    } else {
        return <>
            <h1>A for loop changes the value of an existing variable</h1>
            <p>The &quot;loop variable&quot; in this <CodeInline code="for" /> loop is {loopVariable}:</p>
            <CodeBlock code={forDefinition} />
            <p>Your code already contains a variable called {loopVariable}. Its value was last set on line {overwrittenVarLine}. The 
            <CodeInline code="for" /> loop will change the value of the existing variable. If this is not your intention, give 
            the <CodeInline code="for" /> loop variable a unique name.
            </p>
            <h2>Try it out</h2>
            <p>In this example, <CodeInline code="i" /> is set to 200 on line 2. The <CodeInline code="for" /> loop changes the value 
            of <CodeInline code="i" /> on each iteration. Run the code and notice that <CodeInline code="i" /> is 2 after the loop.</p>
            <MiniIDE startingCode={['# Before', 'i = 200', '', 'for i in range(3):', '\tprint(i)', '', 'print("i is", i, "after the loop")']} />
            <p>Changing the name of the loop variable leaves the value of <CodeInline code="i" /> unchanged:</p>
            <MiniIDE startingCode={['# After', 'i = 200', '', 'for u in range(3):', '\tprint(u)', '', 'print("i is", i, "after the loop")']} />
        </>
    }

}