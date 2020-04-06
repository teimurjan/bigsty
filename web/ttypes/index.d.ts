export type Then<T> = T extends PromiseLike<infer U> ? U : T;
