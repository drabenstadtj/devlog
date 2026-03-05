import styles from "./Panel.module.css";
import type { PanelProps } from "../../types/Panel";
import { Link } from "react-router-dom";
import { useState } from "react";
import Markdown from "react-markdown";

export default function Panel({
    title,
    meta,
    content,
    href,
    children,
    collapsible = false,
}: PanelProps) {
    const [isCollapsed, setCollapsed] = useState(false);

    return (
        <div className={styles.panel}>
            <div className={styles.panelHeading}>
                {href ? (
                    <Link to={href}>
                        <h2>{title}</h2>
                    </Link>
                ) : (
                    <h2>{title}</h2>
                )}
                <div className={styles.panelMeta}>
                    <p>{meta}</p>
                </div>
                {collapsible && (
                    <button
                        className={`${styles.panelDropdownButton} ${isCollapsed ? styles.panelDropdownButtonCollapsed : ""}`}
                        onClick={() => setCollapsed(!isCollapsed)}
                    >
                        ▼
                    </button>
                )}
            </div>
            {(!collapsible || !isCollapsed) && (
                <div className={styles.panelContent}>
                    {children ?? (
                        <Markdown
                            components={{
                                img: ({ src, alt }) => (
                                    <figure className={styles.markdownFigure}>
                                        <img
                                            src={src}
                                            alt={alt}
                                            className={styles.markdownImage}
                                        />
                                        {alt && (
                                            <figcaption
                                                className={styles.markdownCaption}
                                            >
                                                {alt}
                                            </figcaption>
                                        )}
                                    </figure>
                                ),
                                p: ({ children }) => (
                                    <p className={styles.markdownParagraph}>
                                        {children}
                                    </p>
                                ),
                            }}
                        >
                            {content ?? ""}
                        </Markdown>
                    )}
                </div>
            )}
        </div>
    );
}
