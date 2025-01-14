import CodeInline from "../codeInline";
import { LINE_NUMBER } from "../config";
import MiniIDE from "../miniIDE";

export default function DeferredReturn({misconInfo}) {
    const lineNumber = misconInfo.has(LINE_NUMBER) ? Number(misconInfo.get(LINE_NUMBER)) : -1;
    return <>
        <h1>Unreachable code</h1>
            <p>The code beginning on line {lineNumber} will never execute because it follows 
            a <CodeInline code="return" /> statement. The Python interpreter will always exit a function 
            when it encounters <CodeInline code="return" />, skipping any code that follows 
            the <CodeInline code="return" /> in the same scope. If the code following <CodeInline code="return" /> is 
            needed, move it elsewhere (e.g. before the <CodeInline code="return" />). Otherwise, delete it or comment 
            it out.</p>
        <p>This issue is sometimes caused by an indentation mistake so check that the unreachable code is in the right place.</p>
        <h2>An example</h2>

        <p>Run the code below and notice how the second print statement never executes:</p>
        <MiniIDE startingCode={['def test():', '\tprint("First print")', '\treturn 1', '\tprint("Second print")', '', 'my_var = test()']} />
        <p>The second print statement will never be reached because Python will exit <CodeInline code="test()" /> as soon as 
        it encounters the <CodeInline code="return" /> statement.</p>
        <p>To fix this, we can move the second print statement before the <CodeInline code="return" />:</p>
        <MiniIDE startingCode={['def test():', '\tprint("First print")', '\tprint("Second print")', '\treturn 1', '', 'my_var = test()']} />

    </>
}
// PRE FEEDBACK STUDY IMPLEMENTATION
// import CodeInline from "../codeInline";
// import { LINE_NUMBER } from "../config";
// import MiniIDE from "../miniIDE";

// export default function DeferredReturn({misconInfo}) {
//     const lineNumber = misconInfo.has(LINE_NUMBER) ? Number(misconInfo.get(LINE_NUMBER)) : -1;
//     return <>
//         <h1>Unreachable code</h1>
//             <p>The code beginning on line {lineNumber} will never execute because it follows 
//             a <CodeInline code="return" /> statement. The Python interpreter will always exit a function 
//             when it encounters <CodeInline code="return" />, skipping any code that follows 
//             the <CodeInline code="return" /> in the same scope. If the code following <CodeInline code="return" /> is 
//             needed, move it elsewhere (e.g. before the <CodeInline code="return" />). Otherwise, delete it or comment 
//             it out.</p>
//         <p>This issue is sometimes caused by an indentation mistake so check that the unreachable code is in the right place.</p>
//         <h2>An example</h2>

//         <p>Run the code below and notice how the second print statement never executes:</p>
//         <MiniIDE startingCode={['def test():', '\tprint("First print")', '\treturn 1', '\tprint("Second print")', '', 'my_var = test()']} />
//         <p>The second print statement will never be reached because Python will exit <CodeInline code="test()" /> as soon as 
//         it encounters the <CodeInline code="return" /> statement.</p>
//         <p>To fix this, we can move the second print statement before the <CodeInline code="return" />:</p>
//         <MiniIDE startingCode={['def test():', '\tprint("First print")', '\tprint("Second print")', '\treturn 1', '', 'my_var = test()']} />

//     </>
// }