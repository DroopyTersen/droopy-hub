import { FreezerListener } from "./index";
export default abstract class Model<T> {
    protected listener: FreezerListener;
    listenForChanges(handler: any): () => void;
}
export declare function useModel<T>(T: new (...args: any[]) => T, ...args: any[]): any;
export declare function useWatchModel(model: Model<any>): void;
