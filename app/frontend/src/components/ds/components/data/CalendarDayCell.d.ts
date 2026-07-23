export interface CalendarDayCellProps {
  day: number;
  /** Availability-pressure state: high (>=4 slots), medium (3), low (1-2), none (weekend/no slots), booked */
  status?: 'high' | 'medium' | 'low' | 'none' | 'booked';
  /** Number of open slots shown as a badge (omitted for none/booked) */
  count?: number;
  /** Total slots that day — when set, the badge reads "available/total" (e.g. "3/8") per FR-9 */
  total?: number;
  selected?: boolean;
  onClick?: () => void;
}
export declare function CalendarDayCell(props: CalendarDayCellProps): JSX.Element;
