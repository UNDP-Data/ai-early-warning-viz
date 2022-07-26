import { nest } from 'd3-collection';
import sumBy from 'lodash.sumby';
import moment from 'moment';
import styled from 'styled-components';
import TimeSeries from './TimeSeries';
import TimeSeriesHate from './TimeSeriesHate';

interface Datatype {
  dateTime: moment.Moment;
  totalTweet: number;
  totalFemaleTweet: number;
  totalMaleTweet: number;
  totalHateTweet: number;
  totalFemalehateTweet: number;
  totalMalehateTweet: number;
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
  const finalData = hourly ? data : nest()
    .key((d: any) => d.dateTime.format('D-MMM-YYYY'))
    .entries(data)
    .map((d) => ({
      dateTime: moment(d.key),
      totalTweet: sumBy(d.values, 'totalTweet'),
      totalFemaleTweet: sumBy(d.values, 'totalFemaleTweet'),
      totalMaleTweet: sumBy(d.values, 'totalMaleTweet'),
      totalHateTweet: sumBy(d.values, 'totalHateTweet'),
      totalFemalehateTweet: sumBy(d.values, 'totalFemalehateTweet'),
      totalMalehateTweet: sumBy(d.values, 'totalMalehateTweet'),
    }));
  return (
    <>
      <RootEl>
        <TitleEl>All tweets</TitleEl>
        <TimeSeries
          data={finalData}
          hourly={hourly}
          borderColor={['#00C4AA', '#8700F9', '#a8071a']}
          fillColor={['#D9F6F2', '#EDD9FE', '#ffccc7']}
        />
        <TitleEl>Tweets with hate speech</TitleEl>
        <TimeSeriesHate
          data={finalData}
          hourly={hourly}
          borderColor='#a8071a'
          fillColor='#ffccc7'
        />
      </RootEl>
    </>
  );
};

export default TimeSeriesEl;
