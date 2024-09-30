import { findAndConvertUrlParam } from "../../utils";
import CodeBlock from "../codeBlock";
import CodeInline from "../codeInline";
import { LINE_NUMBER } from "../config";
import MiniIDE from "../miniIDE";
import Repl from "../repl";

/*
argType: string,
    convertedType: string,
    convertedValue: string
*/
/** URL Params */
const argTypeParam = "argType";
const convertedTypeParam = "convertedType";
const convertedValueParam = "convertedValue";

const getArticle = val => {
    if (["a", "e", "i", "o", "u"].some(v => v === val.charAt(0))) {
        return "an";
    }
    return "a";
}



export default function TypeMustBeSpecified({misconInfo}) {
    const lineNumber = misconInfo.has(LINE_NUMBER) ? Number(misconInfo.get(LINE_NUMBER)) : -1;
    const argType = findAndConvertUrlParam(misconInfo, argTypeParam);
    const convertedType = findAndConvertUrlParam(misconInfo, convertedTypeParam);
    const convertedValue = findAndConvertUrlParam(misconInfo, convertedValueParam);
    const text = findAndConvertUrlParam(misconInfo, "text");
    return <>
        <h1>Unnecessary type conversion</h1>
        <p>On line {lineNumber}, a built-in type function is called 
        to convert <CodeInline code={convertedValue} /> to {getArticle(convertedType)} {convertedType}:</p>
        <CodeBlock code={text} />
        <p><CodeInline code={convertedValue} /> is already {getArticle(convertedType)} {convertedType} so it is not necessary to 
        convert it.</p>
        <h2>More detail</h2>
        <p>Python uses "dynamic typing" to figure out the data type of variables and other values. This means that, unlike many other 
            languages, the programmer does not need to specify the data type of a value.
        </p>
        <p>It is only necessary to use one of Python&apos;s type conversion functions (e.g. <CodeInline code="int()" />, <CodeInline code="float()" />, or <CodeInline code="str()" />) if 
        the data type needs to change.</p>
        <p>You should never need to use a type conversion function with a literal value. If you are unsure of the type of a variable or 
            a value returned by a function, you can use the Python <CodeInline code="type()" /> function to check it. The text area below 
            is running Python in interactive mode. Try calling the <CodeInline code="type()" /> function with different values. Some suggestions 
            are below the text area. To use interactive mode, type a line of Python code and press Enter.
        </p>
        <Repl />
        <p>Try each of the following in the textarea above:</p>
        <ul>
            <li><CodeInline code="type(10)" /></li>
            <li><CodeInline code="type(25.5)" /></li>
            <li><CodeInline code="type(False)" /></li>
            <li><CodeInline code="type('hello')" /></li>
            <li>Try creating a variable then check its type on the next line. Interactive mode will remember the value of the variable you create.</li>
        </ul>
        <p>Here is an example where it <em>is</em> necessary to convert the data type of a value:</p>
        <MiniIDE startingCode={['age = input("Enter your age: ")', 'dog_age = age * 7', 'print("You are", dog_age, "in dog years")']} />
        <p>If you run the code, you will see the age you enter at the prompt printed 7 times in a line, instead of the calculated age in 
            dog years. This occurs because the <CodeInline code="input()" /> function always returns a 
            string, even if the user enters a number. Multiplying a string by an integer, <CodeInline code="n" />, creates a new string with 
            the original string repeated <CodeInline code="n" /> times. This 
            can be fixed by using the <CodeInline code="int()" /> or <CodeInline code="float()" /> function to convert 
            the input string to a number:
        </p>
        <MiniIDE startingCode={['age = int(input("Enter your age: "))', 'dog_age = age * 7', 'print("You are", dog_age, "in dog years")']} />
    </>
}