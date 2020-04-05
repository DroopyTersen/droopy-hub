import { FreezerListener } from "./index";
export default abstract class Model<T> {
    protected listener: FreezerListener;
    listenForChanges(handler: any): () => void;
}
export declare function useWatchModel(model: Model<any>): void;
