export type ButtonProps = {
  children: React.ReactNode | string;
  full?: boolean;
  color?: "primary" | "accent" | "error" | "gray";
  text?: "xs" | "sm" | "lg" | "xl";
  loading?: boolean;
  className?: string;
};
