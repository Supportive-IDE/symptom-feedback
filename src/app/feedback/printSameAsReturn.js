import { findAndConvertUrlParam } from "@/utils";
import { LINE_NUMBER } from "../config";
import MiniIDE from "../miniIDE";
/** URL params */
const expressionNoValueType = "expressionNoValueType";
const expressionNoValueUsage = "expressionNoValueUsage";
const expressionNoValueText = "expressionNoValueText";
const expressionNoValueTarget = "expressionNoValueTarget";
const isFuncPrintNoReturn = "isFuncPrintNoReturn";

/** PrintSameAsReturn option constants */
// How is the "None" type used?
const usage = {
    assignment: "assignment",
    print: "print",
    functionArgument: "functionArgument",
    comparison: "comparison",
    calculation: "calculation",
    return: "return"
}

// What is the category of the expression with no value?
const expressionType = {
    variable: "userDefinedVariable",
    userDefinedFunction: "userDefinedFunction",
    builtInFunction: "builtInFunction"
}

class PrintReturn {
    lineNumber;
    type;
    usage;
    text;
    target;
    isFuncPrintNoReturn;

    constructor(searchParams) {
        this.lineNumber = searchParams.has(LINE_NUMBER) ? Number(searchParams.get(LINE_NUMBER)): -1;
        this.type = findAndConvertUrlParam(searchParams, expressionNoValueType);
        this.usage = findAndConvertUrlParam(searchParams, expressionNoValueUsage);
        this.text = findAndConvertUrlParam(searchParams, expressionNoValueText);
        this.target = findAndConvertUrlParam(searchParams, expressionNoValueTarget);
        this.isFuncPrintNoReturn = searchParams.has(isFuncPrintNoReturn);
    }

    noValueIsPrintFunction() {
        return this.type === expressionType.builtInFunction && this.text.indexOf("print(") === 0;
    }
}

export default function PrintSameAsReturn({misconInfo}) {
    const printReturn = new PrintReturn(misconInfo);

    const getDetail = () => {
        switch (printReturn.usage) {
            case usage.print:
                return <>Passing <code>{printReturn.text}</code> to the <code>print()</code> function will print <code>None</code> in the terminal.</>
            case usage.assignment:
                return <>As a result, the value of <code>{printReturn.text}</code> will be <code>None</code>.</>
            case usage.functionArgument:
                return <>As a result, the value of the argument that <code>{printReturn.text}</code> is passed to will be <code>None</code>.</>
            default:
                return <>This means the value of <code>{printReturn.text}</code> will be <code>None</code>.</>
        }
    }

    const getBuiltInHelp = () => {
        if (printReturn.text.indexOf("print(") === 0) {
            const extra = <>If you would like to save the message as a variable and print it, try assigning the message to <code>{printReturn.target}</code> then printing <code>{printReturn.target}</code> on a later line.</>
            const starter = <p>The <code>print()</code> function prints a message to the terminal but it does not have a value. {getDetail()}{printReturn.type === "assignment" ? extra: ""}</p>
            return starter;
        }
        return <p>The built-in function <code>{printReturn.text.split("(")[0]}</code> does not return a value. {getDetail()}</p>
    }

    const getUDFHelp = () => {
        if (printReturn.isFuncPrintNoReturn) {
            const funcName = printReturn.text.split("(")[0];
            return <p><code>{funcName}</code> prints a message to the terminal but it does not return a value. {getDetail()}</p>
        }
        return <p>{getDetail()}</p>
    }

    const casePrintAssigned = () => {
        return <>
            <p>Currently, <code>print()</code> is assigned to a variable, <code>{printReturn.target}</code>. If you would like <code>{printReturn.target}</code> to 
            store the text you have passed to <code>print()</code>, assign the text to <code>{printReturn.target}</code> in a separate statement e.g.:</p>
            <pre>{printReturn.target} = &quot;Your text&quot;</pre>
            <p>If you would also like to print the text to the terminal, you can print the variable on another line e.g.:</p>
            <pre>print({printReturn.target})</pre>
            <p>If you just want to print the text and don&apos;t need to store it, you can pass it directly to <code>print()</code> without 
            assigning a variable:</p>
            <pre>print(&quot;Your text&quot;)</pre>
            <h2>More detail</h2>
            <p>Run the code below:</p>
            <MiniIDE startingCode={`${printReturn.target} = print("Hello, World!")\nprint(${printReturn.target})`} />
            <p>Notice that the code above produces two lines of output: the text passed to <code>print()</code> and <code>None</code>. 
            The first line is printed by the call to <code>print()</code> on line 1. The second line is produced by the code on line 2, which prints the 
            value of the variable <code>{printReturn.target}</code>. This variable will always have the value <code>None</code> no matter what text is passed to <code>print()</code>. 
            This is because <code>print()</code> does not actually return a value, even though you can see its output in the terminal. Try changing the text 
            passed to <code>print()</code> in line 1 and running the code again. You will see that the second line of output in the terminal will still be <code>None</code>.</p>
            <p>Now run this revised code:</p>
            <MiniIDE startingCode={`${printReturn.target} = "Hello, World!"\nprint(${printReturn.target})`} />
            <p>You will see that it still prints the text to the terminal but it no longer produces the extra line, <code>None</code>.</p>
            <p>Lastly, if you don&apos;t need to save the text to use it elsewhere, you can just print the text directly. Run the code below. You will 
                see that it has the same output as the previous version.
            </p>
            <MiniIDE startingCode='print("Hello, World!")' />
        </>
    }

    const createInteractive = () => {
        if (printReturn.noValueIsPrintFunction()) {
            switch (printReturn.usage) {
                case usage.assignment:
                    return casePrintAssigned();
            }
        }
        return <p>This case isn&apos;t implemented yet</p>
    }

    return <>
        <h1>{printReturn.text} has no value</h1>
        {
            printReturn.type === expressionType.builtInFunction &&
                getBuiltInHelp()
                /**
                 * It's the print function - interactive example with matching structure
                 * - Assigned to a variable - group1/S075/HW1/bikes message=print() - done
                 * - Printed - seems unlikely - no example
                 * - Passed as an argument - interactive example
                 * - Comparison - interactive example
                 * - Calculation - interactive example
                 * - Return - interactive example - group2/S110/HW1/swimstats
                 * It's not the print function - direct the student to look up the function in the docs
                 */
        }
        {
            printReturn.type === expressionType.userDefinedFunction &&
                getUDFHelp()
                /**
                 * If isFuncPrintNoReturn - interactive example demonstrating the type of a demo function
                 * - Assigned
                 * - Printed
                 * - Passed
                 * - Comparison
                 * - Calculation
                 * - Return
                 */
        }
        <h2>How to fix this?</h2>
        { createInteractive() }
    </>
}