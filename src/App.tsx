import { useState } from 'react';
import { Segmented, Select } from 'antd';
import { Translation } from './Language';
import MainArea from './MainArea';

const METHODOLOGYLINK = process.env.NODE_ENV !== 'production' ? './data/' : 'https://data.undp.org/gender-social-media-monitoring-viz-v3/data/';

const App = () => {
  const [country, setCountry] = useState('Uganda');
  const [language, updateLanguage] = useState<'es' | 'en'>('en');
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
          <div className='flex-div flex-vert-align-center'>
            <Select
              className='undp-select undp-language-select'
              defaultValue='en'
              value={language}
              onChange={(value) => { updateLanguage(value as 'en' | 'es'); }}
            >
              <Select.Option className='undp-select-option' value='en'>English</Select.Option>
              <Select.Option className='undp-select-option' value='es'>Spanish</Select.Option>
            </Select>
            <a href={`${METHODOLOGYLINK}Methodology_UNDP Gender Social Media Monitoring.pdf`} target='_blank' rel='noreferrer' className='undp-style'>{Translation[Translation.findIndex((d) => d.key === 'Methodology')][language]}</a>
          </div>
        </div>
      </div>
      <MainArea
        country={country}
        language={language}
      />
    </>
  );
};

export default App;
