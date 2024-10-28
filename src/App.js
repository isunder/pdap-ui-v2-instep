import React from 'react'
import { Routers } from './routes';
import { Helmet } from 'react-helmet';
import CacheBuster from 'react-cache-buster';
import packageJson from '../package.json';

const App = () => {

  const isProduction = process.env.NODE_ENV === 'production';

  return (
    <CacheBuster
      currentVersion={packageJson.version}
      // isEnabled={isProduction} // Enable only in production
      // isVerboseMode={!isProduction} // Logs info in non-production environments
    >
      <>
        <Helmet>
          <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
          <meta httpEquiv="X-Frame-Options" content="DENY" />
          <meta name="referrer" content="no-referrer" />
          <meta name="server" content="Custom Server" />
          <meta
            httpEquiv="Strict-Transport-Security"
            content="max-age=31536000; includeSubDomains"
          />
          <meta
            httpEquiv="Content-Security-Policy"
            content={`
            default-src 'self';
            connect-src 
              'self' 
              ${process.env.REACT_APP_BASE_URL} 
              https://dev-api.pdap.doctustech.com 
              wss://*.pdap.doctustech.com 
              https://*.pdap.doctustech.com 
              wss://dev-app-v2.pdap.doctustech.com:3000; 
            script-src 'self' 'unsafe-inline';
            style-src 'self' 'unsafe-inline';
            img-src 
              'self' 
              data: 
              ${process.env.REACT_APP_IMG_URL} 
              wss://*.pdap.doctustech.com 
              https://*.pdap.doctustech.com;
            font-src 
              'self' 
              ${process.env.REACT_APP_FONT_URL} 
              wss://*.pdap.doctustech.com 
              https://*.pdap.doctustech.com;
            frame-src 'self';
            object-src 'none';
            media-src 'self';
            child-src 'self';
            base-uri 'self';
            form-action 'self';
            upgrade-insecure-requests;
          `}
          />
        </Helmet>
        <Routers />
      </>
    </CacheBuster>
  );
};

export default App