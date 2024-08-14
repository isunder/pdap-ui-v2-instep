export function getApiHeaders(customHeaders = {}) {

    const defaultHeaders = {
      'content-type': 'application/json',
    };
  
    return {
      ...defaultHeaders,
      ...customHeaders,
    };
  }

  export function postApiHeaders(customHeaders = {}) {
    
    const defaultHeaders = {
      'content-type': 'application/json',
    };
  
    return {
      ...defaultHeaders,
      ...customHeaders,
    };
  }