import { FreezerListener } from "./index";
import { useEffect, useState } from "react";

type ChangeHandler<T> = (current: T, prev?: T) => void;
type CleanupFn = () => void;

export default abstract class Model<T> {
  protected listener: FreezerListener;
  listenForChanges(handler) {
    this.listener.on("update", handler);
    return () => {
      this.listener.off("update", handler);
    };
  }
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
