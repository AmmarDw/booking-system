export interface StepChipProps {
  /** Step number (Latin digits, LTR). */
  n?: number | string;
  /** upcoming = hairline outline, active = teal, done = navy check. Default "upcoming". */
  state?: "upcoming" | "active" | "done";
  /** 64px default, 44px "sm". */
  size?: "default" | "sm";
  className?: string;
  style?: React.CSSProperties;
}
export declare function StepChip(props: StepChipProps): JSX.Element;
