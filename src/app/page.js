"use client";
import { COMPARE_MULTIPLE_WITH_OR, CONDITIONAL_SEQUENCE, DEFERRED_RETURN, FUNCTION_CALL_NO_PARENS, MAP_BOOLEAN_TO_IF, MISCON, PARAM_ASSIGNED_IN_FUNCTION, PARENS_ONLY_IF_ARGUMENT, PRINT_RETURN, TYPE_SPECIFIED } from "./config";
import CompareMultipleWithOr from "./feedback/compareMultipleWithOr";
import ConditionalIsSequence from "./feedback/conditionalIsSequence";
import DeferredReturn from "./feedback/deferredReturn";
import FunctionCallsNoParentheses from "./feedback/functionCallsNoParentheses";
import MapToBooleanWithIf from "./feedback/mapToBooleanWithIf";
import ParamMustBeAssignedInFunction from "./feedback/parameterMustBeAssignedInFunction";
import PrintSameAsReturn from "./feedback/printSameAsReturn";
import TypeMustBeSpecified from "./feedback/typeMustBeSpecified";
import styles from "./page.module.css";
import Repl from "./repl";
import { useSearchParams } from "next/navigation";

export default function Home() {
    const searchParams = useSearchParams();
    return (
        <main className={styles.main}>
            { (() => {
                switch (searchParams.get(MISCON)) {
                    case COMPARE_MULTIPLE_WITH_OR:
                        return <CompareMultipleWithOr misconInfo={searchParams} />
                    case CONDITIONAL_SEQUENCE:
                        return <ConditionalIsSequence misconInfo={searchParams} />
                    case DEFERRED_RETURN:
                        return <DeferredReturn misconInfo={searchParams} />
                    case FUNCTION_CALL_NO_PARENS:
                    case PARENS_ONLY_IF_ARGUMENT:
                        return <FunctionCallsNoParentheses misconInfo={searchParams} />
                    case MAP_BOOLEAN_TO_IF:
                        return <MapToBooleanWithIf misconInfo={searchParams} />
                    case PARAM_ASSIGNED_IN_FUNCTION:
                        return <ParamMustBeAssignedInFunction misconInfo={searchParams} />
                    case PRINT_RETURN:
                        return <PrintSameAsReturn misconInfo={searchParams} />
                    case TYPE_SPECIFIED:
                        return <TypeMustBeSpecified misconInfo={searchParams} />
                    default:
                        return <>
                            <p>Nothing here... Here&apos;s a REPL to play with:</p>
                            <Repl />
                        </>
                }})()
            }
        </main>
    );
}
