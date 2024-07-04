export const Storage = (userDetail) => {
  let sessionObject = {};
  if (userDetail?.mrn) {
    const sessionObject = JSON.parse(
      localStorage.getItem(`sessionObject_${userDetail?.mrn}`)
    );
    const date = new Date();

    let expires = sessionObject?.expiresAt ? sessionObject?.expiresAt : 0;
    let isTime = new Date(date) > new Date(expires) ? false : true;
    if (!isTime) {
      return {};
    }
  }
  return sessionObject;
};
