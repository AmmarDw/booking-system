export interface AccordionItem { title: string; content: React.ReactNode; }
export interface AccordionProps {
  items: AccordionItem[];
}
export declare function Accordion(props: AccordionProps): JSX.Element;
