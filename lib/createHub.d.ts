import { Hub, HubOptions } from "interfaces";
export default function createHub<T>(defaultState: T, opts: HubOptions): Hub<T>;
