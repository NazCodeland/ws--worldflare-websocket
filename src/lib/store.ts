export class Store<T extends number | string> {
  private subscribers: ((storeValue: T) => void)[] = [];
  constructor(private storeValue: T) {
    this.storeValue = storeValue;
  }
  get value() {
    return this.storeValue;
  }
  set(newValue: T) {
    this.storeValue = newValue;
    for (const subscribe of this.subscribers) {
      subscribe(this.storeValue);
    }
  }
  update(callback: (storeValue: T) => T) {
    this.set(callback(this.storeValue));
  }
  subscribe(callback: (storeValue: T) => void) {
    this.subscribers.push(callback);
    callback(this.storeValue);
    return () => {
      this.subscribers.splice(this.subscribers.indexOf(callback), 1);
    };
  }
}
