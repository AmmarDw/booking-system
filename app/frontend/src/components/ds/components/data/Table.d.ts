export interface TableColumn { key: string; label: string; }
export interface TableProps {
  columns: TableColumn[];
  rows: Record<string, React.ReactNode>[];
  onRowClick?: (row: Record<string, React.ReactNode>, index: number) => void;
}
export declare function Table(props: TableProps): JSX.Element;
