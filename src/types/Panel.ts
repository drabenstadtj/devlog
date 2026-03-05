import type { ReactNode } from "react";

export type PanelProps = {
    title: string;
    meta?: string;
    content?: string;
    tags?: string[];
    href?: string;
    children?: ReactNode;
    collapsible?: boolean;
};

export type PanelListProps = {
    panels: PanelProps[];
    filterTag?: string;
    sort?: "asc" | "desc";
};
