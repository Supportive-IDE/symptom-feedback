import { findAndConvertUrlParam, getParamValue } from "../../utils";
import { LINE_NUMBER } from "../config";
import MiniIDE from "../miniIDE";
import CodeInline from "../codeInline";
/** URL params */
const expressionUnusedType = "expressionUnusedType";
const expressionUnusedText = "expressionUnusedText";
const expressionReturnType = "returnType";


// What is the category of the expression with no value? Both types
const expressionType = {
    variable: "userDefinedVariable",
    userDefinedFunction: "userDefinedFunction",
    builtInFunction: "builtInFunction"
}

const createUnusedReturn = searchParams => {
    const lineNumber = searchParams.has(LINE_NUMBER) ? Number(searchParams.get(LINE_NUMBER)): -1;
    const unusedType = findAndConvertUrlParam(searchParams, expressionUnusedType);
    const unusedText = findAndConvertUrlParam(searchParams, expressionUnusedText);
    const returnType = getParamValue(expressionReturnType, "value", searchParams);
    return new UnusedReturnMiscon(lineNumber, unusedType, unusedText, returnType);
}

class UnusedReturnMiscon {
    lineNumber;
    unusedType; // assignedNoneType or unusedType
    unusedText; // assignedNoneText or unusedText
    returnType;


    constructor(lineNumber, unusedType, unusedText, returnType) {
        this.lineNumber = lineNumber;
        this.unusedType = unusedType;
        this.unusedText = unusedText;
        this.returnType = returnType;
    }

    createHeading() {
        return <h1>The {this.returnType} returned by <CodeInline code={this.unusedText + "()"} /> is not used</h1>
    }

    createHelpSummary() {
        if (this.unusedType === expressionType.builtInFunction) {
            return <><p><CodeInline code={this.unusedText + "()"} /> is a Python function that returns a {this.returnType}. When <CodeInline code={this.unusedText + "()"} /> is 
            called on line {this.lineNumber}, it&apos;s return value is not saved or used, so it will be lost. Look up <CodeInline code={this.unusedText + "()"} /> in 
            the docs to see examples of how to use it.</p>
            <p>One way to save the result of a function call is to assign it to a variable.</p></>
        } 
        return <><p>The <CodeInline code={this.unusedText + "()"} /> function returns a {this.returnType}. When <CodeInline code={this.unusedText + "()"} /> is 
            called on line {this.lineNumber}, it&apos;s return value is not saved or used, so it will be lost.</p>
            <p>One way to save the result of a function call is to assign it to a variable.</p></>
    }

    createInteractive() {
        return <>
            <h2>Example</h2>
            <p>Read the code below:</p>
            <MiniIDE startingCode={['def square(num):','\treturn num * num', '', 'square(2)']} />
            <p>The <CodeInline code="square()" /> function returns a number. The function is called on line 3, where 
            it is passed 2 as an argument. The result of the function call will be 4 (<CodeInline code="2 * 2" />) but 
            the value is not saved so it is lost. A simple way to save the value is to assign it to a variable:</p>
            <MiniIDE startingCode={['def square(num):','\treturn num * num', '', 'my_var = square(2)']} />
            <p>You can also pass the returned value to a function, such as <CodeInline code="print()" />:</p>
            <MiniIDE startingCode={['def square(num):','\treturn num * num', '', 'print(square(2))']} />
        </>
    }

}

export default function UnusedReturn({misconInfo}) {
    const unusedReturn = createUnusedReturn(misconInfo);

    return <>
        { unusedReturn.createHeading() }
        { unusedReturn.createHelpSummary() }
        { unusedReturn.createInteractive() }
    </>
}

