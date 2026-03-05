import type { FilterListProps } from "../../types/FilterList";
import styles from "./FilterList.module.css";

export default function FilterList({
    tags,
    activeTags = [],
    onToggle,
    onClear,
}: FilterListProps) {
    return (
        <div>
            <label
                className={`${styles.filterListLabel} ${styles.filterListNone}`}
            >
                <input
                    className={styles.filterListCheckbox}
                    type="checkbox"
                    checked={activeTags.length === 0}
                    onChange={onClear}
                />
                None
            </label>
            {tags.map((tag) => (
                <label key={tag} className={styles.filterListLabel}>
                    <input
                        className={styles.filterListCheckbox}
                        type="checkbox"
                        checked={activeTags.includes(tag)}
                        onChange={() => onToggle(tag)}
                    />
                    {tag}
                </label>
            ))}
        </div>
    );
}
