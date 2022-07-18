import styled, { createGlobalStyle } from 'styled-components';
import { useEffect, useRef, useState } from 'react';
import { DateRangePicker, FocusedInputShape } from 'react-dates';
import moment from 'moment';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { csv } from 'd3-fetch';
import 'antd/dist/antd.css';
import { Radio, Spin } from 'antd';
import maxBy from 'lodash.maxby';
import minBy from 'lodash.minby';
import {
  AggregatedDataType, DataType, DateRangeType, HourlyTweetData,
} from './types';
import Dashboard from './Dashboard';

const GlobalStyle = createGlobalStyle`
  :root {
    --white: #FFFFFF;
    --primary-blue: #006EB5;
    --blue-medium: #4F95DD;
    --blue-bg: #94C4F5;
    --navy: #082753;
    --black-100: #FAFAFA;
    --black-200: #f5f9fe;
    --black-300: #EDEFF0;
    --black-400: #E9ECF6;
    --black-450: #DDD;
    --black-500: #A9B1B7;
    --black-550: #666666;
    --black-600: #212121;
    --black-700: #000000;
    --blue-very-light: #F2F7FF;
    --yellow: #FBC412;
    --yellow-bg: #FFE17E;
    --red: #D12800;
    --red-bg: #FFBCB7;
    --shadow:0px 10px 30px -10px rgb(9 105 250 / 15%);
    --shadow-bottom: 0 10px 13px -3px rgb(9 105 250 / 5%);
    --shadow-top: 0 -10px 13px -3px rgb(9 105 250 / 15%);
    --shadow-right: 10px 0px 13px -3px rgb(9 105 250 / 5%);
    --shadow-left: -10px 0px 13px -3px rgb(9 105 250 / 15%);
  }
  
  html { 
    font-size: 62.5%; 
  }

  .react-dropdown-select-option{
    color:var(--black) !important;
    background-color:var(--primary-color-light) !important;
  }
  .react-dropdown-select-option-label, .react-dropdown-select-option-remove{
    font-weight: 400;
    background-color:var(--primary-color-light);
    padding: 0.5rem;
  }

  body {
    font-family: "proxima-nova", "Helvetica Neue", "sans-serif";
    color: var(--black-600);
    background-color: var(--white);
    margin: 0;
    padding: 1rem 0;
    font-size: 1.6rem;
    font-weight: normal;
    line-height: 2.56rem;
  }

  a {
    text-decoration: none;
    color: var(--primary-blue);
  }

  h1 {
    color: var(--primary-blue);
    font-size: 3.2rem;
    font-weight: 700;
    
    @media (max-width: 760px) {
      font-size: 2.4rem;
    }
    @media (max-width: 480px) {
      font-size: 1.8rem;
    }
  }
  
  button.primary {
    border-radius: 0.2rem !important;
    font-size: 1.4rem !important;
    font-weight: normal !important;
    color: var(--white) !important;
    background-color: var(--primary-blue) !important;
    border: 1px solid var(--primary-blue) !important;
    cursor: pointer !important;
    padding: 0.4rem 1rem !important;
    &:hover {
      border: 1px solid var(--blue-medium) !important;
      background-color: var(--blue-medium) !important;
    }
    &:active{
      border: 1px solid var(--blue-medium) !important;
      background-color: var(--blue-medium) !important;
    }
  }

  button.secondary {
    border-radius: 0.2rem !important;
    font-size: 1.4rem !important;
    font-weight: normal !important;
    color: var(--black-600) !important;
    border: 1px solid var(--black-450) !important;
    cursor: pointer !important;
    padding: 0.4rem 1rem !important;
    background-color: var(--white) !important;
    &:hover {
      border: 1px solid var(--primary-blue) !important;
      color: var(--primary-blue) !important;
    }
    &:active{
      border: 1px solid var(--primary-blue) !important;
      color: var(--primary-blue) !important;
    }
  }

  a:hover {
    font-weight: bold;
  }

  .bold{
    font-weight: 700;
  }
  
  .italics{
    font-style: italic;
  }

  .ant-modal-close {
    display: none !important;
  }

  .ant-select-item-option-content {
    white-space: normal;
  }

  .ant-select-selector {
    border-radius: 0.5rem !important;
    background-color: var(--black-200) !important;
  }
  .ant-slider-mark-text {
    font-size: 1rem !important;
    display: none;
    &:first-of-type {
      display: inline;
    }
    &:last-of-type {
      display: inline;
    }
  }
  .ant-slider-tooltip{
    padding: 0 !important;
  }
  .ant-tooltip-inner{
    font-size: 1.4rem !important;
    background-color: var(--black-550) !important;
    border-radius: 0.4rem;
  }
  .ant-tooltip-arrow-content{
    background-color: var(--black-550) !important;
  }
`;

const getDaysArray = (start: Date, end: Date) => {
  const arr = [];
  for (let dt = start; dt <= end; dt.setDate(dt.getDate() + 1)) {
    arr.push(new Date(Date.UTC(dt.getFullYear(), dt.getMonth(), dt.getDate())));
  }
  return arr;
};

const getTweetDataSummary = (data: DataType[], category?:number) => {
  const maleTweet = !category ? data.filter((d) => d.gender === 0).length : data.filter((d) => d.gender === 0 && d.tag === category).length;
  const femaleTweet = !category ? data.filter((d) => d.gender === 1).length : data.filter((d) => d.gender === 1 && d.tag === category).length;
  const maleHateTweet = !category ? data.filter((d) => d.gender === 0 && d.hateSpeech === 1).length : data.filter((d) => d.gender === 0 && d.hateSpeech === 1 && d.tag === category).length;
  const femaleHateTweet = !category ? data.filter((d) => d.gender === 1 && d.hateSpeech === 1).length : data.filter((d) => d.gender === 1 && d.hateSpeech === 1 && d.tag === category).length;
  return {
    totalTweet: maleTweet + femaleTweet,
    totalHateTweet: maleHateTweet + femaleHateTweet,
    maleTweet,
    femaleTweet,
    maleHateTweet,
    femaleHateTweet,
  };
};

const ContainerEl = styled.div`
  width: 100%;
  max-width: 128rem;
  margin: auto;
  padding: 2rem 0;
`;

const SettingsPanel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const App = () => {
  const divRef = useRef<any>(null);
  const [selectedGender, setSelectedGender] = useState<'All' | 'Male' | 'Female'>('All');
  const [selectedTag, setSelectedTag] = useState<'total' | 'Edu' | 'Stem' | 'Violence' | 'Reproduction' | 'Work' | 'Politics'>('total');
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const [finalData, setFinalData] = useState<AggregatedDataType[] | null>(null);
  const [hourlyFinalData, setHourlyFinalData] = useState<HourlyTweetData[] | null>(null);
  const [dates, setDates] = useState<DateRangeType | null>(null);
  const [minMaxdate, setMinMaxDate] = useState<DateRangeType | null>(null);
  useEffect(() => {
    csv('./data/ColombiaCSV.csv')
      .then((data: any) => {
        const dataFormatted: DataType[] = data.map((d: any) => {
          const date = new Date(d.created);
          const day = date.getUTCDate();
          const month = months[date.getUTCMonth()];
          const year = date.getUTCFullYear();
          return ({
            tag: +d.tag,
            created: date,
            createdString: d.created,
            date: new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())),
            dateString: `${day}-${month}-${year}`,
            dateTime: new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours())),
            hour: date.getUTCHours(),
            retweetCount: +d.retweetCount,
            gender: +d.gender,
            tweet: d.tweet,
            hateSpeech: +d.HateSpeech,
          });
        });

        const aggregatedData: AggregatedDataType[] = getDaysArray((minBy(dataFormatted, (d) => new Date(d.createdString)) as DataType).created, (maxBy(dataFormatted, (d) => new Date(d.createdString)) as DataType).created).map((date) => {
          const filteredDataByDate = dataFormatted.filter((d) => d.date.getUTCDate() === date.getUTCDate() && d.date.getUTCMonth() === date.getUTCMonth() && d.date.getUTCFullYear() === date.getUTCFullYear());
          const hourlyData = Array.from(Array(24).keys()).map((hour) => {
            const filteredDatabyHour = filteredDataByDate.filter((d) => d.hour === hour);
            return {
              hour,
              dateDay: new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())),
              dateTime: new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), hour)),
              total: getTweetDataSummary(filteredDatabyHour),
              Edu: getTweetDataSummary(filteredDatabyHour, 1),
              Stem: getTweetDataSummary(filteredDatabyHour, 2),
              Violence: getTweetDataSummary(filteredDatabyHour, 3),
              Reproduction: getTweetDataSummary(filteredDatabyHour, 4),
              Work: getTweetDataSummary(filteredDatabyHour, 5),
              Politics: getTweetDataSummary(filteredDatabyHour, 6),
            };
          });
          return {
            date,
            total: getTweetDataSummary(filteredDataByDate),
            Edu: getTweetDataSummary(filteredDataByDate, 1),
            Stem: getTweetDataSummary(filteredDataByDate, 2),
            Violence: getTweetDataSummary(filteredDataByDate, 3),
            Reproduction: getTweetDataSummary(filteredDataByDate, 4),
            Work: getTweetDataSummary(filteredDataByDate, 5),
            Politics: getTweetDataSummary(filteredDataByDate, 6),
            hourlyData,
          };
        });
        const hourlyAggregateData: HourlyTweetData[] = [];
        aggregatedData.forEach((d) => {
          d.hourlyData.forEach((el) => {
            hourlyAggregateData.push(el);
          });
        });
        setFinalData(aggregatedData);
        setHourlyFinalData(hourlyAggregateData);
        setMinMaxDate({
          startDate: moment((minBy(dataFormatted, 'date') as DataType).date),
          endDate: moment((maxBy(dataFormatted, 'date') as DataType).date),
        });
        setDates({
          startDate: moment((minBy(dataFormatted, 'date') as DataType).date),
          endDate: moment((maxBy(dataFormatted, 'date') as DataType).date),
        });
      });
  }, []);
  const [focussedDate, setFocusedData] = useState<FocusedInputShape | null>(null);
  return (
    <div ref={divRef}>
      <GlobalStyle />
      <ContainerEl>
        {
          finalData && hourlyFinalData && dates && minMaxdate
            ? (
              <>
                <SettingsPanel>
                  <Radio.Group size='large' defaultValue='All' buttonStyle='solid' value={selectedGender} onChange={(event) => { setSelectedGender(event.target.value); }}>
                    <Radio.Button value='All'>All Gender</Radio.Button>
                    <Radio.Button value='Male'>Male</Radio.Button>
                    <Radio.Button value='Female'>Female</Radio.Button>
                  </Radio.Group>
                  <Radio.Group size='large' defaultValue='total' buttonStyle='solid' value={selectedTag} onChange={(event) => { setSelectedTag(event.target.value); }}>
                    <Radio.Button value='total'>All</Radio.Button>
                    <Radio.Button value='Edu'>Education</Radio.Button>
                    <Radio.Button value='Stem'>STEM</Radio.Button>
                    <Radio.Button value='Violence'>Violence</Radio.Button>
                    <Radio.Button value='Reproduction'>Reproduction</Radio.Button>
                    <Radio.Button value='Work'>Work</Radio.Button>
                    <Radio.Button value='Politics'>Politics</Radio.Button>
                  </Radio.Group>
                  <DateRangePicker
                    startDate={dates.startDate}
                    isOutsideRange={() => false}
                    displayFormat='DD-MMM-YYYY'
                    startDateId='your_unique_start_date_id'
                    minDate={minMaxdate.startDate}
                    endDate={dates.endDate}
                    maxDate={minMaxdate.endDate}
                    endDateId='your_unique_end_date_id'
                    onDatesChange={({ startDate, endDate }) => { setDates({ startDate: startDate || moment(finalData[0].date), endDate: endDate || moment(finalData[finalData.length - 1].date) }); }}
                    focusedInput={focussedDate}
                    onFocusChange={(focusedInput) => { setFocusedData(focusedInput); }}
                  />
                </SettingsPanel>
                <Dashboard
                  data={finalData.filter((d) => moment(d.date) >= dates.startDate && moment(d.date) <= dates.endDate)}
                  hourlyData={hourlyFinalData}
                  selectedTag={selectedTag}
                  setSelectedTag={setSelectedTag}
                  selectedGender={selectedGender}
                  setSelectedGender={setSelectedGender}
                />
              </>
            )
            : <Spin />
        }
      </ContainerEl>
    </div>
  );
};

export default App;
