import { nest } from 'd3-collection';
import sumBy from 'lodash.sumby';
import moment from 'moment';
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
      <div className='margin-top-07'>
        <h6 className='undp-typography'>All tweets</h6>
        <TimeSeries
          data={finalData}
          hourly={hourly}
          borderColor={['#00C4AA', '#8700F9', '#a8071a']}
          fillColor={['#D9F6F2', '#EDD9FE', '#ffccc7']}
        />
        <h6 className='undp-typography'>Tweets with hate speech</h6>
        <TimeSeriesHate
          data={finalData}
          hourly={hourly}
          borderColor='#a8071a'
          fillColor='#ffccc7'
        />
      </div>
    </>
  );
};

export default TimeSeriesEl;
