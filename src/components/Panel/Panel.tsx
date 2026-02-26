import styles from "./Panel.module.css";
import type { PanelProps } from "../../types/Panel";

export default function Panel({ title, meta, content }: PanelProps) {
  return (
    <div className={styles.panel}>
      <div className={styles.panelHeading}>
        <h2>{title}</h2>
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
