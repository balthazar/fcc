import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { scaleLinear } from 'd3-scale'
import {
  HorizontalGridLines,
  MarkSeries,
  LineSeries,
  VerticalBarSeries,
  XAxis,
  YAxis,
  XYPlot,
} from 'react-vis'

import data from '../../../data/normalized.json'

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
const mainColor = '#3ABFD6'

const scale = scaleLinear()
  .domain([0, 200, 300, 600])
  .range(['#27EFF8', '#3ABFD6', '#4390AD', '#406581'])

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
      ? [0, 561].filter(f => Math.abs(f - hovered.stars) > 150).concat([hovered.stars])
      : [...Array(5).keys()].map(i => i * 100).concat([561])

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
