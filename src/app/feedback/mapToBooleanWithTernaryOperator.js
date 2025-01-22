import CodeBlock from "../codeBlock";
import CodeInline from "../codeInline";
import MiniIDE from "../miniIDE";

/** URL params */
const textParam = "text";
const parentTextParam = "parentText";
const parentEntityParam = "parentEntity";
const conditionParam = "boolExp";
const valueIfTrueParam = "valueIfTrue";
const valueIfFalseParam = "valueIfFalse";

const usageOption = {
    valueAssigned: "assignment",
    valueReturned: "return"
}

export default function MapToBooleanWithTernaryOperator({misconInfo}) {
    const ternaryText = misconInfo.has(textParam) ? misconInfo.get(textParam).trim() : "";
    const booleanExpression = misconInfo.has(conditionParam) ? misconInfo.get(conditionParam) : "";
    const parentText = misconInfo.has(parentTextParam) ? misconInfo.get(parentTextParam) : "";
    const parentEntity = misconInfo.has(parentEntityParam) ? misconInfo.get(parentEntityParam) : "";

    return <>
        <h1><CodeInline code={ternaryText} /> is the same as <CodeInline code={booleanExpression} /></h1>
        <p>This code {parentEntity === usageOption.valueReturned ? "returns" : "assigns"} a value that 
                is the same as the ternary condition, <CodeInline code={booleanExpression} />:</p>
        <CodeBlock code={parentText} />
        <p>This means that the condition can be {parentEntity === usageOption.valueReturned ? "returned" : "assigned"} directly.</p>
        <p>Here is a similar example:</p>
        {
            parentEntity === usageOption.valueReturned ?
                <CodeBlock code={['# Unnecessary ternary', 'return True if price < 100 else False', '', '# Better', 'return price < 100']} />
                :
                <CodeBlock code={['# Unnecessary ternary', 'on_sale = True if price < 100 else False', '', '# Better', 'on_sale = price < 100']} />
        }
        <h2>Try it out</h2>
        {
            parentEntity === usageOption.valueReturned ?
                <>
                    <p>The value returned by the ternary in <CodeInline code="check_height()" /> will always be the same as <CodeInline code="height_in_cm > 100" />.</p>
                    <MiniIDE startingCode={['# Before', ' ', 'def check_height(user_in):', '\theight_in_cm = int(user_in)', '\treturn True if height_in_cm > 100 else False', '', 'height = int(input("Enter your height in CM: "))', 'print(check_height(height))']} />
                    <p>This means that the ternary can be removed and the condition can be 
                    returned directly:</p>
                    <MiniIDE startingCode={['# After', ' ', 'def check_height(user_in):', '\theight_in_cm = int(user_in)', '\treturn height_in_cm > 100', '', 'height = int(input("Enter your height in CM: "))', 'print(check_height(height))']} />
                </>
                :
                <>
                    <p>The value of <CodeInline code="is_tall_enough" /> will always be the same as <CodeInline code="height > 100" />.</p>
                    <MiniIDE startingCode={['# Before', ' ','height = int(input("Enter your height in CM: "))', 'is_tall_enough = True if height > 100 else False', 'print(is_tall_enough)']} />
                    <p>This means that the ternary can be removed 
                    and <CodeInline code="height > 100" /> can be directly assigned to <CodeInline code="is_tall_enough" />:</p>
                    <MiniIDE startingCode={['# After', ' ','height = int(input("Enter your height in CM: "))', 'is_tall_enough = height > 100', 'print(is_tall_enough)']} />
                </>
        }
    </>
}