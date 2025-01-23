export const findAndConvertUrlParam = (searchParams, paramName) => getParamValue(paramName, "", searchParams); // searchParams.has(paramName) ? decodeURIComponent(searchParams.get(paramName)) : "";

export const getParamValue = (paramName, replacement, urlParams) => {
    if (urlParams.has(paramName)) {
        return urlParams.get(paramName).replaceAll("%2B", "+");
    }
    return replacement;
}
