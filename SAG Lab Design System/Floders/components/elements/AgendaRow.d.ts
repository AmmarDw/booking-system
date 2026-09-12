export interface AgendaRowProps {
  /** Session name, Arabic. */
  name: string;
  /** What happens in it — one short clause. */
  what?: string;
  /** Duration string for the trailing TimingPill, e.g. "٤٥ دقيقة". */
  duration?: string;
  /** "active" highlights with teal; "done" dims to 55%. */
  state?: "default" | "active" | "done";
  className?: string;
  style?: React.CSSProperties;
}
export declare function AgendaRow(props: AgendaRowProps): JSX.Element;
