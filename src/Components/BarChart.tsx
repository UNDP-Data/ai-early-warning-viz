import styled from 'styled-components';
import { format } from 'd3-format';
import max from 'lodash.max';
import { scaleBand } from 'd3-scale';

interface Props {
  title: string;
  values: number[];
  keyValue: string[];
  keyValueCode: ('total' | 'education' | 'violence' | 'reproduction' | 'work' | 'politics')[];
  selectedTag: 'total' | 'education' | 'violence' | 'reproduction' | 'work' | 'politics';
  setSelectedTag: (_d: 'total' | 'education' | 'violence' | 'reproduction' | 'work' | 'politics') => void;
}

const RootEl = styled.div`
  padding: 2rem;
  background-color: var(--gray-100);
  min-width: 24rem;
  width: calc(33.33% - 5.34rem);
  flex-grow: 1;
`;

export const BarChartCard = (props: Props) => {
  const {
    title,
    values,
    keyValue,
    selectedTag,
    keyValueCode,
    setSelectedTag,
  } = props;

  const margin = {
    top: 20,
    bottom: 20,
    left: 20,
    right: 20,
  };
  const graphHeight = 360 - margin.top - margin.bottom;
  const graphWidth = 360 - margin.left - margin.right;

  const formatData = (d: number) => format(',')(parseFloat(d.toFixed(0))).replace(',', ' ');
  const xScale = scaleBand()
    .rangeRound([0, graphWidth])
    .domain(keyValue)
    .paddingOuter(0)
    .paddingInner(0.5);
  const barWidth = xScale.bandwidth();
  return (
    <RootEl>
      <h6 className='undp-typography bold'>{title}</h6>
      <div className='flex-div' style={{ alignItems: 'stretch' }}>
        <svg width='320px' viewBox='0 0 360 360' style={{ margin: 'auto', marginTop: 'var(--spacing-07)' }}>
          <g transform={`translate(${margin.left},${margin.top})`}>
            {
              values.map((d, i) => (
                <g
                  key={i}
                  opacity={selectedTag === keyValueCode[i] || selectedTag === 'total' ? 1 : 0.3}
                  onClick={() => {
                    if (selectedTag === keyValueCode[i]) setSelectedTag('total');
                    else setSelectedTag(keyValueCode[i]);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <rect
                    fill='#006EB5'
                    x={xScale(keyValue[i])}
                    y={graphHeight - (d * (graphHeight / (max(values) as number)))}
                    height={d * (graphHeight / (max(values) as number))}
                    rx={4}
                    ry={4}
                    width={barWidth}
                  />
                  <text
                    fill='#222'
                    x={(xScale(keyValue[i]) as number) + (barWidth / 2)}
                    y={graphHeight}
                    textAnchor='middle'
                    dy={15}
                    fontSize={12}
                  >
                    {keyValue[i]}
                  </text>
                  <text
                    fill='#006EB5'
                    y={graphHeight - (d * (graphHeight / (max(values) as number)))}
                    x={(xScale(keyValue[i]) as number) + (barWidth / 2)}
                    textAnchor='middle'
                    dy={-3}
                    fontSize={14}
                    fontWeight='bold'
                  >
                    {formatData(d)}
                  </text>
                </g>
              ))
            }
          </g>
        </svg>
      </div>
    </RootEl>
  );
};
