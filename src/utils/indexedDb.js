import { v4 as uuidv4 } from 'uuid';

let db;
let request = indexedDB.open('audit_log', 1);

request.onupgradeneeded = function(event) {
  db = event.target.result;

  // Create the first object store
  let objectStore1 = db.createObjectStore('logs1', { keyPath: 'key' });
  objectStore1.createIndex('event_type', 'event_type', { unique: false });
  objectStore1.createIndex('metadata', 'metadata', { unique: false });

  // Create the second object store
  let objectStore2 = db.createObjectStore('logs2', { keyPath: 'key' });
  objectStore2.createIndex('event_type', 'event_type', { unique: false });
  objectStore2.createIndex('metadata', 'metadata', { unique: false });
};

request.onsuccess = function(event) {
  db = event.target.result;
  console.log('Database opened successfully');
};

request.onerror = function(event) {
  console.error("Database error: " + event.target.errorCode);
};

// Function to add audit log to logs1 store
export function addAuditLog1(event_type, metadata) {
  if (!db) {
    console.error('Database not initialized');
    return;
  }
  let transaction = db.transaction(['logs1'], 'readwrite');
  let objectStore = transaction.objectStore('logs1');
  let auditKey = uuidv4();
  let request = objectStore.add({ key: auditKey, event_type: event_type, metadata: metadata });
  request.onsuccess = function(event) {
    console.log('Audit log added to logs1 successfully');
  };
  request.onerror = function(event) {
    console.error('Error adding audit log to logs1', event.target.error);
  };
}

// Function to get audit log from logs1 by audit_key
// Function to get audit log from logs1 by audit_key

export function getAuditLog1() {
  return new Promise((resolve, reject) => {
    if (!db) {
      console.error('Database not initialized');
      reject('Database not initialized');
      return;
    }
    
    let transaction = db.transaction(['logs1'], 'readonly');
    let objectStore = transaction.objectStore('logs1');
    let request = objectStore.getAll();
    
    request.onsuccess = function(event) {
      resolve(event.target.result);
    };
    
    request.onerror = function(event) {
      console.error('Error retrieving audit logs from logs2', event.target.error);
      reject(event.target.error);
    };
  });
}

// Function to add audit log to logs2 store
export function addAuditLog2(event_type, metadata) {
  if (!db) {
    console.error('Database not initialized');
    return;
  }
  let transaction = db.transaction(['logs2'], 'readwrite');
  let objectStore = transaction.objectStore('logs2');
  let auditKey = uuidv4();
  let request = objectStore.add({ key: auditKey, event_type: event_type, metadata: metadata });
  request.onsuccess = function(event) {
    console.log('Audit log added to logs2 successfully');
  };
  request.onerror = function(event) {
    console.error('Error adding audit log to logs2', event.target.error);
  };
}
// Function to get audit log from logs2 by audit_key

export function getAuditLog2() {
  return new Promise((resolve, reject) => {
    if (!db) {
      console.error('Database not initialized');
      reject('Database not initialized');
      return;
    }
    
    let transaction = db.transaction(['logs2'], 'readonly');
    let objectStore = transaction.objectStore('logs2');
    let request = objectStore.getAll();
    
    request.onsuccess = function(event) {
      resolve(event.target.result);
    };
    
    request.onerror = function(event) {
      console.error('Error retrieving audit logs from logs2', event.target.error);
      reject(event.target.error);
    };
  });
}