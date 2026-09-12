import { SectionBadgeProps } from "../elements/SectionBadge";
export interface SplitColumn {
  /** Column heading, 30px semibold. */
  label?: string;
  /** Bulleted items. */
  items?: React.ReactNode[];
  /** Arbitrary content instead of / below the items. */
  children?: React.ReactNode;
}
export interface SlideSplitProps {
  title?: string;
  badge?: SectionBadgeProps;
  /** Right-hand column (reading order first). */
  start?: SplitColumn;
  /** Left-hand column. */
  end?: SplitColumn;
  /** Drop the card surfaces and show bare columns. Default false. */
  plain?: boolean;
  surface?: "light" | "dark";
  day?: string;
  slideNumber?: number | string;
}
export declare function SlideSplit(props: SlideSplitProps): JSX.Element;
