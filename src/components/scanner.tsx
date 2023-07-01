import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';

const Scanner = (props:any) => {
  const [data, setData] = useState('No result');

  return (
    <div className='w-full'>
      <QrReader
        onResult={(result:any, error) => {
          if (!!result) {
            setData(result?.text);
          }

          if (!!error) {
            console.info(error);
          }
        }}
        constraints={{
            facingMode: 'environment'
        }}
      />
      <p>{data}</p>
    </div>
  );
};

export default Scanner