import styled from 'styled-components';
import { format } from 'd3-format';

interface Props {
  title: string;
  values: [number, number];
  keyValue: [string, string];
  color: [string, string];
  subNote: string;
  subNoteValue: number;
  opacity: [number, number];
  setGender?: (_d: 'Men' | 'Women' | 'All') => void;
  setType?: (_d: 'Hate' | 'All') => void;
  footnote?: string;
}

const RootEl = styled.div`
  padding: 2rem;
  background-color: var(--gray-100);
  min-width: 24rem;
  width: calc(33.33% - 5.34rem);
  flex-grow: 1;
`;

const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
  const radian = Math.PI / 180.0;
  const angleInRadians = (angleInDegrees - 90) * radian;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians)),
  };
};

export const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  const d = [
    'M', start.x, start.y,
    'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y,
  ].join(' ');
  return d;
};

interface ColorElProps {
  color: string;
}

const ColorEl = styled.div<ColorElProps>`
  width: 1rem;
  height: 1rem;
  background-color: ${(props) => props.color};
`;

export const DonutChartCard = (props: Props) => {
  const {
    title,
    values,
    keyValue,
    color,
    subNote,
    subNoteValue,
    opacity,
    setType,
    setGender,
    footnote,
  } = props;

  const formatData = (d: number) => format(',')(parseFloat(d.toFixed(0))).replace(',', ' ');
  return (
    <RootEl>
      <h6 className='undp-typography bold'>{title}</h6>
      <div className='flex-div margin-top-03 margin-bottom-03 flex-vert-align-center'>
        <ColorEl color={color[0]} />
        <div>
          {keyValue[0]}
          {' '}
          <span className='bold'>
            {formatData(values[0])}
            {' '}
            (
            {((values[0] * 100) / (values[0] + values[1])).toFixed(1)}
            %
            )
          </span>
        </div>
      </div>
      <div className='flex-div margin-top-03 margin-bottom-03 flex-vert-align-center'>
        <ColorEl color={color[1]} />
        <div>
          {keyValue[1]}
          {' '}
          <span className='bold'>
            {formatData(values[1])}
            {' '}
            (
            {((values[1] * 100) / (values[0] + values[1])).toFixed(1)}
            %
            )
          </span>
        </div>
      </div>
      <div className='flex-div' style={{ alignItems: 'stretch' }}>
        <svg width='320px' viewBox='0 0 360 360' style={{ margin: 'auto' }}>
          <path
            d={describeArc(180, 180, 140, 0, 360 * (values[0] / (values[0] + values[1])))}
            fill='none'
            strokeWidth={40}
            style={{ stroke: color[0], cursor: 'pointer' }}
            opacity={opacity[0]}
            onClick={() => {
              if (setGender) {
                if (opacity[1] !== 1) setGender('All');
                else setGender('Men');
              }
              if (setType) {
                if (opacity[1] !== 1) setType('All');
                else setType('Hate');
              }
            }}
          />
          <path
            d={describeArc(180, 180, 140, 360 * (values[0] / (values[0] + values[1])), 360)}
            fill='none'
            strokeWidth={40}
            style={{ stroke: color[1], cursor: 'pointer' }}
            opacity={opacity[1]}
            onClick={() => {
              if (setGender) {
                if (opacity[0] !== 1) setGender('All');
                else setGender('Women');
              }
              if (setType) {
                if (opacity[1] !== 1) setType('All');
              }
            }}
          />
          <text
            x={180}
            y={180}
            textAnchor='middle'
            fontFamily='proxima-nova'
            fontWeight='bold'
            fontSize='48px'
            dy={10}
          >
            {formatData(subNoteValue)}
          </text>
          <text
            x={180}
            y={180}
            textAnchor='middle'
            fontFamily='proxima-nova'
            fontWeight='bold'
            fontSize='20px'
            dy={35}
          >
            {subNote}
          </text>
        </svg>
      </div>
      {
        footnote
          ? (
            <p className='undp-typography small-font italics margin-top-05' style={{ color: 'var(--gray-500' }}>
              {footnote}
            </p>
          ) : null
      }
    </RootEl>
  );
};
