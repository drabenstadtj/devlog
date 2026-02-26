import styles from "./PanelList.module.css";
import type { PanelProps, PanelListProps } from "../../types/Panel";
import Panel from "../Panel/Panel";

export default function PanelList({ panels }: PanelListProps) {
  return (
    <div className={styles.panelList}>
      {panels.map((panel, index) => (
        <Panel key={index} {...panel} />
      ))}
    </div>
  );
}
