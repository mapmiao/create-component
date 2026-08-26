export type Language = 'ts' | 'js';

export type ComponentType = 'simple' | 'styled' | 'complex';

export interface CreateComponentOptions {
  targetDirectory: string;
  componentName: string;
  language: Language;
  type: ComponentType;
}