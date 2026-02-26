import styles from "./Panel.module.css";
import type { PanelProps } from "../../types/Panel";
import { Link } from "react-router-dom";

export default function Panel({ title, meta, content, href }: PanelProps) {
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
      </div>
      <div className={styles.panelContent}>
        <p>{content}</p>
      </div>
    </div>
  );
}
