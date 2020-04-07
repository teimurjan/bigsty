export type Then<T> = T extends PromiseLike<infer U> ? U : T;

declare var __SERVER_CONTEXT: { [key: string]: string };
