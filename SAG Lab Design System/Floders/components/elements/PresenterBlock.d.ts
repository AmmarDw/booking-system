export interface PresenterBlockProps {
  /** Presenter name, Arabic. */
  name?: string;
  /** Role line, Arabic. */
  role?: string;
  /** Organisation / endorsement line. */
  org?: string;
  /** Photo URL. Falls back to a labelled placeholder circle. */
  photo?: string;
  alt?: string;
  /** 180px circle (default) or 112px "compact". */
  size?: "default" | "compact";
  className?: string;
  style?: React.CSSProperties;
}
export declare function PresenterBlock(props: PresenterBlockProps): JSX.Element;
