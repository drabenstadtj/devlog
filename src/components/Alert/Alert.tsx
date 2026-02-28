import styles from "./Alert.module.css";
export default function Alert({ alertText }: { alertText: string }) {
    return (
        <div className={styles.alertPanel}>
            <h3>{alertText}</h3>
        </div>
    );
}
