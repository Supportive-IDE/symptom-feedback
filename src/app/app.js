import { ASSIGN_COMPARES, COLON_ASSIGNS, COMPARE_MULTIPLE_WITH_OR, COMPARISON_WITH_BOOL_LITERAL, CONDITIONAL_SEQUENCE, DEFERRED_RETURN, FOR_LOOP_VAR_IS_LOCAL, FUNCTION_CALL_NO_PARENS, ITERATION_REQUIRES_TWO_LOOPS, LOCAL_VARS_ARE_GLOBAL, LOOP_COUNTER, MAP_BOOLEAN_TO_IF, MAP_BOOLEAN_TO_TERNARY, MISCON, PARAM_ASSIGNED_IN_FUNCTION, PARENS_ONLY_IF_ARGUMENT, PRINT_RETURN, RETURN_CALL, RETURN_WAITS_FOR_LOOP, STRING_METHODS_MODIFY, TARGET_OUTSIDE_LOOP, TYPE_CONVERSION_MODIFIES, TYPE_SPECIFIED, UNUSED_RETURN, WHILE_SAME_AS_IF } from "./config";
import CompareMultipleWithOr from "./feedback/compareMultipleWithOr";
import ConditionalIsSequence from "./feedback/conditionalIsSequence";
import DeferredReturn from "./feedback/deferredReturn";
import FunctionCallsNoParentheses from "./feedback/functionCallsNoParentheses";
import LocalVariablesAreGlobal from "./feedback/localVariablesAreGlobal";
import MapToBooleanWithIf from "./feedback/mapToBooleanWithIf";
import ParamMustBeAssignedInFunction from "./feedback/parameterMustBeAssignedInFunction";
import PrintSameAsReturn from "./feedback/printSameAsReturn";
import TypeMustBeSpecified from "./feedback/typeMustBeSpecified";
import UnusedReturn from "./feedback/unusedReturn";
import ReturnCall from "./feedback/returnCall";
import AssignCompares from "./feedback/assignCompares";
import ColonAssigns from "./feedback/colonAssigns";
import WhileSameAsIf from "./feedback/whileSameAsIf";
import ForLoopVarIsLocal from "./feedback/forLoopVarIsLocal";
import MapToBooleanWithTernaryOperator from "./feedback/mapToBooleanWithTernaryOperator";
import ComparisonWithBoolLiteral from "./feedback/comparisonWithBoolLiteral";
import IterationRequiresTwoLoops from "./feedback/iterationRequiresTwoLoops";
import StringMethodsModifyTheString from "./feedback/stringMethodsModifyTheString";
import TypeConversionModifiesArgument from "./feedback/typeConversionModifiesArgument";
import ReturnWaitsForLoop from "./feedback/returnWaitsForLoop";
import LoopCounter from "./feedback/loopCounter";
import MiniIDE from "./miniIDE";
import { useSearchParams } from "next/navigation";


export default function App() {
    const searchParams = useSearchParams();

    switch (searchParams.get(MISCON)) {
        case ASSIGN_COMPARES:
            return <AssignCompares misconInfo={searchParams} />
        case COLON_ASSIGNS:
            return <ColonAssigns misconInfo={searchParams} />
        case COMPARE_MULTIPLE_WITH_OR:
            return <CompareMultipleWithOr misconInfo={searchParams} />
        case COMPARISON_WITH_BOOL_LITERAL:
            return <ComparisonWithBoolLiteral misconInfo={searchParams} />
        case CONDITIONAL_SEQUENCE:
            return <ConditionalIsSequence misconInfo={searchParams} />
        case FOR_LOOP_VAR_IS_LOCAL:
        case TARGET_OUTSIDE_LOOP:
            return <ForLoopVarIsLocal misconInfo={searchParams} />
        case DEFERRED_RETURN:
            return <DeferredReturn misconInfo={searchParams} />
        case FUNCTION_CALL_NO_PARENS:
        case PARENS_ONLY_IF_ARGUMENT:
            return <FunctionCallsNoParentheses misconInfo={searchParams} />
        case ITERATION_REQUIRES_TWO_LOOPS:
            return <IterationRequiresTwoLoops misconInfo={searchParams} />
        case LOCAL_VARS_ARE_GLOBAL:
            return <LocalVariablesAreGlobal misconInfo={searchParams} />
        case LOOP_COUNTER:
            return <LoopCounter misconInfo={searchParams} />
        case MAP_BOOLEAN_TO_IF:
            return <MapToBooleanWithIf misconInfo={searchParams} />
        case MAP_BOOLEAN_TO_TERNARY:
            return <MapToBooleanWithTernaryOperator misconInfo={searchParams} />
        case PARAM_ASSIGNED_IN_FUNCTION:
            return <ParamMustBeAssignedInFunction misconInfo={searchParams} />
        case PRINT_RETURN:
            return <PrintSameAsReturn misconInfo={searchParams} />
        case RETURN_WAITS_FOR_LOOP:
            return <ReturnWaitsForLoop misconInfo={searchParams} />
        case STRING_METHODS_MODIFY:
            return <StringMethodsModifyTheString misconInfo={searchParams} />
        case TYPE_CONVERSION_MODIFIES:
            return <TypeConversionModifiesArgument misconInfo={searchParams} />
        case TYPE_SPECIFIED:
            return <TypeMustBeSpecified misconInfo={searchParams} />
        case UNUSED_RETURN:
            return <UnusedReturn misconInfo={searchParams} />
        case RETURN_CALL:
            return <ReturnCall misconInfo={searchParams} />
        case WHILE_SAME_AS_IF:
            return <WhileSameAsIf misconInfo={searchParams} />
        default:
            return <>
                <p>Nothing here... Here&apos;s an editor to play with:</p>
                <MiniIDE startingCode="print('Hello, World')" />
            </>
    }
}