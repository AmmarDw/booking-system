export interface ClosingSkill {
  /** One line of Arabic. */
  text: string;
  /** Lucide icon name. Default "check". */
  icon?: string;
}
export interface SlideClosingProps {
  title?: string;
  /** Skills earned today — rendered as done SkillCards. Strings are accepted. */
  accomplished?: (ClosingSkill | string)[];
  /** Tomorrow's bullets. */
  next?: React.ReactNode[];
  accomplishedLabel?: string;
  nextLabel?: string;
  /** Default "dark". */
  surface?: "light" | "dark";
  day?: string;
  slideNumber?: number | string;
  progress?: React.ReactNode;
}
export declare function SlideClosing(props: SlideClosingProps): JSX.Element;
