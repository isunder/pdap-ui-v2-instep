  
const lcslug = sessionStorage.getItem("newslug") || null;
const lcjwt = sessionStorage.getItem("newjwt") || null;

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


export function convertDate(originalDateStr) {
  // Parse the original date string
  const date = new Date(originalDateStr);

  // Extract components from the Date object
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-based
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  
  // Calculate microseconds (millisecond part multiplied by 1000 for microseconds)
  const milliseconds = date.getUTCMilliseconds();
  const microseconds = String(milliseconds * 1000).padStart(6, '0');

  // Format the date string
  const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${microseconds}+00`;

  return formattedDate;
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

export function refreshTOken () {
  if(lcjwt){

  }
}