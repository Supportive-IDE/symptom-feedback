import CodeInline from "../codeInline";
import CodeBlock from "../codeBlock";
import { LINE_NUMBER } from "../config";
import MiniIDE from "../miniIDE";
import { getParamValue } from "../../utils";

/** URL params */
const fullTextParam = "fullText";
const statementLineParam = "statementLine";

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
    const minSpaces = Math.min(...lines.slice(1).map(l => countSpaces(l)));
    const trimmed = lines.slice(1).map(l => l.substring(minSpaces));
    trimmed.unshift(lines[0]);
    return trimmed;
}

const getIfs = (lines, firstLine, ifLines) => {
    const filler = "    # code omitted"
    const ifs = [/*lines[0], filler*/];
    for (const ifNum of ifLines) {
        const i = Number(ifNum) - firstLine;
        ifs.push(lines[i], filler);
    }
    return ifs;
}

export default function ConditionalIsSequence({misconInfo}) {

    const lineNumber = misconInfo.has(LINE_NUMBER) ? Number(misconInfo.get(LINE_NUMBER)) : -1;
    const fullText = getParamValue(fullTextParam, "", misconInfo);
    const fullTextFormatted = trimSpaces(fullText);
    const ifStatementLineNumbers = misconInfo.getAll(statementLineParam); // will be strings
    const ifs = getIfs(fullTextFormatted, lineNumber, ifStatementLineNumbers);
    return <>
        <h1>Sequence of <CodeInline code="if" /> statements</h1>
        <p>There is a sequence of similar <CodeInline code="if" /> statements starting on line {lineNumber}:</p>
        <CodeBlock code={ifs} />
        <p>If only one of these statements should run, use <CodeInline code="elif" /> instead of <CodeInline code="if" /> for the 
       statements after the first <CodeInline code="if" />.</p>
       <h2>Why does it matter?</h2>
       <p>The first line of an <CodeInline code="if" /> is always executed. When only one branch in a sequence should run, use <CodeInline code="elif" /> instead 
        of <CodeInline code="if" /> for all branches after the first <CodeInline code="if" />. This is more efficient because Python will skip the rest of the 
        branches once a match is found. It will also ensure that only one branch of code can execute 
        if the conditions overlap.</p>
       <p>If it should be 
        possible for more than one branch to run, leave the <CodeInline code="if" /> statements as they are.</p>
       <p>In the following code, both <CodeInline code="if" /> statements will execute because both 
        conditions are <CodeInline code="True" />.</p>
        <MiniIDE startingCode={["test = 4", "if test < 5:", '\tprint("smaller than 5")', 'if test < 10:', '\tprint("smaller than 10")']} />
        <p>In this revised version, only one branch will execute because the second <CodeInline code="if" /> has 
        been replaced with <CodeInline code="elif" />. Try running this code with different values of <CodeInline code="test" /> e.g. 4, 7, 10.</p>
        <MiniIDE startingCode={["test = 4", "if test < 5:", '\tprint("smaller than 5")', 'elif test < 10:', '\tprint("smaller than 10")']} />
    </>
}

// PRE-FEEDBACK STUDY IMPLEMENTATION
// import CodeInline from "../codeInline";
// import CodeBlock from "../codeBlock";
// import { LINE_NUMBER } from "../config";
// import MiniIDE from "../miniIDE";

// /** URL params */
// const fullTextParam = "fullText";
// const statementLineParam = "statementLine";

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
//     const minSpaces = Math.min(...lines.slice(1).map(l => countSpaces(l)));
//     const trimmed = lines.slice(1).map(l => l.substring(minSpaces));
//     trimmed.unshift(lines[0]);
//     return trimmed;
// }

// const getIfs = (lines, firstLine, ifLines) => {
//     const filler = "    # code omitted"
//     const ifs = [lines[0], filler];
//     for (const ifNum of ifLines) {
//         const i = Number(ifNum) - firstLine;
//         ifs.push(lines[i], filler);
//     }
//     return ifs;
// }

// export default function ConditionalIsSequence({misconInfo}) {

//     const lineNumber = misconInfo.has(LINE_NUMBER) ? Number(misconInfo.get(LINE_NUMBER)) : -1;
//     const fullText = misconInfo.has(fullTextParam) ? misconInfo.get(fullTextParam) : "";
//     const fullTextFormatted = trimSpaces(fullText);
//     const ifStatementLineNumbers = misconInfo.getAll(statementLineParam); // will be strings
//     const ifs = getIfs(fullTextFormatted, lineNumber, ifStatementLineNumbers);
//     return <>
//         <h1>Sequence of <CodeInline code="if" /> statements</h1>
//         <p>There is a sequence of <CodeInline code="if" /> statements beginning on line {lineNumber} that have similar formats:</p>
//         <CodeBlock code={ifs} />
//         <p>If only one of these statements should execute, then use <CodeInline code="elif" /> instead of <CodeInline code="if" /> for the 
//        statements after the first <CodeInline code="if" />.</p>
//        <h2>Why does it matter?</h2>
//        <p>When Python encounters a sequence of <CodeInline code="if" /> statements, as above, then it will run every <CodeInline code="if" /> statement 
//        to see if it is <CodeInline code="True" />. If only one of these <code>if</code> branches should execute, a better approach is to use <CodeInline code="elif" /> instead 
//         of <CodeInline code="if" /> for all branches after the first <CodeInline code="if" />. This is more efficient because the interpreter will skip the rest of the 
//         conditional statement once a match is found. It will also ensure that only one branch of code will execute 
//         if the conditions overlap. If, however, each <CodeInline code="if" /> is independent of the others and it should be 
//         possible for more than one branch to run, then leave the <CodeInline code="if" /> statements as they are.</p>
//        <p>In the following code, both <CodeInline code="if" /> statements will execute because both 
//         conditions are <CodeInline code="True" />.</p>
//         <MiniIDE startingCode={["test = 4", "if test < 5:", '\tprint("smaller than 5")', 'if test < 10:', '\tprint("smaller than 10")']} />
//         <p>In this revised version, only one branch will execute because the second <CodeInline code="if" /> has 
//         been replaced with <CodeInline code="elif" />. Try running this code with different values of <CodeInline code="test" /> e.g. 4, 7, 10.</p>
//         <MiniIDE startingCode={["test = 4", "if test < 5:", '\tprint("smaller than 5")', 'elif test < 10:', '\tprint("smaller than 10")']} />
//     </>
// }