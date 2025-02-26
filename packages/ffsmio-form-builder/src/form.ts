import { ControlCommon, ControlLayout } from './common';

export interface FormBuilder {
  title?: string;
  description?: string;
  caption?: string;
  layout: ControlLayout<ControlCommon>[];
}
