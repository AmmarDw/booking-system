export interface InputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  disabled?: boolean;
  error?: string;
  hint?: string;
  id?: string;
}
export declare function Input(props: InputProps): JSX.Element;
