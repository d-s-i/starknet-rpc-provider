import * as RPCProvider from "../index";

export type StandardProvider<T> = { [K in keyof T]: T[K] };

export interface StringMap { [key: string]: any };