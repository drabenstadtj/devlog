import styles from "./Editor.module.css";
import { getCurrentDate } from "../../utils/dateTools";
import Navbar from "../Navbar";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Panel from "../Panel/Panel";
import {
    getEntries,
    getTags,
    postEntry,
    putEntry,
    uploadImage,
} from "../../lib/api";
import Alert from "../Alert/Alert";
import CreatableSelect from "react-select/creatable";
import Select from "react-select";

import {
    getPassword,
    setPassword,
    clearPassword,
    isAuthenticated,
} from "../../lib/auth";
import type { EntryData } from "../../types/Entry";

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
    const [tags, setTags] = useState<string[] | null>();
    const [selectedTags, setSelectedTags] = useState<
        { value: string; label: string }[]
    >([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [entries, setEntries] = useState<EntryData[] | null>([]);
    const [selectedEntry, setSelectedEntry] = useState<EntryData | null>();
    const [entryChanged, setEntryChanged] = useState(false);

    useEffect(() => {
        getEntries().then(setEntries).catch(console.error);
    }, []);

    function handleLogin() {
        setPassword(passwordInput);
        setPasswordInput("");
        setAuthenticated(true);
    }

    useEffect(() => {
        getTags().then(setTags).catch(console.error);
    }, []);

    useEffect(() => {
        const currentDate = getCurrentDate();
        setDate(currentDate);
    }, []);

    async function handleSubmit() {
        if (!authenticated) {
            setAlert("Demo mode — log in to post entries.");
            return;
        }
        try {
            const tagStrings = selectedTags.map((t) => t.value);
            if (selectedEntry) {
                const { id } = await putEntry(
                    {
                        title,
                        date,
                        description,
                        content: body,
                        tags: tagStrings,
                        id: selectedEntry.id,
                    },
                    getPassword()!,
                );
                navigate(`/entries/${id}`);
            } else {
                const { id } = await postEntry(
                    {
                        title,
                        date,
                        description,
                        content: body,
                        tags: tagStrings,
                    },
                    getPassword()!,
                );
                navigate(`/entries/${id}`);
            }
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
    function wrapSelection(before: string, after: string = before) {
        const ta = textareaRef.current;
        if (!ta) return;
        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        const selected = body.slice(start, end);
        const next =
            body.slice(0, start) + before + selected + after + body.slice(end);
        setBody(next);
    }

    async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        const { url } = await uploadImage(file, getPassword()!);
        const insert = `![${file.name}](${url})`;

        const cursor = textareaRef.current?.selectionStart ?? body.length;
        const next = body.slice(0, cursor) + insert + body.slice(cursor);
        setBody(next);
    }
    return (
        <>
            <Navbar></Navbar>
            <div className={styles.editor}>
                <div className={styles.editorPanel}>
                    {alert ? <Alert alertText={alert} /> : <></>}
                    <div className={styles.editorEntrySelect}>
                        <Select
                            classNamePrefix="rs"
                            className={`basic-multi-select ${styles.tagSelector}`}
                            options={(entries ?? []).map((entry) => ({
                                ["value"]: entry.id,
                                ["label"]: entry.title,
                            }))}
                            onChange={(selected) => {
                                if (
                                    entryChanged &&
                                    selectedEntry &&
                                    !window.confirm(
                                        "Discard unsaved changes?",
                                    )
                                )
                                    return;
                                const entry =
                                    entries?.find(
                                        (e) => e.id === selected?.value,
                                    ) ?? null;
                                setSelectedEntry(entry);
                                setTitle(entry?.title ?? "");
                                setDate(entry?.date ?? getCurrentDate());
                                setBody(entry?.content ?? "");
                                setDescription(entry?.description ?? "");
                                setEntryChanged(false);
                            }}
                        ></Select>
                    </div>
                    <div className={styles.editorMetadataInput}>
                        <label>
                            Title:{" "}
                            <input
                                name="titleInput"
                                onChange={(e) => { setTitle(e.target.value); setEntryChanged(true); }}
                                value={title ?? ""}
                            />
                        </label>
                        <label>
                            Date:{" "}
                            <input
                                name="dateInput"
                                // defaultValue={getCurrentDate()}
                                onChange={(e) => { setDate(e.target.value); setEntryChanged(true); }}
                                value={date ?? ""}
                            />
                        </label>
                    </div>
                    <textarea
                        className={styles.editorDescription}
                        name="descriptionInput"
                        placeholder="Short description..."
                        onChange={(e) => { setDescription(e.target.value); setEntryChanged(true); }}
                        value={description ?? ""}
                    />

                    <div className={styles.editorInput}>
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            style={{ display: "none" }}
                            onChange={handleImageUpload}
                        />
                        <div className={styles.editorToolbar}>
                            <span className={styles.editorToolbarLabel}>
                                Content:
                            </span>
                            <div>
                                <button
                                    className={styles.editorToolbarButton}
                                    onClick={() => wrapSelection("**")}
                                >
                                    B
                                </button>
                                <button
                                    className={styles.editorToolbarButton}
                                    onClick={() => wrapSelection("*")}
                                >
                                    I
                                </button>
                                <button
                                    className={styles.editorToolbarButton}
                                    onClick={() => wrapSelection("\n- ", "")}
                                >
                                    •
                                </button>
                                <button
                                    className={styles.editorToolbarButton}
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                >
                                    + img
                                </button>
                            </div>
                        </div>
                        <textarea
                            ref={textareaRef}
                            name="postContent"
                            value={body}
                            onChange={(e) => { setBody(e.target.value); setEntryChanged(true); }}
                        />
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
                    <div className={styles.tagSelectorContainer}>
                        <label>
                            Tags:
                            <CreatableSelect
                                isClearable
                                isMulti
                                classNamePrefix="rs"
                                className={`basic-multi-select ${styles.tagSelector}`}
                                options={tags?.map((tag) => ({
                                    ["value"]: tag,
                                    ["label"]: tag,
                                }))}
                                onChange={(selected) =>
                                    setSelectedTags(
                                        selected as {
                                            value: string;
                                            label: string;
                                        }[],
                                    )
                                }
                            />
                        </label>
                    </div>
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
                                    : styles.previewToggleInactive
                            }
                            onClick={() => setPreviewMode("entry")}
                        >
                            Full Entry
                        </button>
                        <button
                            className={
                                previewMode === "list"
                                    ? styles.previewToggleActive
                                    : styles.previewToggleInactive
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
