import styles from "./codeOutput.module.css";


// Modify this to be display vs input?
const CodeOutput = ({text}) => {

    return <div className={styles.output}>{
        text.map((line, i) => <div key={i}>{line}</div>)
    }</div>
}

export default CodeOutput;