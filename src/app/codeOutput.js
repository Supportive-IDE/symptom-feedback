import styles from "./codeOutput.module.css";


const CodeOutput = ({text, prefix}) => {


    return text.length === 0 ? <></> : <div className={styles.output}>{
        text.map((line, i) => <div key={i}>{prefix} {line}</div>)
    }</div>
}

export default CodeOutput;