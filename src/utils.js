export const findAndConvertUrlParam = (searchParams, paramName) => searchParams.has(paramName) ? decodeURIComponent(searchParams.get(paramName)) : "";
