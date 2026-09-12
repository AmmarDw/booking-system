export interface LogoZoneProps {
  /** hero = title & divider slides, standard = in-slide, footnote = inline. Default "standard". */
  size?: "hero" | "standard" | "footnote";
  /** Wordmark lines, start (right) aligned. Default ["ساج","لاب"]. */
  lines?: string[];
  /** Show the "placeholder wordmark" note. Default false. */
  showNote?: boolean;
  className?: string;
  style?: React.CSSProperties;
}
export declare function LogoZone(props: LogoZoneProps): JSX.Element;
