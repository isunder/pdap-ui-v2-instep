export function isSlugOrJwt() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const slug = urlParams.get("slug");
  const jwt = urlParams.get("jwt");

  let auth = {};

  if (slug) {
    auth = {isJwt: false, token: slug};
  } else if (jwt) {
    auth = {isJwt: true, token: jwt};
  }

  return auth;
}

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