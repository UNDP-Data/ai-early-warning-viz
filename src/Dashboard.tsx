import { useState } from 'react';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { Segmented } from 'antd';
import sumBy from 'lodash.sumby';
import { DonutChartCard } from './Components/DonutChart';
import { BarChartCard } from './Components/BarChart';
import TimeSeries from './Components/TimeSeries';
import { DateRangeType, FinalHourlyDataType } from './types';
import { Translation } from './Language';

interface Props {
  hourlyData: FinalHourlyDataType;
  selectedTag: 'total' | 'education' | 'violence' | 'reproduction' | 'work' | 'politics';
  setSelectedTag: (_d: 'total' | 'education' | 'violence' | 'reproduction' | 'work' | 'politics') => void;
  selectedGender: 'All' | 'Men' | 'Women';
  setSelectedGender: (_d: 'All' | 'Men' | 'Women') => void;
  selectedType: 'All' | 'Hate';
  setSelectedType: (_d: 'All' | 'Hate') => void;
  dates: DateRangeType;
  language: 'en' | 'es';
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
    language,
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
              title={selectedType === 'All' ? Translation[Translation.findIndex((d) => d.key === 'Tweets by gender')][language] : Translation[Translation.findIndex((d) => d.key === 'Tweets with hate speech by gender')][language]}
              values={selectedType === 'All' ? [totalData.maleTweet, totalData.totalTweet - totalData.maleTweet] : [totalData.maleHateTweet, totalData.femaleHateTweet]}
              keyValue={['Men', 'Women']}
              color={[selectedGender !== 'Women' ? '#00C4AA' : '#EAEAEA', selectedGender !== 'Men' ? '#8700F9' : '#EAEAEA']}
              opacity={[1, 1]}
              subNote={selectedType === 'All' ? Translation[Translation.findIndex((d) => d.key === 'Total tweets')][language] : Translation[Translation.findIndex((d) => d.key === 'Hate speech tweets')][language]}
              subNoteValue={selectedType === 'All' ? totalData.totalTweet : totalData.maleHateTweet + totalData.femaleHateTweet}
              setGender={setSelectedGender}
            />
            <DonutChartCard
              title={selectedGender === 'All' ? Translation[Translation.findIndex((d) => d.key === 'Tweets with hate speech')][language] : Translation[Translation.findIndex((d) => d.key === `Tweets with hate speech by ${selectedGender}`)][language]}
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
              keyValue={[Translation[Translation.findIndex((d) => d.key === 'Tweets with hate speech')][language], Translation[Translation.findIndex((d) => d.key === 'Tweets without hate speech')][language]]}
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
              title={selectedType === 'All' ? Translation[Translation.findIndex((d) => d.key === 'Tweets by categories')][language] : Translation[Translation.findIndex((d) => d.key === 'Tweets with hate speech by categories')][language]}
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
              keyValue={[Translation[Translation.findIndex((d) => d.key === 'Education')][language], Translation[Translation.findIndex((d) => d.key === 'Politics')][language], Translation[Translation.findIndex((d) => d.key === 'Reproduction')][language], Translation[Translation.findIndex((d) => d.key === 'Violence')][language], Translation[Translation.findIndex((d) => d.key === 'Employment')][language]]}
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
              <h5 className='undp-typography bold margin-bottom-00 margin-top-00'>{Translation[Translation.findIndex((d) => d.key === 'Tweets trend over time')][language]}</h5>
              <Segmented
                className='undp-segmented-small'
                value={timeFrame}
                onChange={(value) => { setTimeFrame((value as 'Day' | 'Hourly')); }}
                options={
                  [
                    {
                      label: Translation[Translation.findIndex((d) => d.key === 'Day')][language],
                      value: 'Day',
                    },
                    {
                      label: Translation[Translation.findIndex((d) => d.key === 'Hourly')][language],
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
              language={language}
            />
          </div>
        </>
      </div>
    </div>
  );
};

export default Dashboard;
