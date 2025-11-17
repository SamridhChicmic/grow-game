declare module "*.json";

interface svgProps {
  className?: string;
}

interface formData {
  email: string;
  password: string | number;
  firstName: string;
  lastName: string;
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  disabled?: boolean;
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

interface SideNavigationLink {
  href: string;
  linkText: string;
  leading: React.FC<React.SVGProps<SVGElement>>;
}

type Tag = {
  id: string;
  name: string;
  owner: string;
};

type Folder = {
  id: string;
  name: string;
  owner: string;
};

type CheckValue = { checked: boolean; label: string };

interface Content {
  type: "heading" | "image" | "paragraph" | "video" | "file" | "check" | "link";
  value: File | string | CheckValue; //other image types
}

interface TypographyProps extends React.HTMLProps<HTMLHeadingElement> {
  children?: React.ReactNode;
  className?: string;
}

type MenuItem = {
  icon: React.ReactNode;
  label: string;
  href?: string;
  type?: "button" | "link";
  action?(
    options?: { handleLoading: (loadingState: boolean) => void },
    ...args: any
  ): void;
};

type APIResponse<T = any> = {
  success: boolean;
  message: string;
  data?: T;
};

type User = {
  id: string;
  username: string;
  background?: string;
  email: string;
  photo: string;
};

type Player = {
  user?: { username: string; photo: string };
  multiplier: number;
  bet: number;
  profit: number;
};

type UserProfile = {
  uid: string;
  isVerified?: boolean;
  username: string;
  email: string;
  photo: string;
  level: number;
  gamesWon: number;
  totalBets: number;
  totalWagered?: number;
  allTimeHigh?: number;
  allTimeLow?: number;
  netProfit?: number;
  joinDate: string;
};
