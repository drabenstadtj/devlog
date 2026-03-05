import Container from "../Container";
import Navbar from "../Navbar";
import Panel from "../Panel/Panel";

export default function StatusMessage({ statusText }: { statusText: string }) {
    return (
        <>
            <Navbar />
            <Container>
                <Panel title={":("} content={statusText} />
            </Container>
        </>
    );
}
