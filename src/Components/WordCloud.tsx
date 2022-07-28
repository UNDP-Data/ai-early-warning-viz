import { Spin } from 'antd';
import axios from 'axios';
import moment from 'moment';
import cloud from 'd3-cloud';
import { useEffect, useState } from 'react';
import max from 'lodash.max';
import styled from 'styled-components';

interface PassedProps {
  country: string;
  category: string;
  dates: [moment.Moment, moment.Moment];
}

const COUNTRYLIST = ['Uganda', 'Colombia', 'Philippines'];
const CATEGORYLIST = ['total', 'education', 'violence', 'reproduction', 'work', 'politics'];

const ErrorNote = styled.div`
  font-size: 2rem;
  text-align: center;
  font-weight: bold;
  border:1px solid var(--red);
  color: var(--red);
  background-color: var(--red-bg);
  padding: 2rem;
  margin: 2rem auto;
  border-radius: 0.4rem;
`;

const WordCloud = (props: PassedProps) => {
  const {
    country,
    dates,
    category,
  } = props;
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  useEffect(() => {
    axios({
      method: 'get',
      url: `https://wordcloudapi.herokuapp.com/items/?country=${COUNTRYLIST.indexOf(country) + 1}&fromdate=%27${moment(dates[0]).format('YYYY-MM-DD')}T00:00:00%27&todate=%27${moment(dates[1]).format('YYYY-MM-DD')}T00:00:00%27&topic=${CATEGORYLIST.indexOf(category)}`,
    })
      .then((response: any) => {
        const maxValue = max(Object.keys(response.data.message).map((d) => response.data.message[d]));
        const words = Object.keys(response.data.message).map((d) => ({ text: d, size: response.data.message[d] * (60 / maxValue) }));
        const draw = (wordCount: any) => {
          setData(wordCount);
        };
        cloud()
          .size([420, 420])
          .words(words)
          .rotate(0)
          .padding(7)
          .fontSize((d) => d.size as number)
          .on('end', draw)
          .start();
      })
      .catch((err: any) => {
        setError(err);
      });
  }, [dates, country, category]);
  return (
    <>
      {
        error
          ? <ErrorNote>{error}</ErrorNote>
          : !data
            ? <Spin />
            : (
              <svg width='100%' viewBox='0 0 1240 420'>
                <g transform='translate(620,210)'>
                  {
                    data.map((d: any, i: number) => (
                      <text
                        key={i}
                        textAnchor='middle'
                        fontSize={d.size}
                        transform={`translate(${d.x},${d.y})`}
                      >
                        {d.text}
                      </text>
                    ))
                  }
                </g>
              </svg>
            )
      }
    </>
  );
};

export default WordCloud;
