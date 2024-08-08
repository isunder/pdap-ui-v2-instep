
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const slug = urlParams.get("jwt");


export function getApiHeaders(customHeaders = {}) {

    const defaultHeaders = {
        'method': 'GET',
      'Content-Type': 'application/json',
      'Authorization': `${slug}`, 
    };
  
    return {
      ...defaultHeaders,
      ...customHeaders,
    };
  }

  export function postApiHeaders(customHeaders = {}) {
    
    const defaultHeaders = {
        'method': 'post',
      'Content-Type': 'application/json',
      'Authorization': `${slug}`, 
    };
  
    return {
      ...defaultHeaders,
      ...customHeaders,
    };
  }