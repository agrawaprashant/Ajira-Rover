class Store {
  static storage: any = {};
  getItem = (key: string): any => {
    return Store.storage[key];
  };
  storeItem = (key: string, item: any): void => {
    Store.storage[key] = item;
  };
}

export default Store;
