import { v4 as uuidv4 } from 'uuid';

let db;
let request = indexedDB.open('audit_log', 1);

request.onupgradeneeded = function(event) {
  db = event.target.result;

  // Create the first object store
  let objectStore1 = db.createObjectStore('logs1', { keyPath: 'key' });
  objectStore1.createIndex('audit_key', 'audit_key', { unique: false });
  objectStore1.createIndex('misc_info', 'misc_info', { unique: false });
  objectStore1.createIndex('log_value', 'log_value', { unique: false });

  // Create the second object store
  let objectStore2 = db.createObjectStore('logs2', { keyPath: 'key' });
  objectStore2.createIndex('audit_key', 'audit_key', { unique: false });
  objectStore2.createIndex('misc_info', 'misc_info', { unique: false });
  objectStore2.createIndex('log_value', 'log_value', { unique: false });
};

request.onsuccess = function(event) {
  db = event.target.result;
  console.log('Database opened successfully');
};

request.onerror = function(event) {
  console.error("Database error: " + event.target.errorCode);
};

// Function to add audit log to logs1 store
export function addAuditLog1(audit_key, miscInfo, logValue) {
  if (!db) {
    console.error('Database not initialized');
    return;
  }
  let transaction = db.transaction(['logs1'], 'readwrite');
  let objectStore = transaction.objectStore('logs1');
  let auditKey = uuidv4();
  let request = objectStore.add({ key: auditKey, audit_key: audit_key, misc_info: miscInfo, log_value: logValue });
  request.onsuccess = function(event) {
    console.log('Audit log added to logs1 successfully');
  };
  request.onerror = function(event) {
    console.error('Error adding audit log to logs1', event.target.error);
  };
}

// Function to get audit log from logs1 by audit_key
// Function to get audit log from logs1 by audit_key
export function getAuditLog1(auditKey) {
  if (!db) {
    console.error('Database not initialized');
    return;
  }
  
  let transaction = db.transaction(['logs1'], 'readonly');
  let objectStore = transaction.objectStore('logs1');
  let request = objectStore.get(auditKey);
  
  // Handle transaction events
  transaction.oncomplete = function(event) {
    let log = request.result;
    if (log) {
      console.log('Retrieved audit log from logs1:', log);
    } else {
      console.log('No audit log found with auditKey:', auditKey);
    }
  };

  transaction.onerror = function(event) {
    console.error('Transaction error:', event.target.error);
  };
}

// Function to add audit log to logs2 store
export function addAuditLog2(audit_key, miscInfo, logValue) {
  if (!db) {
    console.error('Database not initialized');
    return;
  }
  let transaction = db.transaction(['logs2'], 'readwrite');
  let objectStore = transaction.objectStore('logs2');
  let auditKey = uuidv4();
  let request = objectStore.add({ key: auditKey, audit_key: audit_key, misc_info: miscInfo, log_value: logValue });
  request.onsuccess = function(event) {
    console.log('Audit log added to logs2 successfully');
  };
  request.onerror = function(event) {
    console.error('Error adding audit log to logs2', event.target.error);
  };
}

// Function to get audit log from logs2 by audit_key
export function getAuditLog2(auditKey) {
  if (!db) {
    console.error('Database not initialized');
    return;
  }
  let transaction = db.transaction(['logs2'], 'readonly');
  let objectStore = transaction.objectStore('logs2');
  let request = objectStore.get(auditKey);
  request.onsuccess = function(event) {
    let log = event.target.result;
    if (log) {
      console.log('Retrieved audit log from logs2:', log);
    } else {
      console.log('No audit log found with auditKey:', auditKey);
    }
  };
  request.onerror = function(event) {
    console.error('Error retrieving audit log from logs2', event.target.error);
  };
}
