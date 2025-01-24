import { getParamValue } from "../../utils";
import CodeBlock from "../codeBlock";
import CodeInline from "../codeInline";
import { LINE_NUMBER } from "../config";
import MiniIDE from "../miniIDE";

export default function LoopCounter({misconInfo}) {
    const lineNumber = misconInfo.has(LINE_NUMBER) ? Number(misconInfo.get(LINE_NUMBER)) : -1;
    const loopVariable = <CodeInline code={getParamValue("loopVarName", "", misconInfo)} />
    const forDefinition = getParamValue("definitionText", "", misconInfo);
    const modificationText = getParamValue("modificationText", "", misconInfo); 
    const loopVarTypeAtDefinition = getParamValue("loopVarTypeAtDefinition", "", misconInfo);

    const isCounting = forDefinition.search(/range[ ]*\(/) >= 0 || forDefinition.search(/enumerate[ ]*\(/) >= 0;


    const getCountingExample = () => {
        return <>
            <h2>Try it out</h2>
            <p>Python will automatically increase <CodeInline code="i" /> in this loop so the code on line 5 is not needed:</p>
            <MiniIDE startingCode={['total = 0', '', 'for i in range(10):', '\ttotal += i', '\ti += 1 # This is unnecessary', '', 'print(total)']} />
            <p>Here is an improved version without the extra line of code:</p>
            <MiniIDE startingCode={['total = 0', '', 'for i in range(10):', '\ttotal += i', '', 'print(total)']} />
            <p>If you run both examples, you will see the output is the same.</p>
        </>
    }

    const getNonCountingExample = () => {
        return <>
            <h2>Example - Changing all the items in a list</h2>
            <p>The purpose of the code below is to multiply each number in <CodeInline code="my_list" /> by 2. <CodeInline code="num" /> is the <CodeInline code="for" /> loop variable. Python will automatically give <CodeInline code="num" /> the value of an item in the list.</p>
            <MiniIDE startingCode={['my_list = [1, 2, 3]', '', '# Double each number in my_list', 'for num in my_list: # gets each item in the list', '\tnum = num * 2 # This will not work', '', 'print(my_list) # Should print [2, 4, 6]']} />
            <p>If you ran the code above, you will see that the output is wrong. The loop does not change <CodeInline code="my_list" />. This is because <CodeInline code="num" /> is not an actual item in the list. It just has 
            the same value. Changing <CodeInline code="num" /> on line 5 has no effect on the list.</p>
            <p>To change the item in the list, we need to use the right syntax to assign it a new value. We need to change the <CodeInline code="for" /> loop to count 
            the <em>index</em> of each item in the list:</p>
            <MiniIDE startingCode={['my_list = [1, 2, 3]', '', '# Double each number in my_list', 'for i in range(len(my_list)): # gets each index in the list', '\tmy_list[i] = my_list[i] * 2 # This will work', '', 'print(my_list) # Should print [2, 4, 6]']} />       
        </>
    }

    return <>
        <h1>Avoid changing the value of a <CodeInline code="for" /> loop variable</h1>
        <p>The &quot;loop variable&quot; in this <CodeInline code="for" /> loop is {loopVariable}:</p>
        <CodeBlock code={forDefinition} />
        <p>On line {lineNumber}, {loopVariable} is given a new value:</p>
        <CodeBlock code={modificationText} />
        <p>This change has no effect because the <CodeInline code="for" /> loop automatically sets the next value of {loopVariable} at the start of the next iteration.</p>
        {
            isCounting ?
                <>
                    <p>If you wanted to change {loopVariable} to move the <CodeInline code="for" /> loop to the next step, you can remove line {lineNumber}. Python will handle 
                    this for you.</p>
                    <p>Here is an example:</p>
                    <CodeBlock code={['for i in range(5):', '\tprint(i)', '\ti += 1 # This line is unnecessary', '', '# Better', 'for i in range(5):', '\tprint(i)']} />
                    { getCountingExample() }
                </>
                :
                <>
                    <p>How to fix this issue depends on what you are trying to do. You may be able to delete line {lineNumber} or you may need to try something different.</p>
                    { getNonCountingExample() }
                </>
        }
    </>
}