import { Storage } from 'ttypes/storage';

export interface ICartItem {
  id: number;
  count?: number;
}

export interface ICartStorage {
  getItems(): ICartItem[];
  getItem(id: number): ICartItem | undefined;
  add(item: ICartItem): number;
  remove(item: ICartItem): number;
  setItems(items: ICartItem[]): void;
  clear(): void;
  addChangeListener(listener: Listener): () => void;
}

type Listener = (items: ICartItem[]) => void;

export class CartStorage implements ICartStorage {
  private listeners: Set<Listener>;
  private storage: Storage;
  constructor(storage: Storage) {
    this.storage = storage;
    this.listeners = new Set();
  }

  public getItems(): ICartItem[] {
    try {
      const rawCartItems = this.storage.getItem('cart');
      return rawCartItems ? JSON.parse(rawCartItems) : [];
    } catch (e) {
      this.clear();
      return [];
    }
  }

  public setItems(items: ICartItem[]) {
    this.listeners.forEach(l => l(items));
    this.storage.setItem('cart', JSON.stringify(items));
  }

  public getItem(id: number) {
    const cartItems = this.getItems();
    return cartItems.find(cartItem => cartItem.id === id);
  }

  private updateItem(item: ICartItem, delta: number) {
    const cartItems = this.getItems();
    const existingItem = this.getItem(item.id);
    if (existingItem) {
      const newCount = (existingItem.count || 0) + delta;
      this.setItems(
        newCount === 0
          ? cartItems.filter(item => item.id !== existingItem.id)
          : cartItems.map(item => (item.id === existingItem.id ? { ...existingItem, count: newCount } : item)),
      );
      return newCount;
    } else if (delta > 0) {
      this.setItems([...cartItems, { ...item, count: delta }]);
      return delta;
    }

    return 0;
  }

  public add(item: ICartItem) {
    return this.updateItem(item, 1);
  }

  public remove(item: ICartItem) {
    return this.updateItem(item, -1);
  }

  public clear() {
    this.storage.removeItem('cart');
  }

  public addChangeListener(listener: Listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}
