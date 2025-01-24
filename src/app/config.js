/** URL Params - general */
export const MISCON = "miscon";
export const LINE_NUMBER = "lineNumber";

//#region Misconception names
export const ASSIGN_COMPARES = "AssignCompares";
export const COLON_ASSIGNS = "ColonAssigns";
export const COMPARE_MULTIPLE_WITH_OR = "CompareMultipleValuesWithOr";
export const COMPARISON_WITH_BOOL_LITERAL = "ComparisonWithBoolLiteral";
export const DEFERRED_RETURN = "DeferredReturn";
export const FOR_LOOP_VAR_IS_LOCAL = "ForLoopVarIsLocal";
export const FUNCTION_CALL_NO_PARENS = "FunctionCallsNoParentheses";
export const FUNCTION_CALL_SQUARE_BRACKETS = "FunctionCallsUseSquareBrackets";
export const ITERATION_REQUIRES_TWO_LOOPS = "IterationRequiresTwoLoops";
export const TARGET_OUTSIDE_LOOP = "TargetInitialisedOutsideLoop";
export const LOCAL_VARS_ARE_GLOBAL = "LocalVariablesAreGlobal";
export const LOOP_COUNTER = "LoopCounter";
export const MAP_BOOLEAN_TO_IF = "MapToBooleanWithIf";
export const MAP_BOOLEAN_TO_TERNARY = "MapToBooleanWithTernaryOperator";
export const NO_KEYWORD = "NoKeyword";
export const NO_RESERVED_WORDS = "NoReservedWords";
export const PARAM_ASSIGNED_IN_FUNCTION = "ParameterMustBeAssignedInFunction";
export const PARENS_ONLY_IF_ARGUMENT = "ParenthesesOnlyIfArgument";
export const PRINT_RETURN = "PrintSameAsReturn";
export const RETURN_CALL = "ReturnCall";
export const RETURN_WAITS_FOR_LOOP = "ReturnWaitsForLoop";
export const CONDITIONAL_SEQUENCE = "ConditionalIsSequence";
export const STRING_METHODS_MODIFY = "StringMethodsModifyTheString";
export const TYPE_CONVERSION_MODIFIES = "TypeConversionModifiesArgument";
export const TYPE_SPECIFIED = "TypeMustBeSpecified";
export const WHILE_SAME_AS_IF = "WhileSameAsIf";
//#endregion

//#region Selected symptoms
export const ASSIGNED_NONE = "AssignedNone";
export const UNUSED_RETURN = "UnusedReturn"; // Now a misconception too
//#endregion

//#region data types
export const INT = "int";
export const FLOAT = "float";
export const NUMBER = "number (int or float)";
export const STRING = "string";
export const BOOL = "bool";
export const LIST = "list";
export const SET = "set";
export const TUPLE = "tuple";
export const DICT = "dict";
export const FILE = "file";
export const FUNCTION = "function";
export const CLASS = "class";
export const NONE = "none";
export const EXCEPTION = "exception";
export const UNKNOWN = "unknown data type";
export const NA = "N/A";
export const NOT_PARSED = "not parsed";
export const INVALID = "invalid";
export const UNDEFINED = "undefined";
//#endregion

//#region entity types
// block definitions
export const CLASS_DEFINITION = "class";
export const FUNCTION_DEF = "def";
export const ELIF_DEFINITION = "elif";
export const ELSE_DEFINITION = "else";
export const EXCEPT_DEFINITION = "except";
export const FINALLY_DEFINITION = "finally";
export const FOR_DEFINITION = "for";
export const IF_DEFINITION = "if";
export const LAMBDA_DEFINITION = "lambda";
export const TRY_DEFINITION = "try";
export const WHILE_DEFINITION = "while";
export const DOCUMENT_DEFINITION = "document";
export const LIST_COMPREHENSION = "listComprehension";
// logical operators
export const AND = "and";
export const NOT = "not";
export const OR = "or";
// types
export const FALSE = "False";
export const TRUE = "True";
// other keywords - ignore
// operators - ignore for now
// built in functions - ignore for now
// string methods - ignore for now
// dictionary methods - ignore for now
// set methods - ignore for now
// file methods - ignore for now
// magic methods - ignore for now
// punctuation - ignore for now
// modules, exceptions - ignore for now
// identifiers, literals, and comments
export const VARIABLE_NAME = "variableName";
export const FUNCTION_NAME = "functionName";
export const METHOD_NAME = "methodName";
export const CLASS_NAME = "className";
export const PROPERTY_NAME = "propertyName";
export const MODULE_NAME = "moduleName";
export const INT_LITERAL = "intLiteral";
export const STRING_LITERAL = "stringLiteral";
export const CONTINUATION_LINE = "continuationLine";
export const SEPARATOR = "separator";
export const FLOAT_LITERAL = "floatLiteral";
export const SINGLE_LINE_COMMENT = "singleLineComment";
export const MULTILINE_COMMENT = "multilineComment";
export const TYPE_HINT = "typeHint";
export const STR_TYPE = "strType";
export const INT_TYPE = "intType";
export const FLOAT_TYPE = "floatType";
export const BOOL_TYPE = "boolType";
export const LIST_TYPE = "listType";
export const SET_TYPE = "setType";
export const DICT_TYPE = "dictType";
export const TUPLE_TYPE = "tupleType";
// values of complex data types and related
export const LIST_DEFINITION = "listDefinition";
export const TUPLE_DEFINITION = "tupleDefinition";
export const SET_DEFINITION = "setDefinition";
export const DICT_DEFINITION = "dictDefinition";
export const INDEX_KEY = "indexKey"; // i.e. index or key access of list / tuple / dict
export const SLICE = "slice"; 
// modules, including methods and entities - ignore for now
// calls
export const USER_DEFINED_FUNCTION_CALL = "UserDefinedFunctionCall";
export const BUILTIN_FUNCTION_CALL = "BuiltInFunctionCall";
export const USER_DEFINED_METHOD_CALL = "UserDefinedMethodCall";
export const BUILTIN_METHOD_CALL = "BuiltInMethodCall";
export const EXCEPTION_CALL = "ExceptionCall";
// block definitions
export const FUNCTION_DEFINITION_STATEMENT = "FunctionDefinitionStatement";
export const METHOD_DEFINITION_STATEMENT = "MethodDefinitionStatement";
export const FOR_DEFINITION_STATEMENT = "ForDefinitionStatement";
export const EXCEPT_DEFINITION_STATEMENT = "ExceptDefinitionStatement";
export const CLASS_DEFINITION_STATEMENT = "ClassDefinitionStatement";
export const LAMBDA_DEFINITION_STATEMENT = "LambdaDefinitionStatement";
export const IF_DEFINITION_STATEMENT = "IfDefinitionStatement";
export const ELIF_DEFINITION_STATEMENT = "ElifDefinitionStatement";
export const ELSE_DEFINITION_STATEMENT = "ElseDefinitionStatement";
export const WHILE_DEFINITION_STATEMENT = "WhileDefinitionStatement";
export const TRY_DEFINITION_STATEMENT = "TryDefinitionStatement";
export const FINALLY_DEFINITION_STATEMENT = "FinallyDefinitionStatement";
export const TERNARY_STATEMENT = "TernaryStatement";
export const WITH_DEFINITION_STATEMENT = "WithStatment";
// group - ignore for now
// other multipart - ignore for now
// multipart values
export const SUBSCRIPTED_EXPRESSION = "SubscriptedExpression";
export const CALCULATED_EXPRESSION = "CalculatedExpression";
export const COMPARISON_EXPRESSION = "ComparisonExpression";
export const BOOLEAN_EXPRESSION = "BooleanExpression";
export const ITERATOR_EXPRESSION = "IteratorExpression";
export const COMBINED_STRING_LITERAL = "CombinedStringLiteral";
export const RETURN_STATEMENT = "ReturnStatement";
export const PROPERTY_CALL_EXPRESSION = "PropertyCallExpression";
// assignments
export const ASSIGNMENT_STATEMENT = "AssignmentStatement";
export const CHANGE_STATEMENT = "ChangeStatement";
// statements beginning with keyword - ignore for now

//#endregion