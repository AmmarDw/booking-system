export interface CalendarDayCellProps {
  day: number;
  /** Availability-pressure state: high (>=4 slots), medium (3), low (1-2), none (weekend/no slots), booked */
  status?: 'high' | 'medium' | 'low' | 'none' | 'booked';
  /** Number of open slots shown as a badge (omitted for none/booked) */
  count?: number;
  selected?: boolean;
  onClick?: () => void;
}
export declare function CalendarDayCell(props: CalendarDayCellProps): JSX.Element;
