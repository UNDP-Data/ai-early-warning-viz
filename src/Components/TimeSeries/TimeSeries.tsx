import { useEffect, useRef } from 'react';
import { scaleLinear, scaleTime } from 'd3-scale';
import { area, curveMonotoneX, line } from 'd3-shape';
import minBy from 'lodash.minby';
import maxBy from 'lodash.maxby';
import { bisector, max } from 'd3-array';
import { timeFormat } from 'd3-time-format';
import { pointer, select } from 'd3-selection';
import { brushX } from 'd3-brush';
import { axisBottom } from 'd3-axis';

interface Datatype {
  dateTime: Date;
  totalTweet: number;
  totalFemaleTweet: number;
  totalHateTweet: number;
  totalFemalehateTweet: number;
}

interface PassedProps {
  data: Datatype[];
  type: 'all' | 'hate';
  brushSettings: [number, number] | null;
  setBrushSettings: (_d: [number, number]) => void;
  hourly: boolean;
}
export const getMonth = (d:number) => {
  switch (d) {
    case 0: return 'Jan';
    case 1: return 'Feb';
    case 2: return 'Mar';
    case 3: return 'Apr';
    case 4: return 'May';
    case 5: return 'Jun';
    case 6: return 'Jul';
    case 7: return 'Aug';
    case 8: return 'Sep';
    case 9: return 'Oct';
    case 10: return 'Nov';
    case 11: return 'Dec';
    default: return d;
  }
};

const TimeSeries = (props: PassedProps) => {
  const {
    data, type, brushSettings, setBrushSettings, hourly,
  } = props;

  const BrushRef = useRef(null);
  const Line1Ref = useRef(null);
  const Area1Ref = useRef(null);
  const Line2Ref = useRef(null);
  const Area2Ref = useRef(null);
  const AxesRef = useRef(null);
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

  const lineDataMax = max(data, (d) => (type === 'all' ? d.totalTweet : d.totalHateTweet));

  const focusHeight = 60;

  const margin = {
    top: 20, right: 0, bottom: 10, left: 0,
  };
  const svgWidth = 1240;
  const svgHeight = 430;
  const graphWidth = svgWidth - margin.left - margin.right;
  const graphHeight = svgHeight - focusHeight - margin.top - (3 * margin.bottom);
  const bisect = bisector((d: any) => d.dateTime).left;

  const xScale = scaleTime()
    .range([0, graphWidth])
    .domain([(minBy(data, (d) => d.dateTime) as Datatype).dateTime, (maxBy(data, (d) => d.dateTime) as Datatype).dateTime]);

  const xScaleMiniGraph = scaleTime()
    .range([0, graphWidth + margin.left])
    .domain([(minBy(data, (d) => d.dateTime) as Datatype).dateTime, (maxBy(data, (d) => d.dateTime) as Datatype).dateTime]);

  const yScale = scaleLinear()
    .range([graphHeight - margin.bottom, margin.top])
    .domain([0, lineDataMax as number]);

  const yScaleMiniGraph = scaleLinear()
    .range([focusHeight, 0])
    .domain([0, lineDataMax as number]);

  const mainGraphLine = line()
    .x((d: any) => xScale(d.dateTime))
    .y((d: any) => yScale(type === 'all' ? d.totalTweet : d.totalHateTweet))
    .curve(curveMonotoneX);
  const mainGraphLineSecondary = line()
    .x((d: any) => xScale(d.dateTime))
    .y((d: any) => yScale(type === 'all' ? d.totalFemaleTweet : d.totalFemalehateTweet))
    .curve(curveMonotoneX);
  const miniGraphLine = line()
    .x((d: any) => xScaleMiniGraph(d.dateTime))
    .y((d: any) => yScaleMiniGraph(type === 'all' ? d.totalTweet : d.totalHateTweet))
    .curve(curveMonotoneX);
  const miniGraphLineSecondary = line()
    .x((d: any) => xScaleMiniGraph(d.dateTime))
    .y((d: any) => yScaleMiniGraph(type === 'all' ? d.totalFemaleTweet : d.totalFemalehateTweet))
    .curve(curveMonotoneX);
  const mainGraphArea = area()
    .x((d: any) => xScale(d.dateTime))
    .y1((d: any) => yScale(type === 'all' ? d.totalTweet : d.totalHateTweet))
    .y0(yScale(0))
    .curve(curveMonotoneX);
  const mainGraphAreaSecondary = area()
    .x((d: any) => xScale(d.dateTime))
    .y1((d: any) => yScale(type === 'all' ? d.totalFemaleTweet : d.totalFemalehateTweet))
    .y0(yScale(0))
    .curve(curveMonotoneX);
  const miniGraphArea = area()
    .x((d: any) => xScaleMiniGraph(d.dateTime))
    .y1((d: any) => yScaleMiniGraph(type === 'all' ? d.totalTweet : d.totalHateTweet))
    .y0(yScaleMiniGraph(0))
    .curve(curveMonotoneX);
  const miniGraphAreaSecondary = area()
    .x((d: any) => xScaleMiniGraph(d.dateTime))
    .y1((d: any) => yScaleMiniGraph(type === 'all' ? d.totalFemaleTweet : d.totalFemalehateTweet))
    .y0(yScaleMiniGraph(0))
    .curve(curveMonotoneX);
  useEffect(() => {
    const brush = brushX()
      .extent([
        [0, 0],
        [graphWidth + margin.left, focusHeight],
      ])
      .on('end', (d) => { setBrushSettings([d.selection[0], d.selection[1]]); });
    select(BrushRef.current)
      .call(brush as any)
      .call((brush as any).move, [graphWidth + margin.left - 200, graphWidth + margin.left]);
  }, []);
  useEffect(() => {
    if (brushSettings) {
      const brush = brushX()
        .extent([
          [0, 0],
          [graphWidth + margin.left, focusHeight],
        ]);
      xScale.domain([
        xScaleMiniGraph.invert(brushSettings[0]),
        xScaleMiniGraph.invert(brushSettings[1]),
      ]);
      select(BrushRef.current)
        .call((brush as any).move, [brushSettings[0], brushSettings[1]]);
      select(Line1Ref.current)
        .transition()
        .attr('d', mainGraphLine(data as any) as any);
      select(Line2Ref.current)
        .transition()
        .attr('d', mainGraphLineSecondary(data as any) as any);
      select(Area1Ref.current)
        .transition()
        .attr('d', mainGraphArea(data as any) as any);
      select(Area2Ref.current)
        .transition()
        .attr('d', mainGraphAreaSecondary(data as any) as any);
      select(AxesRef.current)
        .call(axisBottom(xScale).tickFormat(timeFormat("%d %b '%y") as any).ticks(window.innerWidth < 720 ? 5 : undefined) as any);
    }
  }, [brushSettings, hourly]);
  useEffect(() => {
    const mousemove = (event: any) => {
      const selectedData = data[bisect(data, xScale.invert(pointer(event)[0]), 0)];
      select(DateTextRef.current)
        .text(hourly ? `${selectedData.dateTime.getDate()}-${getMonth(selectedData.dateTime.getMonth())}-${selectedData.dateTime.getFullYear()} ${`${selectedData.dateTime.getHours() > 9 ? selectedData.dateTime.getHours() : `0${selectedData.dateTime.getHours()}`}:00`}` : `${selectedData.dateTime.getDate()}-${getMonth(selectedData.dateTime.getMonth())}-${selectedData.dateTime.getFullYear()}`);
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
        .attr('transform', `translate(${xScale(selectedData.dateTime) > graphWidth - 250 ? xScale(selectedData.dateTime) - 128 : xScale(selectedData.dateTime) + 3},0)`);
      select(TooltipRefLine.current)
        .attr('x1', xScale(selectedData.dateTime))
        .attr('x2', xScale(selectedData.dateTime))
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
          <path
            ref={Line1Ref}
            clipPath='úrl(#clip)'
            className='line1'
            d={mainGraphLine(data as any) as string}
            stroke='#00C4AA'
            strokeWidth={1}
            fill='none'
          />
          <path
            ref={Area1Ref}
            clipPath='úrl(#clip)'
            className='area1'
            d={mainGraphArea(data as any) as string}
            fill='#D9F6F2'
          />
          <path
            ref={Line2Ref}
            clipPath='úrl(#clip)'
            className='line2'
            d={mainGraphLineSecondary(data as any) as string}
            stroke='#8700F9'
            strokeWidth={1}
            fill='none'
          />
          <path
            ref={Area2Ref}
            clipPath='úrl(#clip)'
            className='area2'
            d={mainGraphAreaSecondary(data as any) as string}
            fill='#EDD9FE'
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
          <line
            strokeOpacity={1}
            stroke='rgb(36,36,36)'
            x1={0}
            x2={graphWidth}
            y1={yScale(0)}
            y2={yScale(0)}
          />
          <g ref={AxesRef} transform={`translate(0,${graphHeight - margin.bottom})`} />

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
                width={125}
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
                Male
              </text>
              <text
                ref={MaleTweetTextRef}
                x={120}
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
                Female
              </text>
              <text
                ref={FemaleTweetTextRef}
                x={120}
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
                x={120}
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
                Hate tweets
              </text>
              <text
                x={5}
                y={150}
                textAnchor='left'
                fontSize={12}
                alignmentBaseline='middle'
              >
                Male
              </text>
              <text
                ref={MaleHateTweetTextRef}
                x={120}
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
                Female
              </text>
              <text
                ref={FemaleHateTweetTextRef}
                x={120}
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
                x={120}
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
        <g transform={`translate(0,${graphHeight + margin.top + margin.bottom})`}>
          <rect
            x={0}
            y={0}
            width={graphWidth + margin.left}
            height={focusHeight}
            fill='#f1f1f1'
          />
          <path
            className='line'
            d={miniGraphLine(data as any) as string}
            stroke='#00C4AA'
            strokeWidth={1}
            fill='none'
          />
          <path
            className='area'
            d={miniGraphArea(data as any) as string}
            fill='#D9F6F2'
          />
          <path
            className='line'
            d={miniGraphLineSecondary(data as any) as string}
            stroke='#8700F9'
            strokeWidth={1}
            fill='none'
          />
          <path
            className='area'
            d={miniGraphAreaSecondary(data as any) as string}
            fill='#EDD9FE'
          />
          {
            xScale.ticks(window.innerWidth < 720 ? 5 : undefined).map((d, i) => (
              <g key={i}>
                <line
                  strokeOpacity={1}
                  stroke='#aaa'
                  y1={focusHeight + 4}
                  y2={focusHeight}
                  x1={xScale(d)}
                  x2={xScale(d)}
                />
                <text
                  y={focusHeight + 10}
                  x={xScale(d)}
                  dy={5}
                  fill='#aaa'
                  fontSize={10}
                  textAnchor='middle'
                >
                  {timeFormat("%b '%y")(d)}
                </text>
              </g>
            ))
          }
          <g className='x brush' ref={BrushRef} />
        </g>
      </svg>
    </>
  );
};

export default TimeSeries;
