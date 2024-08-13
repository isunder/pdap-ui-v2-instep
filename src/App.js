import React from 'react'
import { Routers } from './routes';
import { Helmet } from 'react-helmet';

const App = () => {
  return (
    <>
     <Helmet>
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta http-equiv="X-Frame-Options" content="DENY" />
  <meta name="referrer" content="no-referrer" />
        <meta name="server" content="Custom Server" />
        <meta http-equiv="Strict-Transport-Security" content="max-age=31536000; includeSubDomains" />
        <meta http-equiv="Content-Security-Policy" content={`
    default-src 'self';
    connect-src 'self' ${process.env.REACT_APP_BASE_URL};
    script-src 'self' 'unsafe-inline';
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: ${process.env.REACT_APP_IMG_URL};
    font-src 'self' ${process.env.REACT_APP_FONT_URL};
    frame-src 'self';
    object-src 'none';
    media-src 'self';
    child-src 'self';
    frame-ancestors 'none';
    base-uri 'self';
    form-action 'self';
    upgrade-insecure-requests;
`} />

      </Helmet>
      <Routers />
    </>
 
)
}

export default App