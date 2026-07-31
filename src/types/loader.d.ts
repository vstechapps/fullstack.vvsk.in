export interface Loader {
  init(): Promise<void>;
  show(): Promise<void>;
  hide(): Promise<void>;
}
