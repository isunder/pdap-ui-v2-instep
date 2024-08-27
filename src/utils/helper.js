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

const auth = isSlugOrJwt();

export function getSlug() {
  return auth.isJwt ? undefined : auth.token;
}

export function getToken() {
  return auth.isJwt ? auth.token : undefined;
}

export function getApiHeaders() {

  const defaultHeaders = {
    'authorization':getToken() ,
  };

  return {
    ...defaultHeaders
  };
}

export function postApiHeaders() {
  
  const defaultHeaders = {
    'authorization':getToken() ,
  };

  return {
    ...defaultHeaders
  };
}