export function isSlugOrJwt() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const slug = urlParams.get("slug");
  const jwt = urlParams.get("jwt");

  sessionStorage.setItem("newslug", slug);
  sessionStorage.setItem("newjwt", jwt);
  
  const localslug = sessionStorage.getItem("newslug") || null;
  const localjwt = sessionStorage.getItem("newjwt") || null;
  

  let auth = {};

  if (localslug) {
    auth = {isJwt: false, token: localslug};
  } else if (localjwt) {
    auth = {isJwt: true, token: localjwt};
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