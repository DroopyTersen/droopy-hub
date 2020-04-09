import { FreezerListener } from "./index";
import { useEffect, useState, useMemo } from "react";

type ChangeHandler<T> = (current: T, prev?: T) => void;

export default abstract class Model<T> {
  protected getDependencies(): any[] {
    return [];
  }

  listenForChanges(handler: ChangeHandler<T>) {
    let listeners: FreezerListener[] = this.getDependencies()
      .filter((freezerObject) => freezerObject && freezerObject.getListener)
      .map((freezerObject) => freezerObject.getListener());

    for (var i = 0; i < listeners.length; i++) {
      if (listeners[i].on) {
        listeners[i].on("update", handler);
      }
    }

    return () => {
      for (var i = 0; i < listeners.length; i++) {
        if (listeners[i].off) {
          listeners[i].off("update", handler);
        }
      }
    };
  }
}

export function useModel<T>(T: new (...args) => T, ...args): T {
  let model = useMemo(() => {
    return new T(...args);
  }, [...args]);
  useWatchModel(model as any);
  return model;
}

export function useWatchModel(model: Model<any>): void {
  let [_, forceRefresh] = useState(Date.now());
  useEffect(() => {
    let handler = (..._args) => {
      // console.log("MODEL UPDATE", args);
      forceRefresh(Date.now());
    };
    return model.listenForChanges(handler);
  }, [model]);
}
