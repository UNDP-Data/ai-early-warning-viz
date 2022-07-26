import styled from 'styled-components';
import { useState } from 'react';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import 'antd/dist/antd.css';
import { Radio } from 'antd';
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

const ContainerEl = styled.div`
  width: 100%;
  max-width: 128rem;
  margin: auto;
  padding: 1rem 0 2rem 0;
`;

const RowEl = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const RootEl = styled.div`
  margin: 2rem 0;
  border-top: 6px solid var(--primary-blue);
  padding: 1rem 2rem;
  box-shadow: var(--shadow);
  border-radius: 0.4rem;
`;

const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TitleEl = styled.div`
  font-size: 2rem;
  font-weight: bold;
  line-height: 3rem;
  margin-bottom: 2rem;
`;

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
      <ContainerEl>
        <>
          <RowEl>
            <DonutChartCard
              title={selectedType === 'All' ? 'Tweets by gender' : 'Tweets with hate speech by gender'}
              values={selectedType === 'All' ? [totalData.maleTweet, totalData.totalTweet - totalData.maleTweet] : [totalData.maleHateTweet, totalData.femaleHateTweet]}
              keyValue={['Men', 'Women']}
              color={['#00C4AA', '#8700F9']}
              opacity={[selectedGender !== 'Women' ? 1 : 0.3, selectedGender !== 'Men' ? 1 : 0.3]}
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
              subNote='Hate Speech Tweet'
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
                    ? totalDataForBar.totalTweet
                    : selectedGender === 'Men'
                      ? totalDataForBar.maletotalTweet
                      : totalDataForBar.totalTweet - totalDataForBar.maletotalTweet,
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
          </RowEl>
          <RootEl>
            <TitleContainer>
              <TitleEl>Tweet trends over time</TitleEl>
              <Radio.Group value={timeFrame} buttonStyle='solid' onChange={(event) => { setTimeFrame(event.target.value); }}>
                <Radio.Button value='Day'>Day</Radio.Button>
                <Radio.Button value='Hourly'>Hourly</Radio.Button>
              </Radio.Group>
            </TitleContainer>
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
          </RootEl>
        </>
      </ContainerEl>
    </div>
  );
};

export default Dashboard;
