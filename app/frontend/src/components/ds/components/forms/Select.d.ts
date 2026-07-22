export interface SelectOption { label: string; value: string; }
export interface SelectProps {
  label?: string;
  options: SelectOption[];
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
  id?: string;
}
export declare function Select(props: SelectProps): JSX.Element;
