export enum Table {
  Temperature = 'temperature',
  Precipitation = 'precipitation',
}

/**
 * Request for data
 * @param url request
 * @returns data
 */
export async function fetchData<T>(url: string): Promise<T[]> {
  const res = await fetch(url);

  if (res.ok) {
    return await res.json();
  }

  throw new Error();
}

/**
 * promise with IDBDatabase instanse
 */
const dbPromise = new Promise<IDBDatabase>((res, rej) => {
  if (!indexedDB) {
    const error = "Your browser doesn't support indexedDB";
    console.warn(error);
    rej(error);
  }

  let openRequest = indexedDB.open('testtaskmq', 1);

  openRequest.onupgradeneeded = function () {
    let db = openRequest.result;

    Object.values(Table).forEach((table) => {
      console.log(table);
      if (!db.objectStoreNames.contains(table)) {
        db.createObjectStore(table, { autoIncrement: true });
      }
    });
  };

  openRequest.onerror = function () {
    console.error('Error', openRequest.error);
    rej(openRequest.error);
  };

  openRequest.onsuccess = function () {
    res(openRequest.result);
  };
});

/**
 * Get promise with data from indexedDB table
 * @param table table name in indexedDB
 * @returns Promise<T>
 */
export function getData<T>(table: Table): Promise<T[]> {
  return dbPromise.then((db) => {
    if (!(db instanceof IDBDatabase)) {
      throw "Your browser doesn't support indexedDB";
    }

    let tx = db.transaction(table, 'readonly');
    let store = tx.objectStore(table);
    let query = store.getAll();

    return new Promise((res, rej) => {
      query.onsuccess = () => {
        res(query.result);
      };

      query.onerror = () => {
        console.warn(query.error);
        rej(query.error);
      };
    });
  });
}

/**
 * Add data to indexedDB table
 * @param table table name in indexedDB
 * @param data data to add
 * @returns void
 */
export function addData<T>(table: Table, data: T[]): Promise<void> {
  return dbPromise.then((db) => {
    if (!(db instanceof IDBDatabase)) {
      throw "Your browser doesn't support indexedDB";
    }

    let tx = db.transaction(table, 'readwrite');
    let store = tx.objectStore(table);

    return new Promise<void>((res, rej) => {
      tx.oncomplete = () => res();
      tx.onerror = () => rej();

      data.forEach((value) => {
        store.add(value);
      });
    });
  });
}
