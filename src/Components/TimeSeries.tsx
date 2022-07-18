import { useEffect, useRef } from 'react';
import { scaleLinear, scaleTime } from 'd3-scale';
import { pointer, select, selectAll } from 'd3-selection';
import { area, curveMonotoneX, line } from 'd3-shape';
import { axisBottom, axisRight } from 'd3-axis';
import { timeFormat } from 'd3-time-format';
import { bisector, max } from 'd3-array';
import { brushX } from 'd3-brush';
import styled from 'styled-components';
import minBy from 'lodash.minby';
import maxBy from 'lodash.maxby';

interface Datatype {
  dateTime: Date;
  totalTweet: number;
  totalFemaleTweet: number;
  totalHateTweet: number;
  totalFemalehateTweet: number;
}

interface PassedProps {
  data: Datatype[];
  title: string;
  hourly: boolean;
  type: 'all' | 'hate';
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

const RootEl = styled.div`
  margin-top: 2rem;
`;

const TitleEl = styled.div`
  font-size: 2rem;
  font-weight: bold;
  line-height: 3rem;
  margin-bottom: 2rem;
`;

const TimeSeries = (props: PassedProps) => {
  const {
    data, title, hourly, type,
  } = props;
  const GraphRef = useRef(null);
  useEffect(() => {
    if (GraphRef.current && GraphRef !== null) {
      const graphDiv = select(GraphRef.current);

      graphDiv.selectAll('svg').remove();

      const lineDataMax = max(data, (d) => (type === 'all' ? d.totalTweet : d.totalHateTweet));

      const focusHeight = 60;

      const height = 320;

      const margin = {
        top: 20, right: 0, bottom: 10, left: 0,
      };

      const width = parseInt(graphDiv.style('width').slice(0, -2), 10)
        - margin.left
        - margin.right;
      const svg = graphDiv
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + focusHeight + margin.top + 3 * margin.bottom);

      svg
        .append('defs')
        .append('svg:clipPath')
        .attr('id', 'clip')
        .append('svg:rect')
        .attr('width', width)
        .attr('height', height)
        .attr('x', 0)
        .attr('y', 0);

      const mainGraph = svg
        .append('g')
        .attr('transform', `translate(${margin.left},0)`);

      const xScale = scaleTime()
        .range([0, width])
        .domain([(minBy(data, (d) => d.dateTime) as Datatype).dateTime, (maxBy(data, (d) => d.dateTime) as Datatype).dateTime]);

      const xScaleMiniGraph = scaleTime()
        .range([0, width + margin.left])
        .domain([(minBy(data, (d) => d.dateTime) as Datatype).dateTime, (maxBy(data, (d) => d.dateTime) as Datatype).dateTime]);

      const yScale = scaleLinear()
        .range([height - margin.bottom, margin.top])
        .domain([0, lineDataMax as number]);

      const yScaleMiniGraph = scaleLinear()
        .range([focusHeight, 0])
        .domain([0, lineDataMax as number]);

      const bisect = bisector((d: any) => d.dateTime).left;

      const miniGraph = svg
        .append('g')
        .attr(
          'transform',
          `translate(0,${height + margin.top + margin.bottom})`,
        );

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

      miniGraph
        .append('g')
        .style('font-size', '10px')
        .style('font-family', 'IBM Plex Sans')
        .style('color', '#aaa')
        .attr('transform', `translate(0,${focusHeight})`)
        .call(
          axisBottom(xScaleMiniGraph)
            .tickFormat(timeFormat("%b '%y") as any),
        );

      mainGraph
        .append('path')
        .attr('clip-path', 'url(#clip)')
        .attr('class', 'line1')
        .attr('d', mainGraphLine(data as any))
        .attr('stroke', '#00C4AA')
        .attr('stroke-width', 1)
        .attr('fill', 'none');
      mainGraph
        .append('path')
        .attr('clip-path', 'url(#clip)')
        .attr('class', 'area1')
        .attr('d', mainGraphArea(data as any))
        .attr('fill', '#D9F6F2');
      mainGraph
        .append('path')
        .attr('clip-path', 'url(#clip)')
        .attr('class', 'line2')
        .attr('d', mainGraphLineSecondary(data as any))
        .attr('stroke', '#8700F9')
        .attr('stroke-width', 1)
        .attr('fill', 'none');
      mainGraph
        .append('path')
        .attr('clip-path', 'url(#clip)')
        .attr('class', 'area2')
        .attr('d', mainGraphAreaSecondary(data as any))
        .attr('fill', '#EDD9FE');

      miniGraph
        .append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', width + margin.left)
        .attr('height', focusHeight)
        .attr('fill', '#f1f1f1');
      miniGraph
        .append('path')
        .attr('class', 'line')
        .attr('d', miniGraphLine(data as any))
        .attr('stroke', '#00C4AA')
        .attr('stroke-width', 1)
        .attr('fill', 'none');
      miniGraph
        .append('path')
        .attr('class', 'area')
        .attr('d', miniGraphArea(data as any))
        .attr('fill', '#D9F6F2');
      miniGraph
        .append('path')
        .attr('class', 'line')
        .attr('d', miniGraphLineSecondary(data as any))
        .attr('stroke', '#8700F9')
        .attr('stroke-width', 1)
        .attr('fill', 'none');
      miniGraph
        .append('path')
        .attr('class', 'area')
        .attr('d', miniGraphAreaSecondary(data as any))
        .attr('fill', '#EDD9FE');

      const xAxis = mainGraph
        .append('g')
        .style('font-size', '10px')
        .style('font-family', 'IBM Plex Sans')
        .style('color', '#222')
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(axisBottom(xScale).tickFormat(timeFormat("%d %b '%y") as any).ticks(window.innerWidth < 720 ? 5 : undefined))
        .call((g) => g.select('.domain').remove());
      mainGraph
        .append('g')
        .style('font-size', '10px')
        .style('font-family', 'IBM Plex Sans')
        .style('color', '#222')
        .call(axisRight(yScale).tickSize(width + margin.left).ticks(5))
        .call((g) => g.select('.domain').remove())
        .call((g) => g
          .selectAll('.tick:not(:first-of-type) line')
          .attr('stroke-opacity', 0.5)
          .attr('stroke', '#aaa')
          .attr('stroke-dasharray', '2,2'))
        .call((g) => g
          .selectAll('.tick:last-of-type text')
          .text(`${g.selectAll('.tick:last-of-type text').text()}`))
        .attr('transform', `translate(-${margin.left},0)`)
        .call((g) => g.selectAll('.tick text').attr('x', 0).attr('dy', -4));

      const updateChart = (event: any) => {
        const extent = event.selection;
        if (extent) {
          xScale.domain([
            xScaleMiniGraph.invert(extent[0]),
            xScaleMiniGraph.invert(extent[1]),
          ]);
          mainGraph
            .selectAll('.line1')
            .transition()
            .attr('d', mainGraphLine(data as any) as any);
          mainGraph
            .selectAll('.line2')
            .transition()
            .attr('d', mainGraphLineSecondary(data as any) as any);
          mainGraph
            .selectAll('.area1')
            .transition()
            .attr('d', mainGraphArea(data as any) as any);
          mainGraph
            .selectAll('.area2')
            .transition()
            .attr('d', mainGraphAreaSecondary(data as any) as any);
          xAxis.transition().call(axisBottom(xScale).tickFormat(timeFormat("%d %b '%y") as any).ticks(window.innerWidth < 720 ? 5 : undefined));
        }
      };

      const brush = brushX()
        .extent([
          [0, 0],
          [width + margin.left, focusHeight],
        ])
        .on('brush', updateChart);

      miniGraph
        .append('g')
        .attr('class', 'x brush')
        .call(brush)
        .call(brush.move, [width + margin.left - 200, width + margin.left]);

      const focus = mainGraph
        .append('g')
        .append('line')
        .style('fill', 'none')
        .attr('stroke', '#222')
        .attr('x1', 0)
        .attr('x2', 0)
        .attr('y1', 0)
        .attr('y2', height)
        .style('opacity', 0);

      const mouseover = () => {
        focus.style('opacity', 1);
      };
      const focusTextGroup = mainGraph.append('g').attr('opacity', 0);
      focusTextGroup
        .append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', 125)
        .attr('height', 210)
        .attr('fill', '#fff')
        .attr('opacity', 0.5);
      focusTextGroup
        .append('text')
        .attr('class', 'dateText')
        .attr('x', 5)
        .attr('y', 20)
        .attr('text-anchor', 'left')
        .attr('font-size', 12)
        .attr('font-weight', 'bold')
        .attr('alignment-baseline', 'middle');
      focusTextGroup
        .append('text')
        .attr('x', 5)
        .attr('y', 40)
        .attr('text-anchor', 'left')
        .attr('font-size', 12)
        .attr('alignment-baseline', 'middle')
        .text('All Tweets')
        .attr('font-weight', 'bold');
      focusTextGroup
        .append('text')
        .attr('x', 5)
        .attr('y', 60)
        .attr('text-anchor', 'left')
        .attr('font-size', 12)
        .attr('alignment-baseline', 'middle')
        .text('Male');
      focusTextGroup
        .append('text')
        .attr('class', 'maleAllTweets')
        .attr('x', 120)
        .attr('y', 60)
        .attr('text-anchor', 'end')
        .attr('font-size', 12)
        .attr('font-weight', 'bold')
        .attr('alignment-baseline', 'middle');
      focusTextGroup
        .append('text')
        .attr('x', 5)
        .attr('y', 80)
        .attr('text-anchor', 'left')
        .attr('font-size', 12)
        .attr('alignment-baseline', 'middle')
        .text('Female');
      focusTextGroup
        .append('text')
        .attr('class', 'femaleAllTweets')
        .attr('x', 120)
        .attr('y', 80)
        .attr('text-anchor', 'end')
        .attr('font-size', 12)
        .attr('font-weight', 'bold')
        .attr('alignment-baseline', 'middle');
      focusTextGroup
        .append('text')
        .attr('x', 5)
        .attr('y', 100)
        .attr('text-anchor', 'left')
        .attr('font-size', 12)
        .attr('alignment-baseline', 'middle')
        .text('Total');
      focusTextGroup
        .append('text')
        .attr('class', 'totalAllTweets')
        .attr('x', 120)
        .attr('y', 100)
        .attr('text-anchor', 'end')
        .attr('font-size', 12)
        .attr('font-weight', 'bold')
        .attr('alignment-baseline', 'middle');
      focusTextGroup
        .append('text')
        .attr('x', 5)
        .attr('y', 130)
        .attr('text-anchor', 'left')
        .attr('font-size', 12)
        .attr('alignment-baseline', 'middle')
        .text('Hate Tweets')
        .attr('font-weight', 'bold');
      focusTextGroup
        .append('text')
        .attr('x', 5)
        .attr('y', 150)
        .attr('text-anchor', 'left')
        .attr('font-size', 12)
        .attr('alignment-baseline', 'middle')
        .text('Male');
      focusTextGroup
        .append('text')
        .attr('class', 'maleHateTweets')
        .attr('x', 120)
        .attr('y', 150)
        .attr('text-anchor', 'end')
        .attr('font-size', 12)
        .attr('font-weight', 'bold')
        .attr('alignment-baseline', 'middle');
      focusTextGroup
        .append('text')
        .attr('x', 5)
        .attr('y', 170)
        .attr('text-anchor', 'left')
        .attr('font-size', 12)
        .attr('alignment-baseline', 'middle')
        .text('Female');
      focusTextGroup
        .append('text')
        .attr('class', 'femaleHateTweets')
        .attr('x', 120)
        .attr('y', 170)
        .attr('text-anchor', 'end')
        .attr('font-size', 12)
        .attr('font-weight', 'bold')
        .attr('alignment-baseline', 'middle');
      focusTextGroup
        .append('text')
        .attr('x', 5)
        .attr('y', 190)
        .attr('text-anchor', 'left')
        .attr('font-size', 12)
        .attr('alignment-baseline', 'middle')
        .text('Total');
      focusTextGroup
        .append('text')
        .attr('class', 'totalHateTweets')
        .attr('x', 120)
        .attr('y', 190)
        .attr('text-anchor', 'end')
        .attr('font-weight', 'bold')
        .attr('font-size', 12)
        .attr('alignment-baseline', 'middle');

      const mousemove = (event: any) => {
        const selectedData = data[bisect(data, xScale.invert(pointer(event)[0]), 0)];
        const time = `${selectedData.dateTime.getHours() > 9 ? selectedData.dateTime.getHours() : `0${selectedData.dateTime.getHours()}`}:00`;
        const year = selectedData.dateTime.getFullYear();
        const day = selectedData.dateTime.getDate();
        const month = getMonth(selectedData.dateTime.getMonth());
        focus
          .attr('x1', xScale(selectedData.dateTime))
          .attr('x2', xScale(selectedData.dateTime));
        const timeLabel = hourly ? `${day}-${month}-${year} ${time}` : `${day}-${month}-${year}`;
        selectAll('.dateText').html(timeLabel);
        selectAll('.maleAllTweets').html(`${selectedData.totalTweet - selectedData.totalFemaleTweet}`);
        selectAll('.femaleAllTweets').html(`${selectedData.totalFemaleTweet}`);
        selectAll('.totalAllTweets').html(`${selectedData.totalTweet}`);
        selectAll('.maleHateTweets').html(`${selectedData.totalHateTweet - selectedData.totalFemalehateTweet}`);
        selectAll('.femaleHateTweets').html(`${selectedData.totalFemalehateTweet}`);
        selectAll('.totalHateTweets').html(`${selectedData.totalHateTweet}`);
        focusTextGroup
          .attr('opacity', 1)
          .attr(
            'transform',
            `translate(${
              xScale(selectedData.dateTime) + 15 < width - 250
                ? xScale(selectedData.dateTime) + 5
                : xScale(selectedData.dateTime) - 130
            },0)`,
          );
      };
      const mouseout = () => {
        focus.style('opacity', 0);
        focusTextGroup.attr('opacity', 0);
      };

      mainGraph
        .append('rect')
        .style('fill', 'none')
        .style('pointer-events', 'all')
        .attr('width', width)
        .attr('height', height)
        .on('mouseover', mouseover)
        .on('mousemove', mousemove)
        .on('mouseout', mouseout);
    }
  }, [GraphRef.current, data, hourly]);
  return (
    <>
      <RootEl>
        <TitleEl>{title}</TitleEl>
        <div ref={GraphRef} />
      </RootEl>
    </>
  );
};

export default TimeSeries;
