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
import { AggregatedDataType, HourlyTweetData } from './types';
// import TimeSeriesRefactored from './Components/TimeSeries/TimeSeries';

interface Props {
  data: AggregatedDataType[];
  hourlyData: HourlyTweetData[];
  selectedTag: 'total' | 'Edu' | 'Stem' | 'Violence' | 'Reproduction' | 'Work' | 'Politics';
  setSelectedTag: (_d: 'total' | 'Edu' | 'Stem' | 'Violence' | 'Reproduction' | 'Work' | 'Politics') => void;
  selectedGender: 'All' | 'Male' | 'Female';
  setSelectedGender: (_d: 'All' | 'Male' | 'Female') => void;
}

const ContainerEl = styled.div`
  width: 100%;
  max-width: 128rem;
  margin: auto;
  padding: 2rem 0;
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

const getTweetSum = (data: AggregatedDataType[], tag: 'total' | 'Edu' | 'Stem' | 'Violence' | 'Reproduction' | 'Work' | 'Politics') => ({
  totalTweet: sumBy(data, (d) => d[tag].totalTweet),
  totalHateTweet: sumBy(data, (d) => d[tag].totalHateTweet),
  maleTweet: sumBy(data, (d) => d[tag].maleTweet),
  femaleTweet: sumBy(data, (d) => d[tag].femaleTweet),
  maleHateTweet: sumBy(data, (d) => d[tag].maleHateTweet),
  femaleHateTweet: sumBy(data, (d) => d[tag].femaleHateTweet),
});

const Dashboard = (props: Props) => {
  const {
    data,
    hourlyData,
    selectedTag,
    setSelectedTag,
    selectedGender,
    setSelectedGender,
  } = props;
  const totalData = {
    total: getTweetSum(data, 'total'),
    Edu: getTweetSum(data, 'Edu'),
    Stem: getTweetSum(data, 'Stem'),
    Violence: getTweetSum(data, 'Violence'),
    Reproduction: getTweetSum(data, 'Reproduction'),
    Work: getTweetSum(data, 'Work'),
    Politics: getTweetSum(data, 'Politics'),
  };
  const [timeFrame, setTimeFrame] = useState<'Hourly' | 'Day'>('Hourly');
  return (
    <div>
      <ContainerEl>
        <>
          <RowEl>
            <DonutChartCard
              title='Total Tweets By Gender'
              values={[totalData[selectedTag].maleTweet, totalData[selectedTag].femaleTweet]}
              keyValue={['By Male', 'By Female']}
              color={['#00C4AA', '#8700F9']}
              opacity={[selectedGender !== 'Female' ? 1 : 0.3, selectedGender !== 'Male' ? 1 : 0.3]}
              subNote='Total Tweets'
              subNoteValue={totalData[selectedTag].maleTweet + totalData[selectedTag].femaleTweet}
              setGender={setSelectedGender}
            />
            <DonutChartCard
              title={selectedGender === 'All' ? 'Total Hate Tweets' : `Total Hate Tweets by ${selectedGender}`}
              values={
                      [
                        selectedGender === 'All'
                          ? totalData[selectedTag].totalHateTweet
                          : selectedGender === 'Male'
                            ? totalData[selectedTag].maleHateTweet
                            : totalData[selectedTag].femaleHateTweet,
                        selectedGender === 'All'
                          ? totalData[selectedTag].totalTweet - totalData[selectedTag].totalHateTweet
                          : selectedGender === 'Male'
                            ? totalData[selectedTag].maleTweet - totalData[selectedTag].maleHateTweet
                            : totalData[selectedTag].femaleTweet - totalData[selectedTag].femaleHateTweet,
                      ]
                    }
              keyValue={['Hate Speech Tweet', 'Non Hate Speech Tweet']}
              color={['#D12800', '#AAA']}
              subNote='Hate Speech Tweet'
              subNoteValue={
                      selectedGender === 'All'
                        ? totalData[selectedTag].totalHateTweet
                        : selectedGender === 'Male'
                          ? totalData[selectedTag].maleHateTweet
                          : totalData[selectedTag].femaleHateTweet
                    }
              opacity={[1, 1]}
            />
            <BarChartCard
              title='Tweets By Categories'
              selectedTag={selectedTag}
              values={
                      [
                        selectedGender === 'All'
                          ? totalData.Edu.totalTweet
                          : selectedGender === 'Male'
                            ? totalData.Edu.maleTweet
                            : totalData.Edu.femaleTweet,
                        selectedGender === 'All'
                          ? totalData.Politics.totalTweet
                          : selectedGender === 'Male'
                            ? totalData.Politics.maleTweet
                            : totalData.Politics.femaleTweet,
                        selectedGender === 'All'
                          ? totalData.Reproduction.totalTweet
                          : selectedGender === 'Male'
                            ? totalData.Reproduction.maleTweet
                            : totalData.Reproduction.femaleTweet,
                        selectedGender === 'All'
                          ? totalData.Stem.totalTweet
                          : selectedGender === 'Male'
                            ? totalData.Stem.maleTweet
                            : totalData.Stem.femaleTweet,
                        selectedGender === 'All'
                          ? totalData.Violence.totalTweet
                          : selectedGender === 'Male'
                            ? totalData.Violence.maleTweet
                            : totalData.Violence.femaleTweet,
                        selectedGender === 'All'
                          ? totalData.Work.totalTweet
                          : selectedGender === 'Male'
                            ? totalData.Work.maleTweet
                            : totalData.Work.femaleTweet,
                      ]
                    }
              keyValue={['Education', 'Politics', 'Reproduction', 'STEM', 'Violence', 'Work']}
              keyValueCode={['Edu', 'Politics', 'Reproduction', 'Stem', 'Violence', 'Work']}
              setSelectedTag={setSelectedTag}
            />
          </RowEl>
          <RootEl>
            <TitleContainer>
              <TitleEl>Time Series Data</TitleEl>
              <Radio.Group value={timeFrame} buttonStyle='solid' onChange={(event) => { setTimeFrame(event.target.value); }}>
                <Radio.Button value='Hourly'>Hourly</Radio.Button>
                <Radio.Button value='Day'>Day</Radio.Button>
              </Radio.Group>
            </TitleContainer>
            <TimeSeries
              data={timeFrame === 'Day'
                ? data.map((d) => ({
                  dateTime: d.date, totalTweet: d[selectedTag].totalTweet, totalFemaleTweet: d[selectedTag].femaleTweet, totalHateTweet: d[selectedTag].totalHateTweet, totalFemalehateTweet: d[selectedTag].femaleHateTweet,
                }))
                : hourlyData.map((d) => ({
                  dateTime: d.dateTime, totalTweet: d[selectedTag].totalTweet, totalFemaleTweet: d[selectedTag].femaleTweet, totalHateTweet: d[selectedTag].totalHateTweet, totalFemalehateTweet: d[selectedTag].femaleHateTweet,
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
