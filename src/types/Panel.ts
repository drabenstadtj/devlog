export type PanelProps = {
  title: string;
  meta?: string;
  content: string;
  tags?: string[];
};

export type PanelListProps = {
  panels: PanelProps[];
  filterTag?: string;
  sort?: "asc" | "desc";
};
