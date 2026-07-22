export interface TableColumn { key: string; label: string; }
export interface TableProps {
  columns: TableColumn[];
  rows: Record<string, React.ReactNode>[];
}
export declare function Table(props: TableProps): JSX.Element;
