import { findAndConvertUrlParam } from "../../utils";
import CodeBlock from "../codeBlock";
import CodeInline from "../codeInline";
import { LINE_NUMBER } from "../config";
import MiniIDE from "../miniIDE";

const textParam = "text";
const typeFuncParam = "typeFunction";
const returnTypeParam = "returnType";
const argumentParam = "argument";

export default function TypeConversionModifiesArgument({misconInfo}) {
    const lineNumber = misconInfo.has(LINE_NUMBER) ? Number(misconInfo.get(LINE_NUMBER)) : -1;
    const fullText = findAndConvertUrlParam(misconInfo, textParam);

    const typeFunction = <CodeInline code={findAndConvertUrlParam(misconInfo, typeFuncParam) + "()"} />;
    const returnType = findAndConvertUrlParam(misconInfo, returnTypeParam);
    const argument = <CodeInline code={findAndConvertUrlParam(misconInfo, argumentParam)} />;
    

    return <>
        <h1>{typeFunction} won&apos;t change {argument}</h1>
        <p>The code on line {lineNumber} calls {typeFunction} on {argument}:</p>
        <CodeBlock code={fullText} />
        <p>Type conversion functions like {typeFunction} do not change the data type of the argument. They return a new value instead. This means the code above 
            will not change {argument}.
        </p>
        <p>Save the new {returnType} created by {typeFunction} to a variable. You can create a new variable or reuse {argument}.</p>
        <CodeBlock code={['test = "123"', '', 'int(test) # This code does not change test', 
                            'new_var = int(test) # Creates a new integer variable with the value 123', 
                            'test = int(test) # Changes test to an integer, 123']} />
        <h2>Try it out</h2>
        <p><CodeInline code={"float()"} /> converts the value of an argument to a float. In the code below, the function has no 
        effect because it is not saved to a variable:</p>
        <MiniIDE startingCode={['price = "12.99"', ' ', 'float(price) # This code has no effect', 'print("price is a", type(price)) # Prints the data type of price']} />
        <p>Assigning the result of <CodeInline code="float()" /> to <CodeInline code="price" /> fixes the issue:</p>
        <MiniIDE startingCode={['price = "12.99"', ' ', 'price = float(price) # Saves the result of float()', 'print("price is a", type(price)) # Prints the data type of price']} />

    </>
}