import mixpanel from "mixpanel-browser";
import { MIXPANEL_APP_TOKEN, MIXPANEL_DEBUG_MODE, MIXPANEL_PROXY_DOMAIN } from "../../constants/constants";

export const Mixpanel = (eventName, tab, body) => {
    mixpanel.init(MIXPANEL_APP_TOKEN, { debug: MIXPANEL_DEBUG_MODE, api_host: MIXPANEL_PROXY_DOMAIN });
    mixpanel.track(eventName, {
        'Tenant ID': tab?.tenant?.value,
        'User ID': tab?.user?.value,
        'Code Details': body,
        'Current URL' : process.env.REACT_APP_BASE_URL
    })
}