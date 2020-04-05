export declare interface FreezerOptions {
  mutable?: boolean;
  live?: boolean;
  freezeInstances?: boolean;
}

export interface HubOptions extends FreezerOptions {
  cacheKey?: string;
  cacheEnabled?: boolean;
}
export declare interface FreezerListener {
  on: (eventName: string, cb: (...params: any[]) => void) => void;
  once: (eventName: string, cb: (...params: any[]) => void) => void;
  off: (eventName: string, cb: (...params: any[]) => void) => void;
  emit: (eventName: string, ...params: any[]) => void;
}

export interface FreezerObject {
  toJS?(): any;
  set?(newState: any): { now: () => void };
  reset?(object: any): { now: () => void };
  getListener(): FreezerListener;
}

declare global {
  interface Array<T> extends FreezerObject {}
  interface Object extends FreezerObject {}
}

export interface Hub<T> extends FreezerListener {
  freezer: any;
  cacheState: () => void;
  trigger: (key: string, ...args) => void;
  [key: string]: any;
  state: T;
}
