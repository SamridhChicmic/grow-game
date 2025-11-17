export type AriaValueFormat = (value: number) => string;
export type SemanticName = "tracks" | "track" | "rail" | "handle";
export type SliderClassNames = Partial<Record<SemanticName, string>>;
export type SliderStyles = Partial<Record<SemanticName, React.CSSProperties>>;
export type OnStartMove = (
  e: React.MouseEvent | React.TouchEvent,
  valueIndex: number,
  startValues?: number[],
) => void;

export interface MarkObj {
  style?: React.CSSProperties;
  label?: React.ReactNode;
}

interface RenderProps {
  index: number;
  prefixCls: string;
  value: number;
  dragging: boolean;
}

export interface HandleProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "onFocus" | "onMouseEnter"
  > {
  prefixCls: string;
  style?: React.CSSProperties;
  value: number;
  valueIndex: number;
  dragging: boolean;
  onStartMove: OnStartMove;
  onOffsetChange: (value: number | "min" | "max", valueIndex: number) => void;
  onFocus: (e: React.FocusEvent<HTMLDivElement>, index: number) => void;
  onMouseEnter: (e: React.MouseEvent<HTMLDivElement>, index: number) => void;
  render?: (
    origin: React.ReactElement<React.HTMLAttributes<HTMLDivElement>>,
    props: RenderProps,
  ) => React.ReactElement;
  onChangeComplete?: () => void;
  mock?: boolean;
}

export interface HandlesProps {
  prefixCls: string;
  style?: React.CSSProperties | React.CSSProperties[];
  values: number[];
  onStartMove: OnStartMove;
  onOffsetChange: (value: number | "min" | "max", valueIndex: number) => void;
  onFocus?: (e: React.FocusEvent<HTMLDivElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLDivElement>) => void;
  handleRender?: HandleProps["render"];
  /**
   * When config `activeHandleRender`,
   * it will render another hidden handle for active usage.
   * This is useful for accessibility or tooltip usage.
   */
  activeHandleRender?: HandleProps["render"];
  draggingIndex: number;
  onChangeComplete?: () => void;
}

export interface SliderProps<ValueType = number | number[]> {
  prefixCls?: string;
  className?: string;
  style?: React.CSSProperties;
  classNames?: SliderClassNames;
  styles?: SliderStyles;
  disabled?: boolean;
  keyboard?: boolean;
  autoFocus?: boolean;
  onFocus?: (e: React.FocusEvent<HTMLDivElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLDivElement>) => void;
  range?: boolean;
  count?: number;
  min?: number;
  max?: number;
  step?: number | null;
  value?: ValueType;
  defaultValue?: ValueType;
  // COMEBACK: Check ValueType
  onChange?: (value: ValueType) => void;
  /** @deprecated It's always better to use `onChange` instead */
  onBeforeChange?: (value: ValueType) => void;
  /** @deprecated Use `onChangeComplete` instead */
  onAfterChange?: (value: ValueType) => void;
  onChangeComplete?: (value: ValueType) => void;
  allowCross?: boolean;
  pushable?: boolean | number;
  /** range only */
  draggableTrack?: boolean;
  reverse?: boolean;
  vertical?: boolean;
  included?: boolean;
  startPoint?: number;
  /** @deprecated Please use `styles.track` instead */
  trackStyle?: React.CSSProperties | React.CSSProperties[];
  /** @deprecated Please use `styles.handle` instead */
  handleStyle?: React.CSSProperties | React.CSSProperties[];
  /** @deprecated Please use `styles.rail` instead */
  railStyle?: React.CSSProperties;
  dotStyle?: React.CSSProperties | ((dotValue: number) => React.CSSProperties);
  activeDotStyle?:
    | React.CSSProperties
    | ((dotValue: number) => React.CSSProperties);
  marks?: Record<string | number, React.ReactNode | MarkObj>;
  dots?: boolean;
  handleRender?: HandlesProps["handleRender"];
  activeHandleRender?: HandlesProps["handleRender"];
  tabIndex?: number | number[];
  ariaLabelForHandle?: string | string[];
  ariaLabelledByForHandle?: string | string[];
  ariaValueTextFormatterForHandle?: AriaValueFormat | AriaValueFormat[];
}
