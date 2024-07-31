import React from 'react'
import { Routers } from './routes';
import { Helmet } from 'react-helmet';

const App = () => {
  return (
    <>
     <Helmet>
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />

        <meta http-equiv="Content-Security-Policy" content={`connect-src 'self' ${process.env.REACT_APP_BASE_URL};`} />
        <meta name="server" content="Custom Server" />
        <meta http-equiv="Strict-Transport-Security" content="max-age=31536000; includeSubDomains" />
           </Helmet>
      <Routers />
    </>
 
)
}

export default App