export interface DayProgressProps {
  /** Bootcamp length. Default 10. */
  totalDays?: number;
  /** 1-based active day. Default 1. */
  activeDay?: number;
  /** 0–100 position within the day; omit to hide the sub-bar. */
  within?: number;
  /** Override the Arabic label. */
  label?: string;
  className?: string;
  style?: React.CSSProperties;
}
export declare function DayProgress(props: DayProgressProps): JSX.Element;
