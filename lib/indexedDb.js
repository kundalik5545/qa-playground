// IndexedDB helper for QA Study Tracker
const DB_NAME = "qa-playground-db";
const DB_VERSION = 1;
const STORE_NAME = "study-tracker";

function openDb() {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return reject(new Error("No window"));
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "key" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function setIdbItem(key, value) {
  try {
    const db = await openDb();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    store.put({ key, value });
    return tx.complete;
  } catch (err) {
    console.warn("IndexedDB setIdbItem failed", err);
  }
}

export async function getIdbItem(key) {
  try {
    const db = await openDb();
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const data = await new Promise((resolve, reject) => {
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    return data ? data.value : null;
  } catch (err) {
    console.warn("IndexedDB getIdbItem failed", err);
    return null;
  }
}

export async function deleteIdbItem(key) {
  try {
    const db = await openDb();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    store.delete(key);
    return tx.complete;
  } catch (err) {
    console.warn("IndexedDB deleteIdbItem failed", err);
  }
}

export async function clearDb() {
  try {
    const db = await openDb();
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).clear();
    return tx.complete;
  } catch (err) {
    console.warn("IndexedDB clearDb failed", err);
  }
}
