import { SectionBadgeProps } from "../elements/SectionBadge";
export interface TableColumn {
  /** Header cell content. */
  label: React.ReactNode;
  /** Any CSS width for the column. */
  width?: string;
  /** Tabular-numeric cells for this column. */
  numeric?: boolean;
}
export interface SlideTableProps {
  title: string;
  badge?: SectionBadgeProps;
  /** Caption above the table, 18px. */
  caption?: string;
  /** Columns, or plain strings for label-only columns. */
  columns?: (TableColumn | string)[];
  /** Row cells, max 8 rows — split into ١/٢ and ٢/٢ beyond that. */
  rows?: React.ReactNode[][];
  /** 0-based row to highlight. */
  focusRow?: number;
  surface?: "light" | "dark";
  day?: string;
  slideNumber?: number | string;
}
export declare function SlideTable(props: SlideTableProps): JSX.Element;
