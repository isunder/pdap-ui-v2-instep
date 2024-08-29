import { v4 as uuidv4 } from 'uuid';

let db;
const DB_NAME = 'audit_log';
const DB_VERSION = 1;

const request = indexedDB.open(DB_NAME, DB_VERSION);

// Open the database

request.onupgradeneeded = (event) => {
  db = event.target.result;

  // Create the first object store
  let objectStore1 = db.createObjectStore('logs1', { keyPath: 'id' });
  if(!objectStore1) return;

  // Create indexes for objectStore1
  objectStore1.createIndex('event_type', 'event_type', { unique: false });
    objectStore1.createIndex('metadata/identifier', 'metadata.identifier', { unique: false });
    objectStore1.createIndex('metadata/provider_name', 'metadata.provider_name', { unique: false });
    objectStore1.createIndex('metadata/patient_id', 'metadata.patient_id', { unique: false });
    objectStore1.createIndex('metadata/encounterId', 'metadata.encounterId', { unique: false });
    objectStore1.createIndex('metadata/event_datetime', 'metadata.event_datetime', { unique: false });
    objectStore1.createIndex('metadata/code', 'metadata.code', { unique: false });
    objectStore1.createIndex('metadata/description', 'metadata.description', { unique: false });
    objectStore1.createIndex('metadata/reasonForRejection', 'metadata.reasonForRejection', { unique: false });
    objectStore1.createIndex('metadata/raf', 'metadata.raf', { unique: false });
    objectStore1.createIndex('metadata/alternateCodes', 'metadata.alternateCodes', { unique: false });
    objectStore1.createIndex('metadata/parentCodesCount', 'metadata.parentCodesCount', { unique: false });


  // Create the second object store
  let objectStore2 = db.createObjectStore('logs2', { keyPath: 'id' });
  if(!objectStore2) return;
  // Create indexes for objectStore2
  objectStore2.createIndex('event_type', 'event_type', { unique: false });
    objectStore2.createIndex('metadata/identifier', 'metadata.identifier', { unique: false });
    objectStore2.createIndex('metadata/provider_name', 'metadata.provider_name', { unique: false });
    objectStore2.createIndex('metadata/patient_id', 'metadata.patient_id', { unique: false });
    objectStore2.createIndex('metadata/encounterId', 'metadata.encounterId', { unique: false });
    objectStore2.createIndex('metadata/event_datetime', 'metadata.event_datetime', { unique: false });
    objectStore2.createIndex('metadata/code', 'metadata.code', { unique: false });
    objectStore2.createIndex('metadata/description', 'metadata.description', { unique: false });
    objectStore2.createIndex('metadata/reasonForRejection', 'metadata.reasonForRejection', { unique: false });
    objectStore2.createIndex('metadata/raf', 'metadata.raf', { unique: false });
    objectStore2.createIndex('metadata/alternateCodes', 'metadata.alternateCodes', { unique: false });
    objectStore2.createIndex('metadata/parentCodesCount', 'metadata.parentCodesCount', { unique: false });

};

request.onsuccess = function(event) {
  db = event.target.result;
};

request.onerror = function(event) {
  console.error('Database error:', event.target.errorCode);
};

// Function to add an audit log to logs1 store
export function addAuditLog1(data) {
  if (!db) {
    console.error('Database not initialized');
    return;
  }

  let transaction = db.transaction(['logs1'], 'readwrite');
  let objectStore = transaction.objectStore('logs1');
  let auditKey = uuidv4();
  let request = objectStore.add({ id: auditKey, ...data });

  request.onsuccess = function() {
  };

  request.onerror = function(event) {
    console.error('Error adding audit log to logs1:', event.target.error);
  };
}

// Function to get all audit logs from logs1
export function getAuditLog1() {
  return new Promise((resolve, reject) => {
    if (!db) {
      console.error('Database not initialized');
      return reject('Database not initialized');
    }

    let transaction = db.transaction(['logs1'], 'readonly');
    let objectStore = transaction.objectStore('logs1');
    let request = objectStore.getAll();

    request.onsuccess = function(event) {
      resolve(event.target.result);
    };

    request.onerror = function(event) {
      console.error('Error retrieving audit logs from logs1:', event.target.error);
      reject(event.target.error);
    };
  });
}

// Function to add an audit log to logs2 store
export function addAuditLog2(item) {
  if (!db) {
    console.error('Database not initialized');
    return;
  }

  let transaction = db.transaction(['logs2'], 'readwrite');
  let objectStore = transaction.objectStore('logs2');
  let auditKey = uuidv4();
  let request = objectStore.put({...item });

  request.onsuccess = function() {
  };

  request.onerror = function(event) {
    console.error('Error adding audit log to logs2:', event.target.error);
  };
}

// Function to get all audit logs from logs2
export function getAuditLog2() {
  return new Promise((resolve, reject) => {
    if (!db) {
      console.error('Database not initialized');
      return reject('Database not initialized');
    }

    let transaction = db.transaction(['logs2'], 'readonly');
    let objectStore = transaction.objectStore('logs2');
    let request = objectStore.getAll();

    request.onsuccess = function(event) {
      resolve(event.target.result);
    };

    request.onerror = function(event) {
      console.error('Error retrieving audit logs from logs2:', event.target.error);
      reject(event.target.error);
    };
  });
}
