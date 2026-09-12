export interface IconProps {
  /** Lucide icon name, kebab or Pascal ("clock", "AlertTriangle"). */
  name: string;
  /** Rendered box in px. Default 24. */
  size?: number;
  /** Stroke width. The system uses 2 everywhere. Default 2. */
  strokeWidth?: number;
  className?: string;
  style?: React.CSSProperties;
}
export declare function Icon(props: IconProps): JSX.Element;
