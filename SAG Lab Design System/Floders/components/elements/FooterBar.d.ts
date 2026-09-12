export interface FooterBarProps {
  /** Day label, Arabic, e.g. "اليوم السابع". */
  day?: string;
  /** Slide number, Latin digits, LTR-isolated. */
  slideNumber?: number | string;
  /** Optional node in the centre zone — usually <DayProgress/>. */
  progress?: React.ReactNode;
  /** Show the SAG TECH endorsement mark. Default true. */
  showMark?: boolean;
  className?: string;
  style?: React.CSSProperties;
}
export declare function FooterBar(props: FooterBarProps): JSX.Element;
