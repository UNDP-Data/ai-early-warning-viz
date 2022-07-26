import { useEffect, useRef } from 'react';
import { scaleLinear, scaleTime } from 'd3-scale';
import { area, curveMonotoneX, line } from 'd3-shape';
import minBy from 'lodash.minby';
import maxBy from 'lodash.maxby';
import { bisector, max } from 'd3-array';
import { pointer, select } from 'd3-selection';
import moment from 'moment';

interface Datatype {
  dateTime: moment.Moment;
  totalTweet: number;
  totalFemaleTweet: number;
  totalMaleTweet: number;
  totalHateTweet: number;
  totalFemalehateTweet: number;
  totalMalehateTweet: number;
}

interface PassedProps {
  data: Datatype[];
  hourly: boolean;
  borderColor: [string, string, string];
  fillColor: [string, string, string];
}

const TimeSeries = (props: PassedProps) => {
  const {
    data,
    hourly,
    borderColor,
    fillColor,
  } = props;
  const MouseoverRectRef = useRef(null);

  const TooltipGRef = useRef(null);
  const TotalTweetTextRef = useRef(null);
  const MaleTweetTextRef = useRef(null);
  const FemaleTweetTextRef = useRef(null);
  const TotalHateTweetTextRef = useRef(null);
  const MaleHateTweetTextRef = useRef(null);
  const FemaleHateTweetTextRef = useRef(null);
  const DateTextRef = useRef(null);
  const TooltipRefLine = useRef(null);

  const lineDataMax = Math.max(max(data, (d) => d.totalMaleTweet) as number, max(data, (d) => d.totalFemaleTweet) as number);
  const margin = {
    top: 10, right: 0, bottom: 10, left: 30,
  };
  const svgWidth = 1240;
  const svgHeight = 660;
  const graphWidth = svgWidth - margin.left - margin.right;
  const graphHeight = svgHeight - margin.top - margin.bottom;
  const halfGraphHeight = graphHeight / 2;
  const bisect = bisector((d: any) => d.dateTime.toDate()).left;

  const xScale = scaleTime()
    .range([0, graphWidth])
    .domain([(minBy(data, (d) => d.dateTime) as Datatype).dateTime.toDate(), (maxBy(data, (d) => d.dateTime) as Datatype).dateTime.toDate()]);
  const yScale = scaleLinear()
    .range([halfGraphHeight, margin.top])
    .domain([0, lineDataMax as number]);
  const yScaleBottomHalf = scaleLinear()
    .range([halfGraphHeight, graphHeight])
    .domain([0, lineDataMax as number]);

  const mainGraphLine = line<any>()
    .x((d: Datatype) => xScale(d.dateTime.toDate()))
    .y((d: Datatype) => yScale(d.totalMaleTweet))
    .curve(curveMonotoneX);
  const mainGraphLineSecondary = line<any>()
    .x((d: Datatype) => xScale(d.dateTime.toDate()))
    .y((d: Datatype) => yScale(d.totalMalehateTweet))
    .curve(curveMonotoneX);
  const mainGraphArea = area<any>()
    .x((d: Datatype) => xScale(d.dateTime.toDate()))
    .y1((d: Datatype) => yScale(d.totalMaleTweet))
    .y0(yScale(0))
    .curve(curveMonotoneX);
  const mainGraphAreaSecondary = area<any>()
    .x((d: Datatype) => xScale(d.dateTime.toDate()))
    .y1((d: Datatype) => yScale(d.totalMalehateTweet))
    .y0(yScale(0))
    .curve(curveMonotoneX);
  const mainGraphLineBottom = line<any>()
    .x((d: Datatype) => xScale(d.dateTime.toDate()))
    .y((d: Datatype) => yScaleBottomHalf(d.totalFemaleTweet))
    .curve(curveMonotoneX);
  const mainGraphLineSecondaryBottom = line<any>()
    .x((d: Datatype) => xScale(d.dateTime.toDate()))
    .y((d: Datatype) => yScaleBottomHalf(d.totalFemalehateTweet))
    .curve(curveMonotoneX);
  const mainGraphAreaBottom = area<any>()
    .x((d: Datatype) => xScale(d.dateTime.toDate()))
    .y1((d: Datatype) => yScaleBottomHalf(d.totalFemaleTweet))
    .y0(yScaleBottomHalf(0))
    .curve(curveMonotoneX);
  const mainGraphAreaSecondaryBottom = area<any>()
    .x((d: Datatype) => xScale(d.dateTime.toDate()))
    .y1((d: Datatype) => yScaleBottomHalf(d.totalFemalehateTweet))
    .y0(yScaleBottomHalf(0))
    .curve(curveMonotoneX);
  useEffect(() => {
    const mousemove = (event: any) => {
      const selectedData = data[bisect(data, xScale.invert(pointer(event)[0]), 0)];
      select(DateTextRef.current)
        .text(hourly ? `${selectedData.dateTime.format('D-MMM-YYYY, HH:mm')}` : `${selectedData.dateTime.format('D-MMM-YYYY')}`);
      select(TotalTweetTextRef.current)
        .text(selectedData.totalTweet);
      select(MaleTweetTextRef.current)
        .text(selectedData.totalTweet - selectedData.totalFemaleTweet);
      select(FemaleTweetTextRef.current)
        .text(selectedData.totalFemaleTweet);
      select(TotalHateTweetTextRef.current)
        .text(selectedData.totalHateTweet);
      select(MaleHateTweetTextRef.current)
        .text(selectedData.totalHateTweet - selectedData.totalFemalehateTweet);
      select(FemaleHateTweetTextRef.current)
        .text(selectedData.totalFemalehateTweet);
      select(TooltipGRef.current)
        .attr('opacity', 1)
        .attr('transform', `translate(${xScale(selectedData.dateTime.toDate()) > graphWidth - 250 ? xScale(selectedData.dateTime.toDate()) - 153 : xScale(selectedData.dateTime.toDate()) + 3},0)`);
      select(TooltipRefLine.current)
        .attr('x1', xScale(selectedData.dateTime.toDate()))
        .attr('x2', xScale(selectedData.dateTime.toDate()))
        .attr('opacity', 1);
    };
    const mouseout = () => {
      select(TooltipGRef.current)
        .attr('opacity', 0);
      select(TooltipRefLine.current)
        .attr('opacity', 0);
    };
    select(MouseoverRectRef.current)
      .on('mousemove', mousemove)
      .on('mouseout', mouseout);
  }, [xScale, hourly]);
  return (
    <>
      <svg width='100%' viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
        <defs>
          <clipPath id='clip'>
            <rect width={svgWidth} height={graphHeight} x='0' y='0' />
          </clipPath>
        </defs>
        <g transform={`translate(${margin.left},0)`}>
          <text
            fontSize={18}
            textAnchor='middle'
            transform={`translate(-15,${graphHeight / 4}) rotate(-90)`}
            fontWeight='bold'
            fill={borderColor[0]}
          >
            Tweets by men →
          </text>
          <text
            fontSize={18}
            textAnchor='middle'
            transform={`translate(-15,${0.75 * graphHeight}) rotate(-90)`}
            fontWeight='bold'
            fill={borderColor[1]}
          >
            ← Tweets by women
          </text>
          <path
            clipPath='url(#clip)'
            d={mainGraphLine(data) as string}
            stroke={borderColor[0]}
            strokeWidth={1}
            fill='none'
          />
          <path
            clipPath='url(#clip)'
            d={mainGraphArea(data) as string}
            fill={fillColor[0]}
          />
          <path
            clipPath='url(#clip)'
            d={mainGraphLineSecondary(data) as string}
            stroke={borderColor[2]}
            strokeWidth={1}
            fill='none'
          />
          <path
            clipPath='url(#clip)'
            d={mainGraphAreaSecondary(data) as string}
            fill={fillColor[2]}
          />
          <path
            clipPath='url(#clip)'
            d={mainGraphLineBottom(data) as string}
            stroke={borderColor[1]}
            strokeWidth={1}
            fill='none'
          />
          <path
            clipPath='url(#clip)'
            d={mainGraphAreaBottom(data) as string}
            fill={fillColor[1]}
          />
          <path
            clipPath='url(#clip)'
            d={mainGraphLineSecondaryBottom(data) as string}
            stroke={borderColor[2]}
            strokeWidth={1}
            fill='none'
          />
          <path
            clipPath='url(#clip)'
            d={mainGraphAreaSecondaryBottom(data) as string}
            fill={fillColor[2]}
          />
          {
            yScale.ticks(5).map((d, i) => (
              <g key={i}>
                <line
                  strokeOpacity={0.5}
                  stroke='#aaa'
                  strokeDasharray='2,2'
                  x1={0}
                  x2={graphWidth}
                  y1={yScale(d)}
                  y2={yScale(d)}
                />
                <text
                  x={0}
                  y={yScale(d)}
                  dy={-4}
                  fill='rgb(36,36,36)'
                  fontSize={10}
                >
                  {d}
                </text>
              </g>
            ))
          }
          {
            yScaleBottomHalf.ticks(5).map((d, i) => (
              <g key={i}>
                <line
                  strokeOpacity={0.5}
                  stroke='#aaa'
                  strokeDasharray='2,2'
                  x1={0}
                  x2={graphWidth}
                  y1={yScaleBottomHalf(d)}
                  y2={yScaleBottomHalf(d)}
                />
                <text
                  x={0}
                  y={yScaleBottomHalf(d)}
                  dy={10}
                  fill='rgb(36,36,36)'
                  fontSize={10}
                >
                  {d}
                </text>
              </g>
            ))
          }
          <line
            strokeOpacity={1}
            stroke='rgb(36,36,36)'
            x1={0}
            x2={graphWidth}
            y1={yScale(0)}
            y2={yScale(0)}
          />
          <g transform={`translate(0,${graphHeight - margin.bottom})`} />

          <g>
            <line
              ref={TooltipRefLine}
              x1={0}
              x2={0}
              y1={0}
              y2={graphHeight}
              stroke='#222'
              strokeWidth={1}
              fill='none'
              opacity={0}
            />
            <g ref={TooltipGRef} opacity={0}>
              <rect
                x={0}
                y={0}
                fill='#fff'
                opacity={0.5}
                width={150}
                height={210}
              />
              <text
                ref={DateTextRef}
                x={5}
                y={20}
                textAnchor='left'
                fontSize={12}
                fontWeight='bold'
                alignmentBaseline='middle'
              />
              <text
                x={5}
                y={40}
                textAnchor='left'
                fontSize={12}
                fontWeight='bold'
                alignmentBaseline='middle'
              >
                All tweets
              </text>
              <text
                x={5}
                y={60}
                textAnchor='left'
                fontSize={12}
                alignmentBaseline='middle'
              >
                Men
              </text>
              <text
                ref={MaleTweetTextRef}
                x={145}
                y={60}
                textAnchor='end'
                fontSize={12}
                fontWeight='bold'
                alignmentBaseline='middle'
              />
              <text
                x={5}
                y={80}
                textAnchor='left'
                fontSize={12}
                alignmentBaseline='middle'
              >
                Women
              </text>
              <text
                ref={FemaleTweetTextRef}
                x={145}
                y={80}
                textAnchor='end'
                fontSize={12}
                fontWeight='bold'
                alignmentBaseline='middle'
              />
              <text
                x={5}
                y={100}
                textAnchor='left'
                fontSize={12}
                alignmentBaseline='middle'
              >
                Total
              </text>
              <text
                ref={TotalTweetTextRef}
                x={145}
                y={100}
                textAnchor='end'
                fontSize={12}
                fontWeight='bold'
                alignmentBaseline='middle'
              />
              <text
                x={5}
                y={130}
                textAnchor='left'
                fontSize={12}
                fontWeight='bold'
                alignmentBaseline='middle'
              >
                Tweets with hate speech
              </text>
              <text
                x={5}
                y={150}
                textAnchor='left'
                fontSize={12}
                alignmentBaseline='middle'
              >
                Men
              </text>
              <text
                ref={MaleHateTweetTextRef}
                x={145}
                y={150}
                textAnchor='end'
                fontSize={12}
                fontWeight='bold'
                alignmentBaseline='middle'
              />
              <text
                x={5}
                y={170}
                textAnchor='left'
                fontSize={12}
                alignmentBaseline='middle'
              >
                Women
              </text>
              <text
                ref={FemaleHateTweetTextRef}
                x={145}
                y={170}
                textAnchor='end'
                fontSize={12}
                fontWeight='bold'
                alignmentBaseline='middle'
              />
              <text
                x={5}
                y={190}
                textAnchor='left'
                fontSize={12}
                alignmentBaseline='middle'
              >
                Total
              </text>
              <text
                ref={TotalHateTweetTextRef}
                x={145}
                y={190}
                textAnchor='end'
                fontSize={12}
                fontWeight='bold'
                alignmentBaseline='middle'
              />
            </g>
          </g>
          <rect
            ref={MouseoverRectRef}
            fill='none'
            pointerEvents='all'
            width={graphWidth}
            height={graphHeight}
          />
        </g>
      </svg>
    </>
  );
};

export default TimeSeries;
