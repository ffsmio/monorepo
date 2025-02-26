export type ControlStyle = string | Record<string, string | number | undefined>;

export type ControlVariant = 'standard' | 'outlined' | 'filled';

export interface ControlAdornment {
  name: string;
  className?: string;
  style?: ControlStyle;
  type: 'icon' | 'text' | 'button';
  triggerName?: string;
}

export interface ControlAdornments {
  start?: ControlAdornment;
  end?: ControlAdornment;
}

export interface ControlCommon {
  name: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  hidden?: boolean;
  placeholder?: string;
  hint?: string;
  helper?: string;
  error?: string;
  className?: string;
  style?: ControlStyle;
  adornments?: ControlAdornments;
}

export interface ControlLayout<Control extends ControlCommon> {
  grid: number;
  span: Record<string, Control>;
}
