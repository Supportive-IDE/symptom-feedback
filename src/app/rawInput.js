import { useState } from "react";
import styles from "./rawInput.module.css";

const RawInput = ({prompt, changeHandler}) => {
    const [value, setValue] = useState("");

    const keyDown = event => {
        if (event.keyCode === 13) {
            changeHandler(value);
        }
    } 
    const valueChanged = event => {
        setValue(event.target.value);
    }

    return (
    <p>
        <label htmlFor="userIn">{prompt}</label>
        <input id="userIn" className={styles.userInput} type="text" onKeyDown={keyDown} onChange={valueChanged} value={value} autoFocus/>
    </p>
)};

export default RawInput;