import { FreezerListener } from "./index";
import { useEffect, useState, useMemo } from "react";

type ChangeHandler<T> = (current: T, prev?: T) => void;
type CleanupFn = () => void;

export default abstract class Model<T> {
  protected listener: FreezerListener;
  listenForChanges(handler) {
    if (this.listener) {
      this.listener.on("update", handler);
    }
    return () => {
      if (this.listener) {
        this.listener.off("update", handler);
      }
    };
  }
}

export function useModel<T>(T: new (...args) => T, ...args) {
  let model = useMemo(() => {
    return new T(...args);
  }, [...args]);
  useWatchModel(model as any);
  return model;
}

export function useWatchModel(model: Model<any>) {
  let [_, forceRefresh] = useState(Date.now());
  useEffect(() => {
    let handler = (...args) => {
      // console.log("MODEL UPDATE", args);
      forceRefresh(Date.now());
    };
    return model.listenForChanges(handler);
  }, [model]);
}
