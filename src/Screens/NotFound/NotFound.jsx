import React, { useEffect } from 'react';
import './NotFound.css'

export const NotFound = () => {

  useEffect(() => {
    // Clear session storage when the component mounts
    sessionStorage.clear();

    // Optionally, you can add cleanup logic here if needed
    return () => {
      // Cleanup logic if any
    };
  }, []);

  return (
    <div id="notfound">
      <div className="notfound">
        <div className="notfound-bg">
          <div></div>
          <div></div>
          <div></div>
        </div>
        <h2></h2>
        <h3 style={{ fontSize: '100% ' }}>Patient appears to be new. There will be data available to be shown at the next
          appointment.</h3>
      </div>
    </div>

  )
}
