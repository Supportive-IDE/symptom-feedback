import { useState } from "react";
import styles from "./rawInput.module.css";

const RawInput = ({prompt, submitHandler}) => {
    const [value, setValue] = useState("");
    const [isActive, setIsActive] = useState(true);

    const keyDown = event => {
        if (event.keyCode === 13) {
            submitHandler(value);
            setIsActive(false);
        }
    } 
    const valueChanged = event => {
        setValue(event.target.value);
    }

    return isActive ? 
        <p>
            <label htmlFor="userIn">{prompt}</label>
            <input id="userIn" className={styles.userInput} type="text" onKeyDown={keyDown} onChange={valueChanged} value={value} autoFocus/>
        </p>
        : <p className={styles.savedInput}>{prompt}{value}</p>
    };

export default RawInput;