import React from 'react';

export function LiveDemo({ src }) {
  const withOptions = `${src}?embed=1&devtoolsheight=1000`;

  return (
    <iframe
      src={withOptions}
      style={{ width: '100%', height: '500px' }}
    ></iframe>
  );
}
