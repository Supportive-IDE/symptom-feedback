import CodeBlock from "../codeBlock";
import CodeInline from "../codeInline";
import MiniIDE from "../miniIDE";

/** URL params */
const textParam = "text";
const formParam = "form";
const varAssignedParam = "variableAssigned";

const formOption = {
    valueAssigned: "valueAssigned",
    valueReturned: "valueReturned"
}

const countSpaces = str => {
    let numSpaces = 0;
    for (let i = 0; i < str.length; i++) {
        if (str.charAt(i) === " ") {
            numSpaces++;
        } else {
            return numSpaces;
        }
    }
    return numSpaces;
}

const trimSpaces = text => {
    const lines = text.split("\n");
    console.log(lines);
    const minSpaces = Math.min(...lines.slice(1).map(l => countSpaces(l)));
    console.log(minSpaces);
    const trimmed = lines.slice(1).map(l => l.substring(minSpaces));
    trimmed.unshift(lines[0]);
    return trimmed;
}

export default function MapToBooleanWithIf({misconInfo}) {
    const text = misconInfo.has(textParam) ? misconInfo.get(textParam) : "";
    const textFormatted = trimSpaces(text);
    const form = misconInfo.has(formParam) ? misconInfo.get(formParam) : "";
    const varAssigned = misconInfo.has(varAssignedParam) ? misconInfo.get(varAssignedParam) : "the variable";
    return <>
        <h1>Conditional could be shortened to one line</h1>
        <p>This conditional could be replaced with a single line:</p>
        <CodeBlock code={textFormatted} />
        <p>If the boolean expression (an expression that is either true or false) in the <CodeInline code="if" /> statement is <CodeInline code="True"/>, {
            form === formOption.valueAssigned ? 
            <><CodeInline code={varAssigned} /> is set to <CodeInline code="True" />.</>
            :<>the function returns <CodeInline code="True" />.</>
        } If the boolean expression is <CodeInline code="False"/>, {
            form === formOption.valueAssigned ? 
            <><CodeInline code={varAssigned} /> is set to <CodeInline code="False" />.</>
            :<>the function returns <CodeInline code="False" />.</>
        } Because the value {form === formOption.valueAssigned ? "assigned": "returned"} is the same as the boolean expression, the boolean expression can be {form === formOption.valueAssigned ? "assigned": "returned"} directly without the conditional statement.</p>
        <h2>Example</h2>
        {
            form === formOption.valueAssigned ?
                <>
                    <p>After the conditional statement below, the value of <CodeInline code="is_tall_enough" /> will always be the same as the boolean expression <CodeInline code="height > 100" />.</p>
                    <MiniIDE startingCode={['height = int(input("Enter your height in CM: "))', 'if height > 100:', '\tis_tall_enough = True', 'else:', '\tis_tall_enough = False', 'print(is_tall_enough)']} />
                    <p>If you are not convinced, try adding some code to check if <CodeInline code="is_tall_enough" /> is equal to <CodeInline code="height > 100" />.</p>
                    <p>Because the value of <CodeInline code="is_tall_enough" /> will always be the same as the boolean expression, the conditional can be removed and <CodeInline code="is_tall_enough" /> can be 
                    directly assigned the boolean expression:</p>
                    <MiniIDE startingCode={['height = int(input("Enter your height in CM: "))', 'is_tall_enough = height > 100', 'print(is_tall_enough)']} />
                </>
                :
                <>
                    <p>The value returned by the conditional statement in <CodeInline code="check_height()" /> will always be the same as the boolean expression <CodeInline code="height_in_cm > 100" />.</p>
                    <MiniIDE startingCode={['def check_height(user_in):', '\theight_in_cm = int(user_in)', '\tif height_in_cm > 100:', '\t\treturn True', '\telse:', '\t\treturn False', '', 'height = int(input("Enter your height in CM: "))', 'print(check_height(height))']} />
                    <p>Because the value returned from the conditional statement will always be the same as the boolean expression, the conditional can be removed and the boolean expression can be 
                    returned directly:</p>
                    <MiniIDE startingCode={['def check_height(user_in):', '\theight_in_cm = int(user_in)', '\treturn height_in_cm > 100', '', 'height = int(input("Enter your height in CM: "))', 'print(check_height(height))']} />
                </>
        }
    </>
}


// import CodeBlock from "../codeBlock";
// import CodeInline from "../codeInline";
// import MiniIDE from "../miniIDE";

// /** URL params */
// const textParam = "text";
// const formParam = "form";
// const varAssignedParam = "variableAssigned";

// const formOption = {
//     valueAssigned: "valueAssigned",
//     valueReturned: "valueReturned"
// }

// const countSpaces = str => {
//     let numSpaces = 0;
//     for (let i = 0; i < str.length; i++) {
//         if (str.charAt(i) === " ") {
//             numSpaces++;
//         } else {
//             return numSpaces;
//         }
//     }
//     return numSpaces;
// }

// const trimSpaces = text => {
//     const lines = text.split("\n");
//     console.log(lines);
//     const minSpaces = Math.min(...lines.slice(1).map(l => countSpaces(l)));
//     console.log(minSpaces);
//     const trimmed = lines.slice(1).map(l => l.substring(minSpaces));
//     trimmed.unshift(lines[0]);
//     return trimmed;
// }

// export default function MapToBooleanWithIf({misconInfo}) {
//     const text = misconInfo.has(textParam) ? misconInfo.get(textParam) : "";
//     const textFormatted = trimSpaces(text);
//     const form = misconInfo.has(formParam) ? misconInfo.get(formParam) : "";
//     const varAssigned = misconInfo.has(varAssignedParam) ? misconInfo.get(varAssignedParam) : "the variable";
//     return <>
//         <h1>Conditional could be shortened to one line</h1>
//         <p>This conditional could be replaced with a single line:</p>
//         <CodeBlock code={textFormatted} />
//         <p>If the boolean expression (an expression that is either true or false) in the <CodeInline code="if" /> statement is <CodeInline code="True"/>, {
//             form === formOption.valueAssigned ? 
//             <><CodeInline code={varAssigned} /> is set to <CodeInline code="True" />.</>
//             :<>the function returns <CodeInline code="True" />.</>
//         } If the boolean expression is <CodeInline code="False"/>, {
//             form === formOption.valueAssigned ? 
//             <><CodeInline code={varAssigned} /> is set to <CodeInline code="False" />.</>
//             :<>the function returns <CodeInline code="False" />.</>
//         } Because the value {form === formOption.valueAssigned ? "assigned": "returned"} is the same as the boolean expression, the boolean expression can be {form === formOption.valueAssigned ? "assigned": "returned"} directly without the conditional statement.</p>
//         <h2>Example</h2>
//         {
//             form === formOption.valueAssigned ?
//                 <>
//                     <p>After the conditional statement below, the value of <CodeInline code="is_tall_enough" /> will always be the same as the boolean expression <CodeInline code="height > 100" />.</p>
//                     <MiniIDE startingCode={['height = int(input("Enter your height in CM: "))', 'if height > 100:', '\tis_tall_enough = True', 'else:', '\tis_tall_enough = False', 'print(is_tall_enough)']} />
//                     <p>If you are not convinced, try adding some code to check if <CodeInline code="is_tall_enough" /> is equal to <CodeInline code="height > 100" />.</p>
//                     <p>Because the value of <CodeInline code="is_tall_enough" /> will always be the same as the boolean expression, the conditional can be removed and <CodeInline code="is_tall_enough" /> can be 
//                     directly assigned the boolean expression:</p>
//                     <MiniIDE startingCode={['height = int(input("Enter your height in CM: "))', 'is_tall_enough = height > 100', 'print(is_tall_enough)']} />
//                 </>
//                 :
//                 <>
//                     <p>The value returned by the conditional statement in <CodeInline code="check_height()" /> will always be the same as the boolean expression <CodeInline code="height_in_cm > 100" />.</p>
//                     <MiniIDE startingCode={['def check_height(user_in):', '\theight_in_cm = int(user_in)', '\tif height_in_cm > 100:', '\t\treturn True', '\telse:', '\t\treturn False', '', 'height = int(input("Enter your height in CM: "))', 'print(check_height(height))']} />
//                     <p>Because the value returned from the conditional statement will always be the same as the boolean expression, the conditional can be removed and the boolean expression can be 
//                     returned directly:</p>
//                     <MiniIDE startingCode={['def check_height(user_in):', '\theight_in_cm = int(user_in)', '\treturn height_in_cm > 100', '', 'height = int(input("Enter your height in CM: "))', 'print(check_height(height))']} />
//                 </>
//         }
//     </>
// }