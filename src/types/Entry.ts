import type { PanelProps } from "./Panel";

export type EntryData = Omit<PanelProps, "meta"> & {
    id: string;
    date: string;
    description?: string;
};
