/* eslint-disable no-console */
import { Spin } from 'antd';
import axios from 'axios';
import moment from 'moment';
import { useEffect, useState } from 'react';

interface PassedProps {
  country: string;
  dates: [moment.Moment, moment.Moment];
}

const WordCloud = (props: PassedProps) => {
  const {
    country,
    dates,
  } = props;
  const [data, setData] = useState<any>(null);
  console.log(dates, country);
  useEffect(() => {
    axios({
      method: 'get',
      url: 'https://wordcloudapi.herokuapp.com/items/?country=1&fromdate=%272021-11-01T00:00:00%27&todate=%272022-03-31T00:00:31%27&topic=3',
    })
      .then((response: any) => {
        console.log(response.data);
        setData(response.data);
      })
      .catch((err: any) => {
        console.log(err);
      });
  });
  return (
    <>
      {
        !data
          ? <Spin />
          : (
            <svg width='100%' viewBox='0 0 1240 420' />
          )
      }
    </>
  );
};

export default WordCloud;
