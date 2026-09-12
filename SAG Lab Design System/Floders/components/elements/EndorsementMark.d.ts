export interface EndorsementMarkProps {
  /** Default "footnote" — the footer size. */
  size?: "hero" | "standard" | "footnote";
  /** Show the SAG TECH / ساج التقنية lockup text. Default true. */
  showText?: boolean;
  className?: string;
  style?: React.CSSProperties;
}
export declare function EndorsementMark(props: EndorsementMarkProps): JSX.Element;
