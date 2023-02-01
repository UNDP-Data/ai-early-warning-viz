import { useState } from 'react';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { Segmented } from 'antd';
import sumBy from 'lodash.sumby';
import { DonutChartCard } from './Components/DonutChart';
import { BarChartCard } from './Components/BarChart';
import TimeSeries from './Components/TimeSeries';
import { DateRangeType, FinalHourlyDataType } from './types';

interface Props {
  hourlyData: FinalHourlyDataType;
  selectedTag: 'total' | 'education' | 'violence' | 'reproduction' | 'work' | 'politics';
  setSelectedTag: (_d: 'total' | 'education' | 'violence' | 'reproduction' | 'work' | 'politics') => void;
  selectedGender: 'All' | 'Men' | 'Women';
  setSelectedGender: (_d: 'All' | 'Men' | 'Women') => void;
  selectedType: 'All' | 'Hate';
  setSelectedType: (_d: 'All' | 'Hate') => void;
  dates: DateRangeType;
}

const Dashboard = (props: Props) => {
  const {
    hourlyData,
    selectedTag,
    setSelectedTag,
    selectedGender,
    setSelectedGender,
    selectedType,
    setSelectedType,
    dates,
  } = props;
  const totalData = {
    totalTweet: sumBy(hourlyData[selectedTag].filter((d) => d.dateTime >= dates.startDate && d.dateTime <= dates.endDate), (d) => d.tweets),
    maleTweet: sumBy(hourlyData[selectedTag].filter((d) => d.dateTime >= dates.startDate && d.dateTime <= dates.endDate), (d) => d.male),
    maleHateTweet: sumBy(hourlyData[selectedTag].filter((d) => d.dateTime >= dates.startDate && d.dateTime <= dates.endDate), (d) => d.maleHate),
    femaleHateTweet: sumBy(hourlyData[selectedTag].filter((d) => d.dateTime >= dates.startDate && d.dateTime <= dates.endDate), (d) => d.femaleHate),
  };
  const totalDataForBar = {
    totalTweet: sumBy(hourlyData.total.filter((d) => d.dateTime >= dates.startDate && d.dateTime <= dates.endDate), (d) => (selectedType === 'All' ? d.tweets : d.maleHate + d.femaleHate)),
    maletotalTweet: sumBy(hourlyData.total.filter((d) => d.dateTime >= dates.startDate && d.dateTime <= dates.endDate), (d) => (selectedType === 'All' ? d.male : d.maleHate)),
    eduTweet: sumBy(hourlyData.education.filter((d) => d.dateTime >= dates.startDate && d.dateTime <= dates.endDate), (d) => (selectedType === 'All' ? d.tweets : d.maleHate + d.femaleHate)),
    maleEduTweet: sumBy(hourlyData.education.filter((d) => d.dateTime >= dates.startDate && d.dateTime <= dates.endDate), (d) => (selectedType === 'All' ? d.male : d.maleHate)),
    politicsTweet: sumBy(hourlyData.politics.filter((d) => d.dateTime >= dates.startDate && d.dateTime <= dates.endDate), (d) => (selectedType === 'All' ? d.tweets : d.maleHate + d.femaleHate)),
    malePoliticsTweet: sumBy(hourlyData.politics.filter((d) => d.dateTime >= dates.startDate && d.dateTime <= dates.endDate), (d) => (selectedType === 'All' ? d.male : d.maleHate)),
    reproductionTweet: sumBy(hourlyData.reproduction.filter((d) => d.dateTime >= dates.startDate && d.dateTime <= dates.endDate), (d) => (selectedType === 'All' ? d.tweets : d.maleHate + d.femaleHate)),
    maleReproductionTweet: sumBy(hourlyData.reproduction.filter((d) => d.dateTime >= dates.startDate && d.dateTime <= dates.endDate), (d) => (selectedType === 'All' ? d.male : d.maleHate)),
    violenceTweet: sumBy(hourlyData.violence.filter((d) => d.dateTime >= dates.startDate && d.dateTime <= dates.endDate), (d) => (selectedType === 'All' ? d.tweets : d.maleHate + d.femaleHate)),
    maleViolenceTweet: sumBy(hourlyData.violence.filter((d) => d.dateTime >= dates.startDate && d.dateTime <= dates.endDate), (d) => (selectedType === 'All' ? d.male : d.maleHate)),
    workTweet: sumBy(hourlyData.work.filter((d) => d.dateTime >= dates.startDate && d.dateTime <= dates.endDate), (d) => (selectedType === 'All' ? d.tweets : d.maleHate + d.femaleHate)),
    maleWorkTweet: sumBy(hourlyData.work.filter((d) => d.dateTime >= dates.startDate && d.dateTime <= dates.endDate), (d) => (selectedType === 'All' ? d.male : d.maleHate)),
  };
  const [timeFrame, setTimeFrame] = useState<'Hourly' | 'Day'>('Day');
  return (
    <div>
      <div>
        <>
          <div className='flex-div flex-wrap flex-space-between margin-bottom-07 gap-07' style={{ alignItems: 'stretch' }}>
            <DonutChartCard
              title={selectedType === 'All' ? 'Tweets by gender' : 'Tweets with hate speech by gender'}
              values={selectedType === 'All' ? [totalData.maleTweet, totalData.totalTweet - totalData.maleTweet] : [totalData.maleHateTweet, totalData.femaleHateTweet]}
              keyValue={['Men', 'Women']}
              color={[selectedGender !== 'Women' ? '#00C4AA' : '#EAEAEA', selectedGender !== 'Men' ? '#8700F9' : '#EAEAEA']}
              opacity={[1, 1]}
              subNote={selectedType === 'All' ? 'Total tweets' : 'Hate tweets'}
              subNoteValue={selectedType === 'All' ? totalData.totalTweet : totalData.maleHateTweet + totalData.femaleHateTweet}
              setGender={setSelectedGender}
            />
            <DonutChartCard
              title={selectedGender === 'All' ? 'Tweets with hate speech' : `Tweets with hate speech by ${selectedGender}`}
              values={
                [
                  selectedGender === 'All'
                    ? totalData.maleHateTweet + totalData.femaleHateTweet
                    : selectedGender === 'Men'
                      ? totalData.maleHateTweet
                      : totalData.femaleHateTweet,
                  selectedGender === 'All'
                    ? totalData.totalTweet - (totalData.maleHateTweet + totalData.femaleHateTweet)
                    : selectedGender === 'Men'
                      ? totalData.maleTweet - totalData.maleHateTweet
                      : (totalData.totalTweet - totalData.maleTweet) - totalData.femaleHateTweet,
                ]
              }
              keyValue={['Tweets with hate speech', 'Tweets without hate speech']}
              color={['#a8071a', '#AAA']}
              subNote='Hate Speech Tweets'
              subNoteValue={
                      selectedGender === 'All'
                        ? totalData.maleHateTweet + totalData.femaleHateTweet
                        : selectedGender === 'Men'
                          ? totalData.maleHateTweet
                          : totalData.femaleHateTweet
                    }
              opacity={[1, selectedType !== 'All' ? 0.3 : 1]}
              setType={setSelectedType}
            />
            <BarChartCard
              title={selectedType === 'All' ? 'Tweets by categories' : ' Tweet with hate speech by category'}
              selectedTag={selectedTag}
              values={
                [
                  selectedGender === 'All'
                    ? totalDataForBar.eduTweet
                    : selectedGender === 'Men'
                      ? totalDataForBar.maleEduTweet
                      : totalDataForBar.eduTweet - totalDataForBar.maleEduTweet,
                  selectedGender === 'All'
                    ? totalDataForBar.politicsTweet
                    : selectedGender === 'Men'
                      ? totalDataForBar.malePoliticsTweet
                      : totalDataForBar.politicsTweet - totalDataForBar.malePoliticsTweet,
                  selectedGender === 'All'
                    ? totalDataForBar.reproductionTweet
                    : selectedGender === 'Men'
                      ? totalDataForBar.maleReproductionTweet
                      : totalDataForBar.reproductionTweet - totalDataForBar.maleReproductionTweet,
                  selectedGender === 'All'
                    ? totalDataForBar.violenceTweet
                    : selectedGender === 'Men'
                      ? totalDataForBar.maleViolenceTweet
                      : totalDataForBar.violenceTweet - totalDataForBar.maleViolenceTweet,
                  selectedGender === 'All'
                    ? totalDataForBar.workTweet
                    : selectedGender === 'Men'
                      ? totalDataForBar.maleWorkTweet
                      : totalDataForBar.workTweet - totalDataForBar.maleWorkTweet,
                ]
              }
              keyValue={['Education', 'Politics', 'Reproduction', 'Violence', 'Employment']}
              keyValueCode={['education', 'politics', 'reproduction', 'violence', 'work']}
              setSelectedTag={setSelectedTag}
            />
          </div>
          <div
            style={{
              padding: '2rem',
              backgroundColor: 'var(--gray-100)',
            }}
          >
            <div className='flex-div flex-space-between flex-vert-align-center'>
              <h5 className='undp-typography bold margin-bottom-00 margin-top-00'>Tweet trends over time</h5>
              <Segmented
                className='undp-segmented-small'
                value={timeFrame}
                onChange={(value) => { setTimeFrame((value as 'Day' | 'Hourly')); }}
                options={
                  [
                    {
                      label: 'Day',
                      value: 'Day',
                    },
                    {
                      label: 'Hourly',
                      value: 'Hourly',
                    },
                  ]
                }
                onResize={() => {}}
                onResizeCapture={() => {}}
              />
            </div>
            <TimeSeries
              data={hourlyData[selectedTag].filter((d) => d.dateTime >= dates.startDate && d.dateTime <= dates.endDate).map((d) => ({
                dateTime: d.dateTime,
                totalTweet: d.tweets,
                totalMaleTweet: d.male,
                totalFemaleTweet: d.tweets - d.male,
                totalHateTweet: d.maleHate + d.femaleHate,
                totalMalehateTweet: d.maleHate,
                totalFemalehateTweet: d.femaleHate,
              }))}
              hourly={timeFrame === 'Hourly'}
            />
          </div>
        </>
      </div>
    </div>
  );
};

export default Dashboard;
