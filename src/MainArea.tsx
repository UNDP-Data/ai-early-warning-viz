import { useEffect, useRef, useState } from 'react';
import { DateRangePicker, FocusedInputShape } from 'react-dates';
import moment from 'moment';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { csv } from 'd3-fetch';
import { Radio } from 'antd';
import maxBy from 'lodash.maxby';
import sortBy from 'lodash.sortby';
import uniqBy from 'lodash.uniqby';
import min from 'lodash.min';
import max from 'lodash.max';
import styled from 'styled-components';
import {
  DateRangeType,
  FinalHourlyDataType,
  HourDataType,
} from './types';
import Dashboard from './Dashboard';
import { Translation } from './Language';

const VizAreaEl = styled.div`
  display: flex;
  margin: auto;
  align-items: center;
  justify-content: center;
  height: 10rem;
`;

interface PassedProps {
  country: string;
  language: 'en' | 'es';
}

const DATASOURCELINK = 'https://raw.githubusercontent.com/UNDP-Data/data-for-early-warning-system/main/';

const MainArea = (props: PassedProps) => {
  const { country, language } = props;
  const divRef = useRef<any>(null);
  const [selectedGender, setSelectedGender] = useState<'All' | 'Men' | 'Women'>('All');
  const [selectedType, setSelectedType] = useState<'All' | 'Hate'>('All');
  const [selectedTag, setSelectedTag] = useState<'total' | 'education' | 'violence' | 'reproduction' | 'work' | 'politics'>('total');
  const [hourlyFinalData, setHourlyFinalData] = useState<FinalHourlyDataType | null>(null);
  const [dates, setDates] = useState<DateRangeType | null>(null);
  const [minMaxdate, setMinMaxDate] = useState<DateRangeType | null>(null);
  useEffect(() => {
    setHourlyFinalData(null);
    csv(`${DATASOURCELINK}${country}.csv`)
      .then((data: any) => {
        const minDate = min(uniqBy(data, 'date').map((d: any) => moment(d.date, 'MM-DD-YYYY'))) as moment.Moment;
        const maxDate = max(uniqBy(data, 'date').map((d: any) => moment(d.date, 'MM-DD-YYYY'))) as moment.Moment;
        const dataFormatted: HourDataType[] = data.map((d: any) => {
          const dateTime = moment(d.date, 'MM-DD-YYYY').add(parseInt(d.Hour, 10), 'hours');
          const durationMoment = moment.duration(dateTime.diff(minDate));
          const duration = durationMoment.asHours();
          return ({
            dateTime,
            duration,
            topic: +d.Topic,
            tweets: +d.tweets,
            male: +d.Male,
            maleHate: +d.MaleHate,
            femaleHate: +d.FemaleHate,
          });
        });
        const noOfHours = (maxBy(dataFormatted, 'duration') as HourDataType).duration;
        let finalHourlyData: FinalHourlyDataType = {
          total: sortBy(dataFormatted.filter((d: HourDataType) => d.topic === 0), (d) => d.duration),
          education: sortBy(dataFormatted.filter((d: HourDataType) => d.topic === 1), (d) => d.duration),
          violence: sortBy(dataFormatted.filter((d: HourDataType) => d.topic === 2), (d) => d.duration),
          reproduction: sortBy(dataFormatted.filter((d: HourDataType) => d.topic === 3), (d) => d.duration),
          work: sortBy(dataFormatted.filter((d: HourDataType) => d.topic === 4), (d) => d.duration),
          politics: sortBy(dataFormatted.filter((d: HourDataType) => d.topic === 5), (d) => d.duration),
        };
        for (let i = 0; i <= noOfHours; i += 1) {
          if (finalHourlyData.total.findIndex((d) => d.duration === i) === -1) {
            finalHourlyData.total.push({
              dateTime: minDate.clone().add(i, 'h'),
              duration: i,
              topic: 0,
              tweets: 0,
              male: 0,
              maleHate: 0,
              femaleHate: 0,
            });
          }
          if (finalHourlyData.education.findIndex((d) => d.duration === i) === -1) {
            finalHourlyData.education.push({
              dateTime: minDate.clone().add(i, 'h'),
              duration: i,
              topic: 1,
              tweets: 0,
              male: 0,
              maleHate: 0,
              femaleHate: 0,
            });
          }
          if (finalHourlyData.violence.findIndex((d) => d.duration === i) === -1) {
            finalHourlyData.violence.push({
              dateTime: minDate.clone().add(i, 'h'),
              duration: i,
              topic: 2,
              tweets: 0,
              male: 0,
              maleHate: 0,
              femaleHate: 0,
            });
          }
          if (finalHourlyData.reproduction.findIndex((d) => d.duration === i) === -1) {
            finalHourlyData.reproduction.push({
              dateTime: minDate.clone().add(i, 'h'),
              duration: i,
              topic: 3,
              tweets: 0,
              male: 0,
              maleHate: 0,
              femaleHate: 0,
            });
          }
          if (finalHourlyData.work.findIndex((d) => d.duration === i) === -1) {
            finalHourlyData.work.push({
              dateTime: minDate.clone().add(i, 'h'),
              duration: i,
              topic: 4,
              tweets: 0,
              male: 0,
              maleHate: 0,
              femaleHate: 0,
            });
          }
          if (finalHourlyData.politics.findIndex((d) => d.duration === i) === -1) {
            finalHourlyData.politics.push({
              dateTime: minDate.clone().add(i, 'h'),
              duration: i,
              topic: 5,
              tweets: 0,
              male: 0,
              maleHate: 0,
              femaleHate: 0,
            });
          }
        }
        finalHourlyData = {
          total: sortBy(finalHourlyData.total, (d) => d.duration),
          education: sortBy(finalHourlyData.education, (d) => d.duration),
          violence: sortBy(finalHourlyData.violence, (d) => d.duration),
          reproduction: sortBy(finalHourlyData.reproduction, (d) => d.duration),
          work: sortBy(finalHourlyData.work, (d) => d.duration),
          politics: sortBy(finalHourlyData.politics, (d) => d.duration),
        };
        setMinMaxDate({
          startDate: minDate,
          endDate: maxDate,
        });
        setDates({
          startDate: minDate,
          endDate: maxDate,
        });
        setHourlyFinalData(finalHourlyData);
      });
  }, [country]);
  const [focussedDate, setFocusedData] = useState<FocusedInputShape | null>(null);
  return (
    <div ref={divRef} className='undp-container'>
      <div>
        {
          hourlyFinalData && dates && minMaxdate
            ? (
              <>
                <div className='flex-div flex-wrap flex-space-between flex-vert-align-center margin-bottom-07 margin-top-07'>
                  <div>
                    <p className='label'>
                      {Translation[Translation.findIndex((d) => d.key === 'Select date range')][language]}

                    </p>
                    <DateRangePicker
                      startDate={dates.startDate}
                      isOutsideRange={() => false}
                      displayFormat='DD-MMM-YYYY'
                      startDateId='your_unique_start_date_id'
                      minDate={minMaxdate.startDate}
                      endDate={dates.endDate}
                      maxDate={minMaxdate.endDate}
                      endDateId='your_unique_end_date_id'
                      onDatesChange={({ startDate, endDate }) => { setDates({ startDate: startDate || moment(hourlyFinalData.total[0].dateTime), endDate: endDate || moment(hourlyFinalData.total[hourlyFinalData.total.length - 1].dateTime) }); }}
                      focusedInput={focussedDate}
                      onFocusChange={(focusedInput) => { setFocusedData(focusedInput); }}
                    />
                  </div>
                  <div>
                    <p className='label'>
                      {Translation[Translation.findIndex((d) => d.key === 'Filter by gender')][language]}

                    </p>
                    <Radio.Group defaultValue='All' value={selectedGender} onChange={(event) => { setSelectedGender(event.target.value); }}>
                      <Radio className='undp-radio' value='All'>{Translation[Translation.findIndex((d) => d.key === 'All')][language]}</Radio>
                      <Radio className='undp-radio' value='Men'>{Translation[Translation.findIndex((d) => d.key === 'Men')][language]}</Radio>
                      <Radio className='undp-radio' value='Women'>{Translation[Translation.findIndex((d) => d.key === 'Women')][language]}</Radio>
                    </Radio.Group>
                  </div>
                  <div>
                    <p className='label'>
                      {Translation[Translation.findIndex((d) => d.key === 'Filter by hate speech')][language]}

                    </p>
                    <Radio.Group defaultValue='All' value={selectedType} onChange={(event) => { setSelectedType(event.target.value); }}>
                      <Radio className='undp-radio' value='All'>{Translation[Translation.findIndex((d) => d.key === 'All')][language]}</Radio>
                      <Radio className='undp-radio' value='Hate'>{Translation[Translation.findIndex((d) => d.key === 'Hate speech')][language]}</Radio>
                    </Radio.Group>
                  </div>
                  <div>
                    <p className='label'>
                      {Translation[Translation.findIndex((d) => d.key === 'Filter by category')][language]}

                    </p>
                    <Radio.Group defaultValue='total' value={selectedTag} onChange={(event) => { setSelectedTag(event.target.value); }}>
                      <Radio className='undp-radio' value='total'>{Translation[Translation.findIndex((d) => d.key === 'All')][language]}</Radio>
                      <Radio className='undp-radio' value='education'>{Translation[Translation.findIndex((d) => d.key === 'Education')][language]}</Radio>
                      <Radio className='undp-radio' value='politics'>{Translation[Translation.findIndex((d) => d.key === 'Politics')][language]}</Radio>
                      <Radio className='undp-radio' value='reproduction'>{Translation[Translation.findIndex((d) => d.key === 'Reproduction')][language]}</Radio>
                      <Radio className='undp-radio' value='violence'>{Translation[Translation.findIndex((d) => d.key === 'Violence')][language]}</Radio>
                      <Radio className='undp-radio' value='work'>{Translation[Translation.findIndex((d) => d.key === 'Employment')][language]}</Radio>
                    </Radio.Group>
                  </div>
                </div>
                <Dashboard
                  hourlyData={hourlyFinalData}
                  selectedTag={selectedTag}
                  setSelectedTag={setSelectedTag}
                  selectedGender={selectedGender}
                  setSelectedType={setSelectedType}
                  selectedType={selectedType}
                  dates={dates}
                  setSelectedGender={setSelectedGender}
                  language={language}
                />
              </>
            )
            : (
              <VizAreaEl className='undp-container'>
                <div className='undp-loader' />
              </VizAreaEl>
            )
        }
      </div>
    </div>
  );
};

export default MainArea;
