import { useState } from 'react';
import styled from 'styled-components';
import TimeSeries from './TimeSeries';

interface Datatype {
  dateTime: Date;
  totalTweet: number;
  totalFemaleTweet: number;
  totalHateTweet: number;
  totalFemalehateTweet: number;
}

interface PassedProps {
  data: Datatype[];
  hourly: boolean;
}

const RootEl = styled.div`
  margin-top: 2rem;
`;

const TitleEl = styled.div`
  font-size: 2rem;
  font-weight: bold;
  line-height: 3rem;
  margin-bottom: 2rem;
`;

const TimeSeriesEl = (props: PassedProps) => {
  const {
    data,
    hourly,
  } = props;
  const [brushSettings, setBrushSettings] = useState<[number, number] | null>(null);
  return (
    <>
      <RootEl>
        <TitleEl>All Tweets</TitleEl>
        <TimeSeries
          data={data}
          type='all'
          brushSettings={brushSettings}
          setBrushSettings={setBrushSettings}
          hourly={hourly}
        />
        <TitleEl>Hate Speech Tweets</TitleEl>
        <TimeSeries
          data={data}
          type='hate'
          brushSettings={brushSettings}
          setBrushSettings={setBrushSettings}
          hourly={hourly}
        />
      </RootEl>
    </>
  );
};

export default TimeSeriesEl;
