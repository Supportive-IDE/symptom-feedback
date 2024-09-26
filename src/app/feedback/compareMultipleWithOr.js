import CodeBlock from "../codeBlock";
import CodeInline from "../codeInline";
import { INVALID, LINE_NUMBER, NONE, NOT_PARSED, UNDEFINED, UNKNOWN, NA, VARIABLE_NAME, INT, FLOAT, STRING, INT_LITERAL, FLOAT_LITERAL, STRING_LITERAL, IF_DEFINITION_STATEMENT, ELIF_DEFINITION, ELIF_DEFINITION_STATEMENT, WHILE_DEFINITION_STATEMENT, ASSIGNMENT_STATEMENT, CHANGE_STATEMENT } from "../config";
import MiniIDE from "../miniIDE";
import { findAndConvertUrlParam } from "@/utils";

/** URL params */
const booleanExpressionText = "booleanExpressionText";
const parentText = "parentText";
const parentEntity = "parentEntity";
const nonBooleanText = "nonBooleanText";
const nonBooleanEntity = "nonBooleanEntity";
const nonBooleanType = "nonBooleanType";
const operator = "operator";
const leftSideText = "leftSideText";
const leftSideEntity = "leftSideEntity";
const leftSideType = "leftSideType";

class CompareOr {
    lineNumber;
    booleanExpressionText;
    parentText;
    parentEntity;
    nonBooleanTexts;
    nonBooleanEntities;
    nonBooleanTypes;
    operators;
    leftSideText;
    leftSideEntity;
    leftSideType;

    constructor(searchParams) {
        this.lineNumber = searchParams.has(LINE_NUMBER) ? Number(searchParams.get(LINE_NUMBER)): -1;
        this.booleanExpressionText = findAndConvertUrlParam(searchParams, booleanExpressionText);
        this.parentText = findAndConvertUrlParam(searchParams, parentText);
        this.parentEntity = findAndConvertUrlParam(searchParams, parentEntity);
        this.nonBooleanTexts = searchParams.getAll(nonBooleanText);
        this.nonBooleanEntities = searchParams.getAll(nonBooleanEntity);
        this.nonBooleanTypes = searchParams.getAll(nonBooleanType);
        this.operators = searchParams.getAll(operator);
        this.leftSideText = findAndConvertUrlParam(searchParams, leftSideText);
        this.leftSideEntity = findAndConvertUrlParam(searchParams, leftSideEntity);
        this.leftSideType = findAndConvertUrlParam(searchParams, leftSideType);
    }

    // #findAndConvertStringParam(searchParams, paramName) {
    //     return searchParams.has(paramName) ? decodeURIComponent(searchParams.get(paramName)) : "";
    // }

    countVariablesOfType(typeNames) {
        let count = 0;
        for (let i = 0; i < Math.min(this.nonBooleanEntities.length, this.nonBooleanTypes.length); i++) {
            if (this.nonBooleanEntities[i] === VARIABLE_NAME && typeNames.some(t => t === this.nonBooleanTypes[i])) {
                count++;
            }
        }
        if (this.leftSideEntity === VARIABLE_NAME && typeNames.some(t => t === this.leftSideType)) {
            count++;
        }
        return count;
    }

    countEntities(entityNames) {
        let count = 0;
        for (const nonBoolEntity of this.nonBooleanEntities) {
            if (entityNames.some(t => t === nonBoolEntity)) {
                count++;
            }
        }
        if (entityNames.some(t => t === this.leftSideEntity)) {
            count++;
        }
        return count;
    }

    containsLiteral() {
        return this.nonBooleanEntities.some(t => t.indexOf("Literal") >= 0);
    }

    containsVariable() {
        return this.nonBooleanEntities.some(t => t === VARIABLE_NAME);
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
}

export default function CompareMultipleWithOr({misconInfo}) {
    const compareOr = new CompareOr(misconInfo);
    const affectedExpressions = compareOr.nonBooleanTexts.length + (compareOr.leftSideEntity.length > 0 ? 1 : 0);

    const isAVowel = letter => ["a", "e", "i", "o", "u"].some(l => l === letter);
    
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

    if (compareOr.booleanExpressionText === "" || compareOr.nonBooleanTexts.length === 0 || compareOr.operators.length === 0) {
        return <>
            <h1>Oops</h1>
            <p>There is not enough information about the issue to provide feedback.</p>
        </>
    }

    const createControlFlowFeedback = () => {
        const lastSection = <>
            <p>To compare a variable to multiple separate values, the comparison expression must be repeated for each possible value. For example, instead of</p>
            <CodeBlock code={["# This statement will be True no matter the value of x", "x == 5 or 6"]}></CodeBlock>
            <p>...compare the variable to each possible value separately:</p>
            <CodeBlock code={["# This statement will be True or False, depending on the value of x","x == 5 or x == 6"]}></CodeBlock>
        </>
        if (compareOr.countEntities([STRING_LITERAL]) > 0 || compareOr.countVariablesOfType([STRING]) > 0 || (!compareOr.containsLiteral() && !compareOr.containsVariable())) {
            return <>
                    <p>Make sure that all simple expressions in a compound boolean expression are actually boolean expressions—they are either <CodeInline code="True" /> or <CodeInline code="False" />.</p>
                    <p>For example, the following if statement will not work as expected because <code>&quot;sun&quot;</code> is a string, not a boolean expression:</p>
                    <MiniIDE startingCode={['day = "mon"', '', '# incorrect', 'if day == "sat" or "sun":','    print("It\'s the weekend!")', 'else:', '    print("Not the weekend :(")']} />
                    <p><code>&quot;sun&quot;</code> is a non-empty string so Python will treat it as <code>True</code>, causing <code>day == &quot;sat&quot; or &quot;sun&quot;</code> to be <code>True</code> no matter 
        what the value of <code>day</code> is.</p>
                    <p>Here is the corrected code. Notice that both parts of the boolean expression in the if statement are now booleans:</p>
                    <MiniIDE startingCode={['day = "mon"', '', '# correct', 'if day == "sat" or day == "sun":','    print("It\'s the weekend!")', 'else:', '    print("Not the weekend :(")']} />
                    {
                        compareOr.parentText.includes("==") &&
                            lastSection
                    }
                </>
        }
        else if (compareOr.isControlFlow() && (compareOr.countEntities([INT_LITERAL, FLOAT_LITERAL]) > 0) || compareOr.countVariablesOfType([INT, FLOAT])) {
            return <>
                    <p>Make sure that all simple expressions in a compound boolean expression are actually boolean expressions—they are either <CodeInline code="True" /> or <CodeInline code="False" />.</p>
                    <p>In this example, the if statement will not work as expected because <code>2</code> is a number, not a boolean expression:</p>
                    <MiniIDE startingCode={['guests = 10', '', '# incorrect', 'if guests == 1 or 2:', '    print("We have a room available for this number of guests.")', 'else:', '    print("Sorry, we can\'t fit you all in one room!")']} />
                    <p><code>2</code> is a non-zero number so Python will treat it as <code>True</code>, causing <code>guests == 1 or 2</code> to be <code>True</code> no matter what 
                    the value of <code>guests</code> is.</p>
                    <p>In the correct version of the code, both parts of the boolean expression in the if statement are now booleans:</p>
                    <MiniIDE startingCode={['guests = 10', '', '# correct', 'if guests == 1 or guests == 2:', '    print("We have a room available for this number of guests.")', 'else:', '    print("Sorry, we can\'t fit you all in one room!")']} />
                    {
                        compareOr.parentText.includes("==") &&
                            lastSection
                    }
                </>
        }
        else return <>
            <p>Make sure that all simple expressions in a compound boolean expression are actually boolean expressions—they are either <CodeInline code="True" /> or <CodeInline code="False" />.</p>
            {
                compareOr.parentText.includes("==") &&
                    lastSection
            }
        </>
    }

    const createAssignmentFeedback = () => {
        return <>
            <p>It looks like you are assigning the value of the compound boolean expression to a variable.</p>
            <p>If your goal is to assign a boolean value (either <CodeInline code="True" /> or <CodeInline code="False" />), then make sure that 
            all simple expressions in the compound boolean expression are actually boolean. If you want to compare some variable 
            to multiple separate values, the comparison expression must be repeated for each possible value. For example, instead of:</p>
            <CodeBlock code={["# is_valid will be True no matter the value of x", "is_valid = x == 5 or 6"]}></CodeBlock>
            <p>...compare x to each possible value separately:</p>
            <CodeBlock code={["# is_valid will be True or False depending on the value of x", "is_valid = x == 5 or x == 6"]}></CodeBlock>
        </>
    }

    return <>
        <h1><CodeInline code={compareOr.booleanExpressionText} /> {compareOr.containsLiteral() ? "will": "may"} always be <CodeInline code="True"></CodeInline></h1>
        <p><CodeInline code={compareOr.booleanExpressionText} /> is a <strong>compound boolean expression</strong>. A boolean expression is an expression that should 
        either be <CodeInline code="True" /> or <CodeInline code="False" />, and a <strong>compound</strong> boolean expression is made up of two or more simple boolean expressions 
        combined with <strong>logical operators</strong> (<CodeInline code="and" />, <CodeInline code="or" />). To work as expected, each simple expression in a compound boolean expression 
        should be a boolean expression—it should be either <CodeInline code="True" /> or <CodeInline code="False" />.</p>
        <p><CodeInline code={compareOr.booleanExpressionText} /> may not work as expected because {affectedExpressions} of 
        its component simple expressions {affectedExpressions > 0 ? "are": "is"} not boolean:</p>
        <ul>
            {
                compareOr.leftSideText.length > 0 && <li><CodeInline code={compareOr.leftSideText} /> {explainType(compareOr.leftSideType)}.</li>
            }
            {
                compareOr.nonBooleanTexts.map((t, i) => <li key={`nonBoolText${i}`}><CodeInline code={t} /> {explainType(compareOr.nonBooleanTypes[i])}</li>)
            }
        </ul>
        <h2>How to fix this?</h2>
        {
            compareOr.isControlFlow() &&
                createControlFlowFeedback()
                
        }
        {
            compareOr.isAssignment() &&
                createAssignmentFeedback()
        }
        {
            (!compareOr.isAssignment() && !compareOr.isControlFlow()) &&
                <p>Make sure that all simple expressions in a compound boolean expression are actually boolean expressions—they are either <CodeInline code="True" /> or <CodeInline code="False" />.</p>
        }
        <h2>More detail</h2>
        <p>When Python finds a non-boolean value (i.e. something other than <CodeInline code="True" /> or <CodeInline code="False" />) where it expects a boolean, it will try to convert 
        that value to either <CodeInline code="True" /> or <CodeInline code="False" />:</p>
        <ul>
            <li>The number 0 will be treated as <CodeInline code="False" /> but all other numbers will be treated as <CodeInline code="True" />.</li>
            <li>Complex data types like strings, lists, sets, and dictionaries will be treated as <CodeInline code="False" /> if they are empty but <CodeInline code="True" /> if they have any other value.</li>
            <li>An expression with no value will be treated as <CodeInline code="False" />.</li>
        </ul>
        <p>Try running the code below, setting <CodeInline code="test_var" /> to different non-boolean values. Some suggestions are provided below.</p>
        <MiniIDE startingCode={['test_var = 0', 'if test_var:', '\tprint(test_var, "is True")', 'else:', '\tprint(test_var, "is False")']} />
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