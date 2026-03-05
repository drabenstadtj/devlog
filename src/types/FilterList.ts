export type FilterListProps = {
    tags: string[];
    activeTags?: string[];
    onToggle: (tag: string) => void;
    onClear: () => void;
};
