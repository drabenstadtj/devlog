import Container from "../Container";
import Panel from "../Panel/Panel";
import styles from "./StatusMessage.module.css";

export default function StatusMessage({ statusText }: { statusText: string }) {
    return (
        <Container>
            <Panel title={":("} content={statusText} />
        </Container>
    );
}
