import { findAndConvertUrlParam } from "@/utils";
import { ASSIGNED_NONE, LINE_NUMBER, UNUSED_RETURN } from "../config";
import MiniIDE from "../miniIDE";
import CodeBlock from "../codeBlock";
import CodeInline from "../codeInline";
/** URL params */
const variant = "variant";
const expressionNoValueType = "expressionNoValueType";
const expressionNoValueUsage = "expressionNoValueUsage";
const expressionNoValueText = "expressionNoValueText";
const expressionNoValueTarget = "expressionNoValueTarget";
const isFuncPrintNoReturn = "isFuncPrintNoReturn";
const expressionUnusedType = "expressionUnusedType";
const expressionUnusedText = "expressionUnusedText";
const isFuncPrintsAndReturns = "isFuncPrintsAndReturns";


/** PrintSameAsReturn option constants */
// How is the "None" type used? AssignedNone only
const usage = {
    assignment: "assignment",
    print: "print",
    functionArgument: "functionArgument",
    comparison: "comparison",
    calculation: "calculation",
    return: "return"
}

// What is the category of the expression with no value? Both types
const expressionType = {
    variable: "userDefinedVariable",
    userDefinedFunction: "userDefinedFunction",
    builtInFunction: "builtInFunction"
}

const printReturnFactory = searchParams => {
    const v = findAndConvertUrlParam(searchParams, variant);
    const lineNumber = searchParams.has(LINE_NUMBER) ? Number(searchParams.get(LINE_NUMBER)): -1;
    switch (v) {
        case "AssignedNoReturn":
            const assignedNoneType = findAndConvertUrlParam(searchParams, expressionNoValueType);
            const assignedNoneText = findAndConvertUrlParam(searchParams, expressionNoValueText);
            const assignedNoneUsage = findAndConvertUrlParam(searchParams, expressionNoValueUsage);
            const assignedNoneTarget = findAndConvertUrlParam(searchParams, expressionNoValueTarget);
            const funcPrints = searchParams.has(isFuncPrintNoReturn);
            return new PrintReturnAssignedNone(lineNumber, assignedNoneType, assignedNoneText, assignedNoneUsage, assignedNoneTarget, funcPrints);
        case UNUSED_RETURN:
            const unusedType = findAndConvertUrlParam(searchParams, expressionUnusedType);
            const unusedText = findAndConvertUrlParam(searchParams, expressionUnusedText);
            const isPrintsAndReturns = searchParams.has(isFuncPrintsAndReturns);
            return new PrintReturnUnusedReturn(lineNumber, unusedType, unusedText, isPrintsAndReturns);
        default:
            return new PrintReturn(lineNumber, "", ""); // create generic PrintReturn
    }
}


class PrintReturn {
    lineNumber;
    expressionType; // assignedNoneType or unusedType
    expressionText; // assignedNoneText or unusedText


    constructor(lineNumber, expressionType, expressionText) {
        this.lineNumber = lineNumber;
        this.expressionType = expressionType;
        this.expressionText = expressionText;
    }

    createHeading() {
        return <h1>Printing a value is different from returning a value</h1>
    }

    createHelpSummary() {
        return <p>Something useful but generic here!</p>
    }

    createInteractive() {
        return <p>Something useful but generic here!</p>
    }
}

class PrintReturnAssignedNone extends PrintReturn {
    assignedNoneUsage;
    assignedNoneTarget;
    funcPrints;

    constructor(lineNumber, assignedNoneType, assignedNoneText, assignedNoneUsage, assignedNoneTarget, funcPrints) {
        super(lineNumber, assignedNoneType, assignedNoneText);
        this.assignedNoneUsage = assignedNoneUsage;
        this.assignedNoneTarget = assignedNoneTarget;
        this.funcPrints = funcPrints;
    }

    createHeading() {
        return <h1><CodeInline code={this.expressionText} /> has no value</h1>
    }

    #isPrint() {
        return this.expressionText.indexOf("print(") === 0;
    }

    createHelpSummary() {
        if (this.#isPrint()) {
            const extra = <>If you would like to save the message as a variable and print it, try assigning the message to <CodeInline code={this.assignedNoneTarget} /> then printing <CodeInline code={this.assignedNoneTarget} /> on a later line.</>
            const starter = <p>The <CodeInline code="print()" /> function prints a message to the terminal but it does not have a value. {this.#getDetail()}{this.expressionType === "assignment" && this.assignedNoneTarget ? extra: ""}</p>
            return starter;
        } else if (this.funcPrints) {
            return <p><CodeInline code={this.expressionText.split("(")[0] + "()"} /> prints a message to the terminal but does not return a value. {this.#getDetail()}</p>
        }
        return <p><CodeInline code={this.expressionText.split("(")[0]} /> does not return a value. {this.#getDetail()}</p>
    }

    #getDetail() {
        switch (this.assignedNoneUsage) {
            case usage.print:
                const extraPrint = this.funcPrints ? <>The <CodeInline code={`${this.expressionText.split("(")[0]}()`} /> function already prints a value when it is called so there is no need to pass the function call to <CodeInline code="print()" />.</> : <></>
                return <>Passing <CodeInline code={this.expressionText} /> to the <CodeInline code="print()" /> function will print <CodeInline code="None" /> in the terminal. {extraPrint}</>
            case usage.assignment:
                const extraAssign = this.funcPrints ? <>If you were expecting {this.assignedNoneTarget !== "undefined" ? <CodeInline code={this.assignedNoneTarget} /> : "the variable"} to have the value currently printed to the terminal, then you 
                can modify <CodeInline code={`${this.expressionText.split("(")[0]}()`}/>  to return the value instead of printing it.</> : <></>
                return <>As a result, the value of <CodeInline code={this.expressionText} /> will be <CodeInline code="None" />, which means that {this.assignedNoneTarget !== "undefined" ? <CodeInline code={this.assignedNoneTarget} /> : "the variable it is assigned to"} will be <CodeInline code="None" /> too. {extraAssign}</>
            
            case usage.functionArgument:
                const extraPass = this.funcPrints ? <>If you were expecting {this.assignedNoneTarget !== "undefined" ? <CodeInline code={this.assignedNoneTarget} /> : "the argument"} to have the value currently printed to the terminal, then you 
                can modify <CodeInline code={`${this.expressionText.split("(")[0]}()`}/> to return the value instead of printing it.</> : <></>
                return <>As a result, the value of the argument that <CodeInline code={this.expressionText} /> is passed to will be <CodeInline code="None" />. {extraPass}</>
            case usage.return:
                return <>This means the value of <CodeInline code={this.expressionText} /> will be <CodeInline code="None" />, which in turn means the return statement that calls <CodeInline code={this.expressionText} /> will also have no value.</>
            default:
                return <>This means the value of <CodeInline code={this.expressionText} /> will be <CodeInline code="None" />.</>
        }
    }

    #casePrintAssigned() { 
        return <>
            <h2>How to fix this?</h2>
            <p>Currently, <CodeInline code="print()" /> is assigned to a variable, <CodeInline code={this.assignedNoneTarget} />. If you would like <CodeInline code={this.assignedNoneTarget} /> to 
            store the text you have passed to <CodeInline code="print()" />, assign the text to <CodeInline code={this.assignedNoneTarget} /> in a separate statement e.g.:</p>
            <CodeBlock code={`${this.assignedNoneTarget} = "Your text"`}></CodeBlock>
            <p>If you would also like to print the text to the terminal, you can print the variable on another line e.g.:</p>
            <CodeBlock code={`print(${this.assignedNoneTarget})`}></CodeBlock>
            <p>If you just want to print the text and don&apos;t need to store it, you can pass it directly to <CodeInline code="print()" /> without 
            assigning a variable:</p>
            <CodeBlock code={`print("Your text")`}></CodeBlock>
            <h2>More detail</h2>
            <p>Run the code below:</p>
            <MiniIDE startingCode={`${this.assignedNoneTarget} = print("Hello, World!")\nprint(${this.assignedNoneTarget})`} />
            <p>Notice that the code above produces two lines of output: the text passed to <CodeInline code="print()" /> and <CodeInline code="None" />. 
            The first line is printed by the call to <CodeInline code="print()" /> on line 1. The second line is produced by the code on line 2, which prints the 
            value of the variable <CodeInline code={this.assignedNoneTarget} />. This variable will always have the value <CodeInline code="None" />. no matter what text is passed to <CodeInline code="print()" />. 
            This is because <CodeInline code="print()" /> does not actually return a value, even though you can see its output in the terminal. Try changing the text 
            passed to <CodeInline code="print()" /> in line 1 and running the code again. You will see that the second line of output in the terminal will still be <CodeInline code="None" />.</p>
            <p>Now run this revised code:</p>
            <MiniIDE startingCode={`${this.assignedNoneTarget} = "Hello, World!"\nprint(${this.assignedNoneTarget})`} />
            <p>You will see that it still prints the text to the terminal but it no longer produces the extra line, <CodeInline code="None" />.</p>
            <p>Lastly, if you don&apos;t need to save the text to use it elsewhere, you can just print the text directly. Run the code below. You will 
                see that it has the same output as the previous version.
            </p>
            <MiniIDE startingCode='print("Hello, World!")' />
        </>
    }

    #caseNotPrintAssigned() {
        return <>
            <h2>How to fix this?</h2>
            <p>Currently, <CodeInline code={this.expressionText} /> is assigned to a variable, <CodeInline code={this.assignedNoneTarget} />. The value 
            of <CodeInline code={this.assignedNoneTarget} /> will always be <CodeInline code="None" /> because <CodeInline code={this.expressionText} /> does not 
            return a value. You have two choices: (1) modify <CodeInline code={`${this.expressionText.split("(")[0]}()`} /> so that 
            it returns a value, or (2) call <CodeInline code={`${this.expressionText.split("(")[0]}()`} /> without assigning it to a variable.</p>
            <p>Read and run the code below:</p>
            <MiniIDE startingCode={['def check_password_length(pwd):', '\tif len(pwd) < 5:', '\t\tprint("Too short!")', '\telse:', '\t\tprint("Valid length")', '', 'result = check_password_length("12345")','if not result:','\tprint("Your password is not valid")']} />
            <p>The <CodeInline code="check_password_length()" /> function checks if the supplied password is a valid length (at least 5 characters). It does not return anything 
            but it does print a message to the terminal. If you ran the code, you will see that two statements are printed: "Valid length" and "Your password is not valid". The 
            problem lies on line 7, where the function call is assigned to the variable <CodeInline code="result" />. The function has no return statement so the value 
            of <CodeInline code="result" /> will always be <CodeInline code="None" />. This causes the code in the if statement beginning on line 8 to run no matter what is passed 
            to the <CodeInline code="check_password_length()" /> function because Python will treat <CodeInline code="None" /> as equivalent to <CodeInline code="False" />.</p>
            <h3>Option 1</h3>
            <p>In this example, the best way to improve the code is to modify <CodeInline code="check_password_length()" /> to return a Boolean (<CodeInline code="True" /> or <CodeInline code="False" />) instead 
            of printing. The rest of the code can then decide what to print based on the value returned by the function:</p>
            <MiniIDE startingCode={['def check_password_length(pwd):', '\tif len(pwd) < 5:', '\t\treturn False', '\telse:', '\t\treturn True', '', 'result = check_password_length("12345")','if not result:','\tprint("Your password is not valid")']} />
            <h3>Option 2</h3>
            <p>Another way to improve the code is to keep the function as it was and call it without assigning it to a variable. The downside of this approach is that the result of the 
                length check cannot be used anywhere else in the code:
            </p>
            <MiniIDE startingCode={['def check_password_length(pwd):', '\tif len(pwd) < 5:', '\t\tprint("Too short!")', '\telse:', '\t\tprint("Valid length")', '', 'check_password_length("12345")']} />
        </>
    }

    #casePrintPassed() {
        return <>
            <h2>How to fix this?</h2>
            <p>If the printed text is needed by an argument in the function you have passed it to, pass just the text instead of 
                the <CodeInline code="print" /> function. If the text is not needed in the function, you may be able to remove 
                the argument. If you need to print the message as well as passing it to the function, you will need to print it 
                on a separate line of code.
            </p>
            <h2>More detail</h2>
            <p>Read the code below. The programmer&apos;s intention is to write a function that creates a greeting message. The 
                function is correct—it uses the argument, <CodeInline code="name" />, to create a string message and return it. However, 
                they have made a mistake when calling <CodeInline code="greeting()" /> on line 5.
            </p>
            <MiniIDE startingCode={['def greeting(name):', '\tmessage = "Hello, " + name', '\treturn message', '', 'greeting(print("Test"))']} />
            <p>If you run the code, you will see two lines of output: &quot;Test&quot; and an error message. The error message occurs because the 
                value passed to <CodeInline code="greeting()" /> becomes the value of the argument <CodeInline code="name" />. The programmer has 
                passed the built-in <CodeInline code="print()" /> function, which does not return a value. This means the value 
                of <CodeInline code="name" /> becomes <CodeInline code="None" />. On line 2, Python doesn&apos;t know how to combine a 
                string, <CodeInline code='"Hello, "' />, with <CodeInline code="None" />, which causes the error message.
            </p>
            <p>To fix the error message, the programmer should pass something with a value (specifically, a string) to <CodeInline code="greeting()" /> as 
            shown below:</p>
            <MiniIDE startingCode={['def greeting(name):', '\tmessage = "Hello, " + name', '\treturn message', '', 'greeting("Test")']} />
            <p>Now the code runs without error but it no longer prints the message returned by <CodeInline code="greeting()" />. The following 
            example shows how to test the function by printing the message it returns:</p>
            <MiniIDE startingCode={['def greeting(name):', '\tmessage = "Hello, " + name', '\treturn message', '', 'print(greeting("Test"))', 'print(greeting("Abc"))', 'print(greeting("friend"))']} />
        </>
    }

    #caseNotPrintPassed() {
        if (this.funcPrints) {
            return <>
                <h2>Example</h2>
                <p>Read and run the code below. Try entering a name in all lowercase:</p>
                <MiniIDE startingCode={[`def format_name(name):`, `\tprint(name.capitalize())`, '', 'def greeting(name):', '\tprint("Hello", name)', '', 'name = input("What\'s your name? ")', 'formatted = format_name(name)', 'greeting(formatted)']} />
                <p>The code produces two lines of output after the input prompt. First it prints the name entered by the user with the first letter capitalised. Then it prints "Hello None". The name is 
                    printed because <CodeInline code="format_name()" /> prints the formatted name on line 2. "Hello None" is printed by <CodeInline code="greeting()" /> on 
                    line 5. The name is "None" because <CodeInline code="formatted" /> is <CodeInline code="None" /> because <CodeInline code="format_name()" /> doesn&apos;t return anything.
                </p>
                <p>In this example, an appropriate fix is to modify <CodeInline code="format_name()" /> so that it returns the formatted name instead of printing it:</p>
                <MiniIDE startingCode={[`def format_name(name):`, `\treturn name.capitalize()`, '', 'def greeting(name):', '\tprint("Hello", name)', '', 'name = input("What\'s your name? ")', 'formatted = format_name(name)', 'greeting(formatted)']} />
            </>
        }
        return <></>
    }

    #casePrintComparison() {
        return <>
            <h2>How to fix this?</h2>
            <p>Try removing the <CodeInline code="print()" /> function from the comparison. For example, instead of:</p>
            <CodeBlock code={['name == print("Test")']} />
            <p>...try:</p>
            <CodeBlock code={['name == "Test"']} />
            <p>If you want to print the result of the comparison, try something like this:</p>
            <CodeBlock code={['print(name == "Test")']} />
        </>
    }

    #casePrintCalculation() {
        return <>
            <h2>How to fix this?</h2>
            <p>Try removing the <CodeInline code="print()" /> function and just using the value currently passed to <CodeInline code="print()" />. For example, instead of:</p>
            <CodeBlock code={['"Hello " + print(name)']} />
            <p>...try:</p>
            <CodeBlock code={['"Hello " + name']} />
            <p>If you want to print the result of the operation, try something like this:</p>
            <CodeBlock code={['print("Hello " + name)']} />
        </>
    }

    #casePrintReturn() {
        return <>
            <h2>How to fix this?</h2>
            <p>Separate printing and returning. If your function should <em>return</em> a value that can be used by code that calls your function then 
            you can remove the call to <CodeInline code="print()" /> and directly return the value currently passed to <CodeInline code="print()" />. If you 
            still want to print the returned value, you can call your function and pass the result to <CodeInline code="print()" /> elsewhere in your code.</p>
            <p>If your function just needs to print a message and does not need to return a value, then you can remove <CodeInline code="return" />.</p>
            <h2>More detail</h2>
            <p>A function that returns <CodeInline code="print()" /> will always return <code>None</code>, which can cause problems for the code that 
            calls the function. To see why, run the code below.</p>
            <MiniIDE startingCode={['def check_password_length(pwd):', '\tif len(pwd) < 8:', '\t\treturn print("invalid")', '\telse:', '\t\treturn print("valid")', '', 'result = check_password_length("123")','print("Your password choice is", result)']} />
            <p>This code prints two lines to the terminal. The first line is the message printed by one of the function&apos;s return statements and 
                the second line says &quot;Your password choice is None&quot;. You can probably guess that the purpose of the <CodeInline code="check_password_length()" /> function 
                is to check if a string is long enough to be a valid password, and that the programmer&apos;s intention was to print a message stating that 
                the chosen password is either invalid or valid. However, the function always returns <CodeInline code="print()" />, which has no value, so the 
                value assigned to <CodeInline code="result" /> on line 7 will be <CodeInline code="None" /> no matter what is passed to <CodeInline code='check_password_length()' />.
            </p>
            <p>This issue can be fixed by making sure the function always returns a value, rather than <CodeInline code="None" />. To do this, remove the call 
            to <CodeInline code="print()" /> from the return statements and return a string instead:</p>
            <MiniIDE startingCode={['def check_password_length(pwd):', '\tif len(pwd) < 8:', '\t\treturn "invalid"', '\telse:', '\t\treturn "valid"', '', 'result = check_password_length("123")','print("Your password choice is", result)']} />
        </>
    }

    #caseNoPrintReturn() {
        if (this.funcPrints && this.expressionText.indexOf("(") > 0) {
            return <>
                <h2>More detail</h2>
                <p><CodeInline code={`${this.expressionText.split("(")[0]}()`} /> prints but does not return a value. Consider modifying that function so that it returns 
                    a value instead of printing. If that is not appropriate in this case, consider whether the function that returns <CodeInline code={this.expressionText} /> actually 
                    needs to return something.</p>
            </>
        }
        return <></>
    }

    #casePrinted() {
        return <>
            <h2>How to fix this?</h2>
            <p>Call the function as a standalone expression, not from inside <CodeInline code="print()" />.</p>
            <p>Here is an example of code with a similar issue:</p>
            <MiniIDE startingCode={[`def greeting(name):`, `\tprint("Hello", name)`, '', 'print(greeting("Elmo"))']} />
            <p>Run the code. Notice that the output shows "Hello Elmo", which is printed by the <CodeInline code="greeting()" /> function. However, it also prints "None" on the next 
            line. This is caused by <CodeInline code="print()" /> on line 4. Because <CodeInline code="greeting()" /> doesn't return anything, the value passed to <CodeInline code="print()" /> on 
            line 4 is <CodeInline code="None" />.</p>
            <p>Fix the problem by removing the extra <CodeInline code="print()" /> on line 4:</p>
            <MiniIDE startingCode={[`def greeting(name):`, `\tprint("Hello", name)`, '', 'greeting("Elmo")']} />
            <p>Another option is to modify <CodeInline code="greeting()" /> so that it returns a value instead of printing. This would make the function more flexible and easier 
            to reuse:</p>
            <MiniIDE startingCode={[`def greeting(name):`, `\treturn "Hello " + name`, '', 'print(greeting("Elmo"))']} />
        </>
    }

    createInteractive() {
        if (this.#isPrint()) {
            switch (this.assignedNoneUsage) {
                case usage.assignment:
                    return this.#casePrintAssigned();
                case usage.functionArgument:
                    return this.#casePrintPassed();
                case usage.comparison:
                    return this.#casePrintComparison();
                case usage.calculation:
                    return this.#casePrintCalculation();
                case usage.return:
                    return this.#casePrintReturn();
            }
        } else {
            switch (this.assignedNoneUsage) {
                case usage.assignment:
                    return this.#caseNotPrintAssigned();
                case usage.print:
                    return this.#casePrinted();
                case usage.functionArgument:
                    return this.#caseNotPrintPassed();
                case usage.return:
                    return this.#caseNoPrintReturn();
            }
        }
        return <></>
    }

    /**
     * Built in
     * It's the print function - interactive example with matching structure
     * - Assigned to a variable - group1/S075/HW1/bikes message=print() - checked
     * - Printed - seems unlikely - no example - ignore
     * - Passed as an argument - interactive example - checked
     * - Comparison - interactive example - checked
     * - Calculation - interactive example - checked
     * - Return - interactive example - group2/S110/HW1/swimstats - checked
     * It's not the print function - direct the student to look up the function in the docs*/

    /* 
    UDF
    If isFuncPrintNoReturn - interactive example demonstrating the type of a demo function (function prints, doesn't return)
    * - Assigned - group3/S30/HW6/recipe - checked
    * - Printed - group1/S02/HW4/lightrail - checked, group1/S04/HW1/bikes - checked
    * - Passed - checked
    * - Comparison - group1/S02/HW4/lightrail - checked
    * - Calculation - checked
    * - Return - group2/S101/HW2/piglatin  - checked
    * If UDF doesn't print:
    *  - assigned - checked
    *  - printed - checked
    *  - passed - checked
    *  - comparison - checked
    *  - calculation - checked
    *  - return - checked
    * */
    
}

class PrintReturnUnusedReturn extends PrintReturn {
    isPrintsAndReturns;

    constructor(lineNumber, unusedType, unusedText, printsAndReturns) {
        super(lineNumber, unusedType, unusedText, printsAndReturns);
        this.isPrintsAndReturns = printsAndReturns;
    }

    createHeading() {
        return <h1>The return value of <CodeInline code={this.expressionText + "()"} /> is not used</h1>
    }

    createHelpSummary() {
        if (this.expressionType === expressionType.builtInFunction) {
            return <p><CodeInline code={this.expressionText + "()"} /> is a Python function that returns a value but, at the 
            moment, that value is not saved when the function is called, so the result of the call will be lost. Look up <CodeInline code={this.expressionText + "()"} /> in 
            the docs to see examples of how to use it.</p>
        } else if (this.isPrintsAndReturns) {
            return <p>The <CodeInline code={this.expressionText + "()"} /> function returns a value and prints to the terminal. If the return 
            value is not used by calling code, then the return statement can be deleted—the function will still print. If you would like to 
            print AND return, then it is better practice to print the returned value from outside the function.</p>
        }
        return <p>The <CodeInline code={this.expressionText + "()"} /> function returns a value but, at the 
            moment, that value is not saved when the function is called, so the result of the call will be lost.</p>
    }

    #printAndReturn() {
        return <>
            <h2>Example</h2>
            <p>Read the run the code below:</p>
            <MiniIDE startingCode={['def is_valid_password(pwd):','\tif len(pwd) > 3 and pwd != "123456":',
                                    '\t\tprint("Your password is valid!")','\t\treturn True','\telse:',
                                    '\t\tprint("Not a valid password!")','\t\treturn False','',
                                    'password = input("Choose a password: ")', 'is_valid_password(password)',
                                    'if not is_valid_password(password):','\tpassword = input("Please try again: ")']} />
            <p>Notice that <CodeInline code="is_valid_password()" /> prints a message to the terminal before returning a 
            value. The function is called on line 10 but the value is not saved to a variable, so it is lost. The function is called 
            again on line 11 but this time the return value is used in an if statement. If you run the code, you will see that 
            the same message is printed twice, once each time the function is called.</p>
            <p><CodeInline code="is_valid_password()" /> is trying to do two things at once: (1) print a message for 
            the user that lets them know if their chosen password is valid, and (2) return a value so that calling code can decide 
            whether to prompt the user to try again. The code can be improved by making sure <CodeInline code="is_valid_password()" /> only 
            does one thing. In this case, the best approach is to remove the print statement from the function. Calling code can then 
            decide what to print depending on the returned value:</p>
            <MiniIDE startingCode={['def is_valid_password(pwd):','\tif len(pwd) > 3 and pwd != "123456":',
                                    '\t\treturn True','\telse:',
                                    '\t\treturn False','',
                                    'password = input("Choose a password: ")', 'check = is_valid_password(password)',
                                    'if check:', '\tprint("Your password is valid!")',
                                    'else:','\tpassword = input("Not a valid password! Please try again: ")']} />
        </>
    }

    #onlyReturns() {
        return <>
            <h2>Example</h2>
            <p>Read the run the code below:</p>
            <MiniIDE startingCode={['def square(num):','\treturn num * num', '', 'square(2)']} />
            <p>The <CodeInline code="square()" /> function returns a number. The function is called on line 3, where 
            it is passed 2 as an argument. The result of the function call will be <CodeInline code="2 * 2" /> (4) but 
            the value is not saved so it is lost. A simple way to save the value is to assign it to a variable:</p>
            <MiniIDE startingCode={['def square(num):','\treturn num * num', '', 'my_var = square(2)']} />
        </>
    }

    createInteractive() {
        if (this.expressionType === expressionType.builtInFunction) {
            return <></>
        } else if (this.isPrintsAndReturns) {
            return this.#printAndReturn()
        }
        return this.#onlyReturns()
    }

    /**
     * Built in - no example
     * UDF - returns AND prints - group1/S007/HW2/palindrome - checked
     * UDF - returns NO print - group1/S007/HW4/lightrail
     */
}

export default function PrintSameAsReturn({misconInfo}) {
    const misconInstance = printReturnFactory(misconInfo);


    // const createInteractive = () => {
    //     if (printReturn.noValueIsPrintFunction()) {
    //         // switch (printReturn.assignedNoneUsage) {
    //         //     case usage.assignment:
    //         //         return casePrintAssigned();
    //         //     case usage.functionArgument:
    //         //         return casePrintPassed();
    //         //     case usage.comparison:
    //         //         return casePrintComparison();
    //         //     case usage.calculation:
    //         //         return casePrintCalculation();
    //         //     case usage.return:
    //         //         return casePrintReturn();
    //         // }
    //     } else if (printReturn.assignedNoneType === expressionType.builtInFunction && !printReturn.isFuncPrintNoReturn()) {
            
    //     } else if (printReturn.assignedNoneType === expressionType.userDefinedFunction && printReturn.isFuncPrintNoReturn()) {
    //         return <>Here?</>
    //     }
    //     return <></>
    // }

    return <>
        { misconInstance.createHeading() }
        { misconInstance.createHelpSummary() }
        {/*
            printReturn.isAssignedNone() && printReturn.assignedNoneType === expressionType.userDefinedFunction &&
                getUDFHelp()
                
                 
                 * Else - function prints AND returns?
                 * - Assigned
                 * - Printed
                 * - Passed
                 * - Comparison
                 * - Calculation
                 * - Return
                 * 
                 * No usage? 1/7/2/palindrome
                 */}
        { misconInstance.createInteractive() }
    </>
}