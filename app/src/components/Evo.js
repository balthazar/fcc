import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { scaleLinear } from 'd3-scale'
import {
  HorizontalGridLines,
  MarkSeries,
  LineSeries,
  VerticalBarSeries,
  CustomSVGSeries,
  XAxis,
  YAxis,
  XYPlot,
} from 'react-vis'
import { AnnotationCalloutCircle } from 'react-annotation'

import data from '../../../data/evolution.json'

const Container = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  flex-direction: column;
  font-family: monospace;

  .rv-xy-plot__grid-lines__line {
    stroke-dasharray: 4px;
  }
`

const hoverDash = '10'
const greyColor = '#2f2f2f'
const barGraphHeight = 150
const mainColor = '#28a745'
const annotationData = [{ x: 845, y: 287122 }]

/**
 *
 * https://www.wired.com/2015/06/can-real-world-work-free-coding-boot-camp/
 * 18 juin 2015
 *
 * https://www.springwise.com/learn-coding-free-completing-projects-nonprofits/
 * 2 juillet 2015
 *
 * https://lifehacker.com/learn-to-code-for-free-while-building-apps-for-nonprofi-1716795686
 * 9 juillet 2015
 *
 * https://www.linkedin.com/pulse/use-free-code-camp-your-bootcamps-prep-work-quincy-larson/
 * 20 septembre 2015
 *
 * http://joshuakemp.blogspot.com/2015/09/why-you-should-never-finish-free-code.html
 * 20 septembre 2015
 *
 */

const annotation = (row, pos) => {
  return (
    <g>
      <AnnotationCalloutCircle
        x={pos.x + 122}
        y={pos.y}
        dy={50}
        dx={0}
        color={'#9610ff'}
        note={{
          title: 'New deploy',
          label: '',
          lineType: 'horizontal',
          align: null,
        }}
        connector={{ type: 'elbow' }}
        subject={{ radius: 10, radiusPadding: 5 }}
      />
    </g>
  )
}

const scale = scaleLinear()
  .domain([0, 500, 900, 1400])
  .range(['#F7F26A', '#8DC268', '#3F8B63', '#15534D'])

const chartData = data.map((d, i) => ({ x: i, y: d.total }))

const xTicksScale = scaleLinear().domain([0, chartData.length])
const yTotalScale = scaleLinear().domain([0, data[data.length - 1].total])

const volumeData = data.map((d, i) => ({
  x: i,
  y: d.stars,
  color: scale(d.stars),
}))

@connect(({ ui: { isMobile } }) => ({ isMobile }))
class Evolution extends Component {
  state = {
    hoverIndex: -1,
    width: 0,
    height: 0,
  }

  componentDidMount() {
    this.resize()
    window.addEventListener('resize', this.resize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize)
  }

  resize = () => {
    this.setState({ width: window.innerWidth, height: window.innerHeight })
  }

  onNearest = (value, e) => {
    const { index } = e
    this.setState({ hoverIndex: index })
  }

  render() {
    const { isMobile } = this.props
    const { width, height, hoverIndex } = this.state
    const hovered =
      hoverIndex > -1 ? { x: hoverIndex, y: data[hoverIndex].total, ...data[hoverIndex] } : null

    if (!width) {
      return null
    }

    const xTicks = xTicksScale
      .ticks(width / 150)
      .filter(f => !hovered || Math.abs(f - hoverIndex) > 100)
      .concat(hovered ? [hoverIndex] : [])

    const yTotalTicks = yTotalScale
      .ticks(height / 50)
      .filter(f => !hovered || Math.abs(f - hovered.y) > 10000)
      .concat(hovered ? [hovered.y] : [])

    const yDaysTicks = hovered
      ? [0, 1461].filter(f => Math.abs(f - hovered.stars) > 200).concat([hovered.stars])
      : [...Array(7).keys()].map(i => i * 200).concat([1461])

    return (
      <Container>
        <XYPlot
          width={width}
          height={height - (isMobile ? 0 : barGraphHeight)}
          onMouseLeave={() => this.setState({ hoverIndex: -1 })}
          margin={{ right: 100 }}
        >
          <YAxis orientation="right" tickValues={yTotalTicks} />
          <XAxis
            tickFormat={i => (i === hoverIndex ? data[i].date : data[i].date.slice(3))}
            tickValues={xTicks}
          />
          <HorizontalGridLines />
          <LineSeries onNearestX={this.onNearest} color={mainColor} data={chartData} />

          {hovered && [
            <LineSeries
              color={greyColor}
              strokeDasharray={hoverDash}
              key={0}
              data={[{ x: hovered.x, y: hovered.y }, { x: data.length - 1, y: hovered.y }]}
            />,
            <LineSeries
              color={greyColor}
              strokeDasharray={hoverDash}
              key={1}
              data={[{ x: hovered.x, y: 0 }, { x: hovered.x, y: hovered.y }]}
            />,
            <MarkSeries
              key={2}
              data={[hovered]}
              stroke="white"
              color={mainColor}
              strokeWidth={2}
              size={5}
            />,
          ]}

          <CustomSVGSeries customComponent={annotation} data={annotationData} />
        </XYPlot>

        {!isMobile && (
          <XYPlot
            width={width}
            height={barGraphHeight}
            margin={{ right: 100 }}
            onMouseLeave={() => this.setState({ hoverIndex: -1 })}
          >
            <YAxis orientation="right" tickValues={yDaysTicks} />
            <VerticalBarSeries colorType="literal" onNearestX={this.onNearest} data={volumeData} />

            {hovered && [
              <LineSeries
                color={greyColor}
                strokeDasharray={hoverDash}
                key={0}
                data={[
                  { x: hovered.x, y: hovered.stars },
                  { x: data.length - 1, y: hovered.stars },
                ]}
              />,
              <MarkSeries
                data={[{ x: hovered.x, y: hovered.stars }]}
                stroke="black"
                color={volumeData[hoverIndex].color}
                strokeWidth={1}
                key={1}
              />,
            ]}
          </XYPlot>
        )}
      </Container>
    )
  }
}

export default Evolution
