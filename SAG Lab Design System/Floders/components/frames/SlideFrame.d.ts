export interface SlideFrameProps {
  /** "light" (white/snow, ink text) or "dark" (brand-deep, white text). Default "light". */
  surface?: "light" | "dark";
  /** Day label passed to the default FooterBar. */
  day?: string;
  /** Slide number passed to the default FooterBar. */
  slideNumber?: number | string;
  /** Node for the footer's centre zone, usually <DayProgress/>. */
  progress?: React.ReactNode;
  /** Replace the whole footer. Pass null for an empty (still reserved) zone. */
  footer?: React.ReactNode;
  showMark?: boolean;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function SlideFrame(props: SlideFrameProps): JSX.Element;
