export interface FileTreeProps {
  /** The tree as a single pre-formatted string (box-drawing characters welcome). */
  tree: string;
  /** Arabic annotations listed beside the block, start-aligned. */
  notes?: React.ReactNode[];
  className?: string;
  style?: React.CSSProperties;
}
export declare function FileTree(props: FileTreeProps): JSX.Element;
