export interface MediaCallout {
  /** Numbered dot label. Defaults to its index + 1. */
  n?: number | string;
  /** Position from the start (right) edge, any CSS length or %. */
  x: string;
  /** Position from the top, any CSS length or %. */
  y: string;
}
export interface MediaFrameProps {
  /** Image or video URL. Omitted = hatched placeholder. */
  src?: string;
  alt?: string;
  /** Treat src as a looping muted video. Default false. */
  video?: boolean;
  poster?: string;
  /** Caption beneath the frame, 18px. */
  caption?: string;
  /** Placeholder copy when no src. */
  placeholder?: string;
  /** Numbered dots overlaid to point at UI. */
  callouts?: MediaCallout[];
  /** "fill" stretches to the parent (default), or lock 16x9 / 4x3. */
  ratio?: "fill" | "16x9" | "4x3";
  className?: string;
  style?: React.CSSProperties;
}
export declare function MediaFrame(props: MediaFrameProps): JSX.Element;
