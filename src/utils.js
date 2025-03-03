import axios from "axios";
import { LOGGING_URL } from "./app/config";

export const findAndConvertUrlParam = (searchParams, paramName) => getParamValue(paramName, "", searchParams); // searchParams.has(paramName) ? decodeURIComponent(searchParams.get(paramName)) : "";

export const getParamValue = (paramName, replacement, urlParams) => {
    if (urlParams.has(paramName)) {
        return urlParams.get(paramName).replaceAll("%2B", "+");
    }
    return replacement;
}

export const sendData = async (data) => {
    try {
        await axios.put(`${LOGGING_URL}/extended`, {...data, urlParams: window.location.search});
    } catch (error) {
        console.log("Couldn't log", error);
    }
}
