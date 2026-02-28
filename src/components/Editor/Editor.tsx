import styles from "./Editor.module.css";
import { getCurrentDate } from "../../utils/dateTools";
import Navbar from "../Navbar";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Panel from "../Panel/Panel";
import { postEntry } from "../../lib/api";
import Alert from "../Alert/Alert";
import {
    getPassword,
    setPassword,
    clearPassword,
    isAuthenticated,
} from "../../lib/auth";

export default function Editor() {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [date, setDate] = useState(getCurrentDate());
    const [description, setDescription] = useState("");
    const [body, setBody] = useState("");
    const [previewMode, setPreviewMode] = useState<"list" | "entry">("entry");
    const [alert, setAlert] = useState("");
    const [authenticated, setAuthenticated] = useState(isAuthenticated());
    const [passwordInput, setPasswordInput] = useState("");

    function handleLogin() {
        setPassword(passwordInput);
        setPasswordInput("");
        setAuthenticated(true);
    }

    async function handleSubmit() {
        if (!authenticated) {
            setAlert("Demo mode — log in to post entries.");
            return;
        }
        try {
            const { id } = await postEntry(
                { title, date, description, content: body },
                getPassword()!,
            );
            navigate(`/entries/${id}`);
        } catch (err) {
            if (err instanceof Error && err.message === "Unauthorized") {
                clearPassword();
                setAuthenticated(false);
                setAlert("Incorrect password — switched to demo mode.");
            } else {
                setAlert(
                    err instanceof Error ? err.message : "Something went wrong",
                );
            }
        }
    }
    return (
        <>
            <Navbar></Navbar>
            <div className={styles.editor}>
                <div className={styles.editorPanel}>
                    {alert ? <Alert alertText={alert} /> : <></>}
                    <div className={styles.editorMetadataInput}>
                        <label>
                            Title:{" "}
                            <input
                                name="titleInput"
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </label>
                        <label>
                            Date:{" "}
                            <input
                                name="dateInput"
                                defaultValue={getCurrentDate()}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </label>
                    </div>
                    <textarea
                        className={styles.editorDescription}
                        name="descriptionInput"
                        placeholder="Short description..."
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <div className={styles.editorInput}>
                        <label>
                            Content:
                            <textarea
                                name="postContent"
                                onChange={(e) => setBody(e.target.value)}
                            />
                        </label>
                    </div>
                    {!authenticated && (
                        <div className={styles.loginRow}>
                            <input
                                type="password"
                                placeholder="Password"
                                value={passwordInput}
                                onChange={(e) =>
                                    setPasswordInput(e.target.value)
                                }
                                onKeyDown={(e) =>
                                    e.key === "Enter" && handleLogin()
                                }
                            />
                            <button
                                className={styles.submitButton}
                                onClick={handleLogin}
                            >
                                Log in
                            </button>
                        </div>
                    )}
                    <button
                        className={styles.submitButton}
                        onClick={handleSubmit}
                    >
                        {authenticated ? "Post Entry" : "Post Entry (Demo)"}
                    </button>
                </div>
                <div className={styles.previewPanel}>
                    <div className={styles.previewToggle}>
                        <span>Preview as:</span>
                        <button
                            className={
                                previewMode === "entry"
                                    ? styles.previewToggleActive
                                    : styles.submitButton
                            }
                            onClick={() => setPreviewMode("entry")}
                        >
                            Full Entry
                        </button>
                        <button
                            className={
                                previewMode === "list"
                                    ? styles.previewToggleActive
                                    : styles.submitButton
                            }
                            onClick={() => setPreviewMode("list")}
                        >
                            List Item
                        </button>
                    </div>
                    <div className={styles.previewContent}>
                        {title || body ? (
                            <Panel
                                title={title}
                                meta={date}
                                content={
                                    previewMode === "entry"
                                        ? body
                                        : description || "No description."
                                }
                            />
                        ) : (
                            <p className={styles.previewPlaceholder}>
                                Write some content to see a preview...
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
