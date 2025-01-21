import CodeBlock from "../codeBlock";
import CodeInline from "../codeInline";
import { INVALID, LINE_NUMBER, NONE, NOT_PARSED, UNDEFINED, UNKNOWN, NA, VARIABLE_NAME, IF_DEFINITION_STATEMENT, ELIF_DEFINITION_STATEMENT, WHILE_DEFINITION_STATEMENT, ASSIGNMENT_STATEMENT, CHANGE_STATEMENT, BOOL } from "../config";
import MiniIDE from "../miniIDE";
import { findAndConvertUrlParam } from "../../utils";
import { Fragment } from "react";

/** URL params */
const booleanExpressionText = "booleanExpressionText";
const parentText = "parentText";
const parentEntity = "parentEntity";
const otherText = "otherText";
const otherEntity = "otherEntity";
const otherType = "otherType";
const operator = "operator";
const comparisonText = "comparisonText";

class CompareOr {
    lineNumber;
    booleanExpressionText;
    parentText;
    parentEntity;
    otherTexts;
    otherEntities;
    otherTypes;
    operators;
    comparisonTexts; 
    comparisonBaseList = []; // the variables that are on the left in the simplest form e.g. x in x == 5 or 6
    valueList = []; // the values to compare the base to e.g. 5 and 6 in x == 5 or 6
    containsComparison;

    constructor(searchParams) {
        this.lineNumber = searchParams.has(LINE_NUMBER) ? Number(searchParams.get(LINE_NUMBER)): -1;
        this.booleanExpressionText = findAndConvertUrlParam(searchParams, booleanExpressionText);
        this.parentText = findAndConvertUrlParam(searchParams, parentText);
        this.parentEntity = findAndConvertUrlParam(searchParams, parentEntity);
        this.otherTexts = searchParams.getAll(otherText);
        this.otherEntities = searchParams.getAll(otherEntity);
        this.otherTypes = searchParams.getAll(otherType);
        this.operators = searchParams.getAll(operator);
        this.comparisonTexts = searchParams.getAll(comparisonText);
        this.#populateLists();
    }


    /**
     * Count the number of variable entities that have any of the given types
     * @param {string[]} typeNames 
     * @returns {number}
     */
    countVariablesOfType(typeNames) {
        let count = 0;
        for (let i = 0; i < Math.min(this.otherEntities.length, this.otherTypes.length); i++) {
            if (this.otherEntities[i] === VARIABLE_NAME && typeNames.some(t => t === this.otherTypes[i])) {
                count++;
            }
        }
        return count;
    }

    /**
     * Count the number of occurrences of the given entity in the otherEntities array
     * @param {string[]} entityNames 
     * @returns {number}
     */
    countEntities(entityNames) {
        let count = 0;
        for (const otherEntity of this.otherEntities) {
            if (entityNames.some(t => t === otherEntity)) {
                count++;
            }
        }
        return count;
    }

    /**
     * Populates the comparison base and value lists
     * @returns {string[]}
     */
    #populateLists() {
        for (const comp of this.comparisonTexts) {
            const parts = comp.split(" ");
            if (parts.length < 3) {
                console.log("Expected at least three parts to a comparison and got", parts.length, ":", comp);
            } else {
                this.comparisonBaseList.push(parts[0]);
                this.valueList.push(parts[parts.length - 1]);
            }
        }
        for (const val of this.otherTexts) {
            this.valueList.push(val);
        }
    }

    containsLiteral() {
        return this.otherEntities.some(t => t.indexOf("Literal") >= 0);
    }

    containsVariable() {
        return this.otherEntities.some(t => t === VARIABLE_NAME);
    }

    isControlFlow() {
        switch (this.parentEntity) {
            case IF_DEFINITION_STATEMENT:
            case ELIF_DEFINITION_STATEMENT:
            case WHILE_DEFINITION_STATEMENT:
                return true;
            default:
                return false;
        }
    }

    isAssignment() {
        return this.parentEntity === ASSIGNMENT_STATEMENT || this.parentEntity === CHANGE_STATEMENT;
    }

    explainComparison() {
        if (this.comparisonTexts.length === 0) {
            return 
        }
    }
}

export default function CompareMultipleWithOr({misconInfo}) {
    const compareOr = new CompareOr(misconInfo);
    // const affectedExpressions = compareOr.nonBooleanTexts.length + (compareOr.leftSideText.length > 0 ? 1 : 0);

    /**
     * Helper function to determine if a letter is a vowel. Used by explainType to 
     * decide the article to use in front of the type (i.e. a or an)
     * @param {string} letter 
     * @returns {boolean}
     */
    const isAVowel = letter => ["a", "e", "i", "o", "u"].some(l => l === letter);
    
    /**
     * Forms text to explain the data type of an entity
     * @param {string} typeString 
     * @returns {string}
     */
    const explainType = typeString => {
        switch (typeString) {
            case NONE:
            case UNDEFINED:
                return "has no value";
            case UNKNOWN:
            case NA:
            case NOT_PARSED:
            case INVALID:
                return "may not be boolean";
            default:
                return isAVowel(typeString.charAt(0)) ? `is an ${typeString}` : `is a ${typeString}`;
        }
    };

    if (compareOr.booleanExpressionText === "" || compareOr.otherTexts.length === 0 || compareOr.operators.length === 0) {
        return <>
            <h1>Oops</h1>
            <p>There is not enough information about the issue to provide feedback.</p>
        </>
    }

    // New functions (after user study 1)
    const isEqualityCheck = text => text.indexOf("==") > 0 || (text.indexOf("is") > 0 && text.indexOf("is not") === -1);
    const isInequalityCheck = text => text.indexOf("1=") > 0 || text.indexOf("is not") > 0;
    const isLeftToRight = (text, operators) => {
        for (const op of operators) {
            const opIndex = text.indexOf(op);
            if (opIndex > -1 && opIndex < text.indexOf(" or ")) {
                return true;
            }
        }
        return false;
    }

    const createHeading = () => {
        if (compareOr.comparisonTexts.length === 1) {
            let explainComp = ""
            if (isEqualityCheck(compareOr.comparisonTexts[0])) {
                explainComp = " is equal to ";
            } else if (isInequalityCheck(compareOr.comparisonTexts[0])) {
                explainComp = " is not equal to ";
            }
            if (explainComp.length > 0) {
                if (isLeftToRight(compareOr.booleanExpressionText, explainComp == " is equal to " ? ["==", " is "] : ["!=", " is not "])) {
                    return <h1>Do you want to check if <CodeInline code={compareOr.comparisonBaseList[0]} />{explainComp}{
                        compareOr.valueList.map((t, i) => {
                            if (i < compareOr.valueList.length - 1) {
                                return <Fragment key={i}><CodeInline code={t}/>{compareOr.valueList.length > 1 ? ', ' : ''}</Fragment>
                            }
                            else {
                                return <Fragment key={i}>{compareOr.valueList.length > 1 ? 'or ' : ''}<CodeInline code={t}/></Fragment>
                            }
                        })
                    }?</h1>
                } else {
                    return <h1>Do you want to check if something{explainComp}multiple values?</h1>
                }
            }
        } else if (compareOr.comparisonTexts.length > 1) {
            let explainComp = "";
            if (compareOr.comparisonTexts.every(val => isEqualityCheck(val))) {
                explainComp = " are equal to ";
            } else if (compareOr.comparisonTexts.every(val => isInequalityCheck(val))) {
                explainComp = " are not equal to ";
            }
            if (explainComp.length > 0) {
                return <h1>Do you want to check if some values{explainComp}multiple other values?</h1>
            }
        } 
        return <h1>Do you want to compare something to multiple values?</h1>
    }

    /**
     * Creates the primary generic feedback that should always display
     * @returns 
     */
    const createOverviewFeedback = () => {
        return <>
            <p>Repeat the comparison for each value you want to check. For example, this is wrong:</p>
            <CodeBlock code={["# This statement will be True no matter the value of x", "x == 5 or 6"]}></CodeBlock>
            <p>...this is right:</p>
            <CodeBlock code={["# This statement will be True or False, depending on the value of x","x == 5 or x == 6"]}></CodeBlock>
        </>
    }

    /**
     * Creates the formatted display for the customised portion of the detailed explanation
     * @returns 
     */
    const createCustomExplanation = () => {
        const displayBooleanExpressions = [];
        const displayOtherExpressions = []
        // Format each part of the faulty expression for display
        for (const comp of compareOr.comparisonTexts) {
            displayBooleanExpressions.push(<CodeInline code={comp} />);
        }
        for (let i = 0; i < compareOr.otherTypes.length; i++) {
            if (compareOr.otherTypes[i] === BOOL) {
                displayBooleanExpressions.push(<CodeInline code={compareOr.otherTexts[i]} />);
            } else {
                displayOtherExpressions.push(<><CodeInline code={compareOr.otherTexts[i]} /> {explainType(compareOr.otherTypes[i])}</>)
            }
        }

        if (displayBooleanExpressions.length > 0) {
            return <>
                <p>In your code, these expressions are boolean:</p>
                <ul>
                    {
                        displayBooleanExpressions.map((val, i) => <li key={i}>{val}</li>)
                    }
                </ul>
                <p>But, these expressions are not:</p>
                <ul>
                    {
                        displayOtherExpressions.map((val, i) => <li key={i}>{val}</li>)
                    }
                </ul>
            </>
        } else {
            return <>
                <p>In your code, these values are not boolean:</p>
                <ul>
                    {
                        displayOtherExpressions.map((val, i) => <li key={i}>{val}</li>)
                    }
                </ul>
            </>
        }
    }


    return <>
        { createHeading() }
        <p>If so, you will need to use different syntax.</p>
        { createOverviewFeedback() }
        <hr />
        { /* Why section */ }
        {
            compareOr.containsLiteral() ?
                <h2>Why is <CodeInline code={compareOr.booleanExpressionText} /> always <CodeInline code="True"></CodeInline>?</h2>
                :
                <h2>Why might <CodeInline code={compareOr.booleanExpressionText} /> always be <CodeInline code="True"></CodeInline>?</h2>
        }
        <p>Python expects the expressions on either side of an <CodeInline code="or"/> to be <strong>boolean</strong> (<CodeInline code="True" /> or <CodeInline code="False"/>).</p>
        { createCustomExplanation() }
        <p>When Python expects a boolean but finds something else, it uses the value&apos;s <strong>truthiness</strong> instead. Truthiness 
        is the name given to how Python decides if a value is <CodeInline code="True" /> or <CodeInline code="False"/> when it is used where a boolean 
        is expected. <em>All</em> values in Python are either <strong>truthy</strong> or <strong>falsy</strong>.</p>
        <p><strong>Truthy</strong> values become <CodeInline code="True" /> when used as a boolean. <strong>Falsy</strong> values become <CodeInline code="False" /> when used as a boolean.</p>
        <ul>
            <li>The number 0 is <strong>falsy</strong> but all other numbers are <strong>truthy</strong>.</li>
            <li>An empty string is <strong>falsy</strong> but all other strings are <strong>truthy</strong>.</li>
            <li>Lists, sets, tuples, and dictionaries <strong>falsy</strong> if empty but <strong>truthy</strong> if they have items.</li>
            <li><CodeInline code="None" /> is <strong>falsy</strong>.</li>
        </ul>
        {
            compareOr.otherTexts.length > 1 ?
                <p>If any of the values {
                    compareOr.otherTexts.map((t, i) => {
                        if (i < compareOr.otherTexts.length - 1) {
                            return <Fragment key={i}><CodeInline code={t}/>, </Fragment>
                        }
                        else {
                            return <Fragment key={i}>or <CodeInline code={t}/></Fragment>
                        }
                    })
                } are <strong>truthy</strong>, <CodeInline code={compareOr.booleanExpressionText} /> will be <CodeInline code="True" />.</p>
                : compareOr.otherTexts.length === 1 ?
                    <p>If <CodeInline code={compareOr.otherTexts[0]} /> is <strong>truthy</strong>, <CodeInline code={compareOr.booleanExpressionText} /> will be <CodeInline code="True" />.</p>
                    :
                    <p>If any of the non-boolean values in your boolean expression are <strong>truthy</strong>, <CodeInline code={compareOr.booleanExpressionText} /> will be <CodeInline code="True" />.</p>
        }
        <h3>Example</h3>
        <p>The if statement below will not work as expected because <code>2</code> is a number, not a boolean expression:</p>
        <MiniIDE startingCode={['# Incorrect', ' ', 'guests = 10', '', '# incorrect', 'if guests == 1 or 2:', '    print("We have a room available for this number of guests.")', 'else:', '    print("Sorry, we can\'t fit you all in one room!")']} />
        <p><code>2</code> is a truthy number so Python will always treat it as <code>True</code>. This means that <code>guests == 1 or 2</code> will be <code>True</code> no matter what 
        the value of <code>guests</code> is.</p>
        <p>Here is the correct code. Both expressions on either side of <CodeInline code="or" /> are boolean:</p>
        <MiniIDE startingCode={['# Correct', ' ', 'guests = 10', '', '# correct', 'if guests == 1 or guests == 2:', '    print("We have a room available for this number of guests.")', 'else:', '    print("Sorry, we can\'t fit you all in one room!")']} />
        
        <h2>Experiment</h2>
        <p>In the code below, try setting <CodeInline code="test_var" /> to different values to see if they are truthy or falsy. There are some ideas below the code.</p>
        <MiniIDE startingCode={['test_var = 0', 'if test_var:', '\tprint(test_var, "is truthy")', 'else:', '\tprint(test_var, "is falsy")']} />
        <p>Some values to try:</p>
        <ul>
            <li><CodeInline code="-5" /></li>
            <li><CodeInline code="13.2" /></li>
            <li><CodeInline code='""' /></li>
            <li><CodeInline code='"Hello"' /></li>
            <li><CodeInline code="[]" /></li>
            <li><CodeInline code='["apples", "oranges", "pears"]' /></li>
        </ul>
    </>

}

// PRE-FEEDBACK STUDY IMPLEMENTATION
// import CodeBlock from "../codeBlock";
// import CodeInline from "../codeInline";
// import { INVALID, LINE_NUMBER, NONE, NOT_PARSED, UNDEFINED, UNKNOWN, NA, VARIABLE_NAME, INT, FLOAT, STRING, INT_LITERAL, FLOAT_LITERAL, STRING_LITERAL, IF_DEFINITION_STATEMENT, ELIF_DEFINITION, ELIF_DEFINITION_STATEMENT, WHILE_DEFINITION_STATEMENT, ASSIGNMENT_STATEMENT, CHANGE_STATEMENT } from "../config";
// import MiniIDE from "../miniIDE";
// import { findAndConvertUrlParam } from "../../utils";

// /** URL params */
// const booleanExpressionText = "booleanExpressionText";
// const parentText = "parentText";
// const parentEntity = "parentEntity";
// const nonBooleanText = "nonBooleanText";
// const nonBooleanEntity = "nonBooleanEntity";
// const nonBooleanType = "nonBooleanType";
// const operator = "operator";
// const leftSideText = "leftSideText";
// const leftSideEntity = "leftSideEntity";
// const leftSideType = "leftSideType";

// class CompareOr {
//     lineNumber;
//     booleanExpressionText;
//     parentText;
//     parentEntity;
//     nonBooleanTexts;
//     nonBooleanEntities;
//     nonBooleanTypes;
//     operators;
//     leftSideText;
//     leftSideEntity;
//     leftSideType;

//     constructor(searchParams) {
//         this.lineNumber = searchParams.has(LINE_NUMBER) ? Number(searchParams.get(LINE_NUMBER)): -1;
//         this.booleanExpressionText = findAndConvertUrlParam(searchParams, booleanExpressionText);
//         this.parentText = findAndConvertUrlParam(searchParams, parentText);
//         this.parentEntity = findAndConvertUrlParam(searchParams, parentEntity);
//         this.nonBooleanTexts = searchParams.getAll(nonBooleanText);
//         this.nonBooleanEntities = searchParams.getAll(nonBooleanEntity);
//         this.nonBooleanTypes = searchParams.getAll(nonBooleanType);
//         this.operators = searchParams.getAll(operator);
//         this.leftSideText = findAndConvertUrlParam(searchParams, leftSideText);
//         this.leftSideEntity = findAndConvertUrlParam(searchParams, leftSideEntity);
//         this.leftSideType = findAndConvertUrlParam(searchParams, leftSideType);
//     }

//     // #findAndConvertStringParam(searchParams, paramName) {
//     //     return searchParams.has(paramName) ? decodeURIComponent(searchParams.get(paramName)) : "";
//     // }

//     countVariablesOfType(typeNames) {
//         let count = 0;
//         for (let i = 0; i < Math.min(this.nonBooleanEntities.length, this.nonBooleanTypes.length); i++) {
//             if (this.nonBooleanEntities[i] === VARIABLE_NAME && typeNames.some(t => t === this.nonBooleanTypes[i])) {
//                 count++;
//             }
//         }
//         if (this.leftSideEntity === VARIABLE_NAME && typeNames.some(t => t === this.leftSideType)) {
//             count++;
//         }
//         return count;
//     }

//     countEntities(entityNames) {
//         let count = 0;
//         for (const nonBoolEntity of this.nonBooleanEntities) {
//             if (entityNames.some(t => t === nonBoolEntity)) {
//                 count++;
//             }
//         }
//         if (entityNames.some(t => t === this.leftSideEntity)) {
//             count++;
//         }
//         return count;
//     }

//     containsLiteral() {
//         return this.nonBooleanEntities.some(t => t.indexOf("Literal") >= 0);
//     }

//     containsVariable() {
//         return this.nonBooleanEntities.some(t => t === VARIABLE_NAME);
//     }

//     isControlFlow() {
//         switch (this.parentEntity) {
//             case IF_DEFINITION_STATEMENT:
//             case ELIF_DEFINITION_STATEMENT:
//             case WHILE_DEFINITION_STATEMENT:
//                 return true;
//             default:
//                 return false;
//         }
//     }

//     isAssignment() {
//         return this.parentEntity === ASSIGNMENT_STATEMENT || this.parentEntity === CHANGE_STATEMENT;
//     }
// }

// export default function CompareMultipleWithOr({misconInfo}) {
//     const compareOr = new CompareOr(misconInfo);
//     const affectedExpressions = compareOr.nonBooleanTexts.length + (compareOr.leftSideEntity.length > 0 ? 1 : 0);

//     const isAVowel = letter => ["a", "e", "i", "o", "u"].some(l => l === letter);
    
//     const explainType = typeString => {
//         switch (typeString) {
//             case NONE:
//             case UNDEFINED:
//                 return "has no value";
//             case UNKNOWN:
//             case NA:
//             case NOT_PARSED:
//             case INVALID:
//                 return "may not be boolean";
//             default:
//                 return isAVowel(typeString.charAt(0)) ? `is an ${typeString}` : `is a ${typeString}`;
//         }
//     };

//     if (compareOr.booleanExpressionText === "" || compareOr.nonBooleanTexts.length === 0 || compareOr.operators.length === 0) {
//         return <>
//             <h1>Oops</h1>
//             <p>There is not enough information about the issue to provide feedback.</p>
//         </>
//     }

//     const createControlFlowFeedback = () => {
//         const lastSection = <>
//             <p>To compare a variable to multiple separate values, the comparison expression must be repeated for each possible value. For example, instead of</p>
//             <CodeBlock code={["# This statement will be True no matter the value of x", "x == 5 or 6"]}></CodeBlock>
//             <p>...compare the variable to each possible value separately:</p>
//             <CodeBlock code={["# This statement will be True or False, depending on the value of x","x == 5 or x == 6"]}></CodeBlock>
//         </>
//         if (compareOr.countEntities([STRING_LITERAL]) > 0 || compareOr.countVariablesOfType([STRING]) > 0 || (!compareOr.containsLiteral() && !compareOr.containsVariable())) {
//             return <>
//                     <p>Make sure that all simple expressions in a compound boolean expression are actually boolean expressions—they are either <CodeInline code="True" /> or <CodeInline code="False" />.</p>
//                     <p>For example, the following if statement will not work as expected because <code>&quot;sun&quot;</code> is a string, not a boolean expression:</p>
//                     <MiniIDE startingCode={['day = "mon"', '', '# incorrect', 'if day == "sat" or "sun":','    print("It\'s the weekend!")', 'else:', '    print("Not the weekend :(")']} />
//                     <p><code>&quot;sun&quot;</code> is a non-empty string so Python will treat it as <code>True</code>, causing <code>day == &quot;sat&quot; or &quot;sun&quot;</code> to be <code>True</code> no matter 
//         what the value of <code>day</code> is.</p>
//                     <p>Here is the corrected code. Notice that both parts of the boolean expression in the if statement are now booleans:</p>
//                     <MiniIDE startingCode={['day = "mon"', '', '# correct', 'if day == "sat" or day == "sun":','    print("It\'s the weekend!")', 'else:', '    print("Not the weekend :(")']} />
//                     {
//                         compareOr.parentText.includes("==") &&
//                             lastSection
//                     }
//                 </>
//         }
//         else if (compareOr.isControlFlow() && (compareOr.countEntities([INT_LITERAL, FLOAT_LITERAL]) > 0) || compareOr.countVariablesOfType([INT, FLOAT])) {
//             return <>
//                     <p>Make sure that all simple expressions in a compound boolean expression are actually boolean expressions—they are either <CodeInline code="True" /> or <CodeInline code="False" />.</p>
//                     <p>In this example, the if statement will not work as expected because <code>2</code> is a number, not a boolean expression:</p>
//                     <MiniIDE startingCode={['guests = 10', '', '# incorrect', 'if guests == 1 or 2:', '    print("We have a room available for this number of guests.")', 'else:', '    print("Sorry, we can\'t fit you all in one room!")']} />
//                     <p><code>2</code> is a non-zero number so Python will treat it as <code>True</code>, causing <code>guests == 1 or 2</code> to be <code>True</code> no matter what 
//                     the value of <code>guests</code> is.</p>
//                     <p>In the correct version of the code, both parts of the boolean expression in the if statement are now booleans:</p>
//                     <MiniIDE startingCode={['guests = 10', '', '# correct', 'if guests == 1 or guests == 2:', '    print("We have a room available for this number of guests.")', 'else:', '    print("Sorry, we can\'t fit you all in one room!")']} />
//                     {
//                         compareOr.parentText.includes("==") &&
//                             lastSection
//                     }
//                 </>
//         }
//         else return <>
//             <p>Make sure that all simple expressions in a compound boolean expression are actually boolean expressions—they are either <CodeInline code="True" /> or <CodeInline code="False" />.</p>
//             {
//                 compareOr.parentText.includes("==") &&
//                     lastSection
//             }
//         </>
//     }

//     const createAssignmentFeedback = () => {
//         return <>
//             <p>It looks like you are assigning the value of the compound boolean expression to a variable.</p>
//             <p>If your goal is to assign a boolean value (either <CodeInline code="True" /> or <CodeInline code="False" />), then make sure that 
//             all simple expressions in the compound boolean expression are actually boolean. If you want to compare some variable 
//             to multiple separate values, the comparison expression must be repeated for each possible value. For example, instead of:</p>
//             <CodeBlock code={["# is_valid will be True no matter the value of x", "is_valid = x == 5 or 6"]}></CodeBlock>
//             <p>...compare x to each possible value separately:</p>
//             <CodeBlock code={["# is_valid will be True or False depending on the value of x", "is_valid = x == 5 or x == 6"]}></CodeBlock>
//         </>
//     }

//     return <>
//         <h1><CodeInline code={compareOr.booleanExpressionText} /> {compareOr.containsLiteral() ? "will": "may"} always be <CodeInline code="True"></CodeInline></h1>
//         <p><CodeInline code={compareOr.booleanExpressionText} /> is a <strong>compound boolean expression</strong>. A boolean expression is an expression that should 
//         either be <CodeInline code="True" /> or <CodeInline code="False" />, and a <strong>compound</strong> boolean expression is made up of two or more simple boolean expressions 
//         combined with <strong>logical operators</strong> (<CodeInline code="and" />, <CodeInline code="or" />). To work as expected, each simple expression in a compound boolean expression 
//         should be a boolean expression—it should be either <CodeInline code="True" /> or <CodeInline code="False" />.</p>
//         <p><CodeInline code={compareOr.booleanExpressionText} /> may not work as expected because {affectedExpressions} of 
//         its component simple expressions {affectedExpressions > 0 ? "are": "is"} not boolean:</p>
//         <ul>
//             {
//                 compareOr.leftSideText.length > 0 && <li><CodeInline code={compareOr.leftSideText} /> {explainType(compareOr.leftSideType)}.</li>
//             }
//             {
//                 compareOr.nonBooleanTexts.map((t, i) => <li key={`nonBoolText${i}`}><CodeInline code={t} /> {explainType(compareOr.nonBooleanTypes[i])}</li>)
//             }
//         </ul>
//         <h2>How to fix this?</h2>
//         {
//             compareOr.isControlFlow() &&
//                 createControlFlowFeedback()
                
//         }
//         {
//             compareOr.isAssignment() &&
//                 createAssignmentFeedback()
//         }
//         {
//             (!compareOr.isAssignment() && !compareOr.isControlFlow()) &&
//                 <p>Make sure that all simple expressions in a compound boolean expression are actually boolean expressions—they are either <CodeInline code="True" /> or <CodeInline code="False" />.</p>
//         }
//         <h2>More detail</h2>
//         <p>When Python finds a non-boolean value (i.e. something other than <CodeInline code="True" /> or <CodeInline code="False" />) where it expects a boolean, it will try to convert 
//         that value to either <CodeInline code="True" /> or <CodeInline code="False" />:</p>
//         <ul>
//             <li>The number 0 will be treated as <CodeInline code="False" /> but all other numbers will be treated as <CodeInline code="True" />.</li>
//             <li>Complex data types like strings, lists, sets, and dictionaries will be treated as <CodeInline code="False" /> if they are empty but <CodeInline code="True" /> if they have any other value.</li>
//             <li>An expression with no value will be treated as <CodeInline code="False" />.</li>
//         </ul>
//         <p>Try running the code below, setting <CodeInline code="test_var" /> to different non-boolean values. Some suggestions are provided below.</p>
//         <MiniIDE startingCode={['test_var = 0', 'if test_var:', '\tprint(test_var, "is True")', 'else:', '\tprint(test_var, "is False")']} />
//         <p>Some values to try:</p>
//         <ul>
//             <li><CodeInline code="-5" /></li>
//             <li><CodeInline code="13.2" /></li>
//             <li><CodeInline code='""' /></li>
//             <li><CodeInline code='"Hello"' /></li>
//             <li><CodeInline code="[]" /></li>
//             <li><CodeInline code='["apples", "oranges", "pears"]' /></li>
//         </ul>
//     </>

// }