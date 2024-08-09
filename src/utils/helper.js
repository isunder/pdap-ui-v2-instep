
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const slug = urlParams.get("jwt");

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