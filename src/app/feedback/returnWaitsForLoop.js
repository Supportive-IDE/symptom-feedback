import { findAndConvertUrlParam } from "../../utils";
import CodeBlock from "../codeBlock";
import CodeInline from "../codeInline";
import { LINE_NUMBER } from "../config";
import MiniIDE from "../miniIDE";

export default function ReturnWaitsForLoop({misconInfo}) {
    const lineNumber = misconInfo.has(LINE_NUMBER) ? Number(misconInfo.get(LINE_NUMBER)) : -1;
    const EXHAUSTIVE = "allBranchesOfExhaustiveConditional";
    const loopDefinition = findAndConvertUrlParam(misconInfo, "text");
    const loopType = <CodeInline code={findAndConvertUrlParam(misconInfo, "loopType")} />
    const returnCount = Number(findAndConvertUrlParam(misconInfo, "returnCount"));
    const isExhaustive = findAndConvertUrlParam(misconInfo, "exitLevel") === EXHAUSTIVE;

    const overview = () => {
        if (isExhaustive) {
            return <>
                <p>The code in the {loopType} loop beginning on line {lineNumber} will only run once. This is because the loop 
                    contains an <CodeInline code="if..." /> block that has a <CodeInline code="return" /> in 
                    every branch. The <CodeInline code="if..." /> block has a branch for all possible conditions, so 
                    Python will always reach a <CodeInline code="return" /> the first time the loop runs.
                </p>
                <p>To fix this, you might be able to remove the <CodeInline code="else" /> branch and replace it 
                with a <CodeInline code="return" /> outside the loop.</p>
                <p>Here is an example:</p>
                <CodeBlock code={[
                    'def contains_a(name):', '\t # Incorrect', '\tfor letter in name:', '\t\tif letter == "a" or letter == "A":', 
                    '\t\t\treturn True', '\t\telse:', '\t\t\treturn False', '', 'def contains_b(name):', '\t # Correct', 
                    '\tfor letter in name:', '\t\tif letter == "b" or letter == "B":', 
                    '\t\t\treturn True', '\treturn False'
                ]} />
            </>
        }
        return <>
            <p>The <CodeInline code="return" /> on line {lineNumber} causes a {loopType} loop to only run once. This is because Python 
                will always reach the <CodeInline code="return" /> the first time the loop runs.
            </p>
            <p>How to fix this depends on what you are trying to do. If the function should not <CodeInline code="return" /> until 
            after the loop has finished, move <CodeInline code="return" /> outside the loop.</p>
            <p>Here is an example:</p>
            <CodeBlock code={[
                'def contains_a(name):', '\t # Incorrect', '\tfor letter in name:', '\t\tif letter == "a" or letter == "A":', 
                '\t\t\treturn True', '\t\treturn False # This line will always run', '', 'def contains_b(name):', '\t # Correct', 
                '\tfor letter in name:', '\t\tif letter == "b" or letter == "B":', 
                '\t\t\treturn True', '\treturn False'
            ]} />
        </>
    }

    return <>
        <h1>Return statements cause a loop to end</h1>
        {overview()}
        <h2>An example</h2>

        <p>Run the code below. The output shows that only the first item in the list passed to <CodeInline code="under_ten()" /> is checked:</p>
        <MiniIDE startingCode={['def under_ten(ages):', '\t # Incorrect', '\tfor age in ages:', '\t\tprint("Checking age:", age)', '\t\tif age < 10:', 
                    '\t\t\treturn True', '\t\telse:', '\t\t\treturn False', '', 'result = under_ten([18, 9, 12, 11])', 'print("An age less than 10 was found:", result)']} />
        <p>The <CodeInline code="return" /> on line 8 causes the function to end before it checks all values in the list. To fix this, 
        we can move the second <CodeInline code="return" /> outside the <CodeInline code="for" /> loop:</p>
        <MiniIDE startingCode={['def under_ten(ages):', '\t # Incorrect', '\tfor age in ages:', '\t\tprint("Checking age:", age)', '\t\tif age < 10:', 
                    '\t\t\treturn True', '\treturn False', '', 'result = under_ten([18, 9, 12, 11])', 'print("An age less than 10 was found:", result)']} />
        <p>Now the loop can continue until it finds a number under 10 or it has checked all numbers.</p>

    </>
}