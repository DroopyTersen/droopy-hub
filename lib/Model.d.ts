declare type ChangeHandler<T> = (current: T, prev?: T) => void;
export default abstract class Model<T> {
    protected getDependencies(): any[];
    listenForChanges(handler: ChangeHandler<T>): () => void;
}
export declare function useModel<T>(T: new (...args: any[]) => T, ...args: any[]): T;
export declare function useWatchModel(model: Model<any>): void;
export {};
