import { useState } from 'react';
import { Segmented } from 'antd';
import MainArea from './MainArea';

const METHODOLOGYLINK = process.env.NODE_ENV !== 'production' ? './data/' : 'https://data.undp.org/gender-social-media-monitoring-viz-v3/data/';

const App = () => {
  const [country, setCountry] = useState('Uganda');
  return (
    <>
      <div className='undp-container'>
        <div className='flex-div flex-space-between flex-wrap flex-vert-align-center'>
          <Segmented
            className='undp-segmented-small'
            value={country}
            onChange={(value) => { setCountry((value as 'Uganda' | 'Colombia' | 'Philippines')); }}
            options={
              [
                {
                  label: 'Colombia',
                  value: 'Colombia',
                },
                {
                  label: 'Philippines',
                  value: 'Philippines',
                },
                {
                  label: 'Uganda',
                  value: 'Uganda',
                },
              ]
            }
            onResize={() => {}}
            onResizeCapture={() => {}}
          />
          <a href={`${METHODOLOGYLINK}Methodology_UNDP Gender Social Media Monitoring.pdf`} target='_blank' rel='noreferrer' className='undp-style'>Methodology</a>
        </div>
      </div>
      <MainArea
        country={country}
      />
    </>
  );
};

export default App;
