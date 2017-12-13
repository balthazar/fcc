import React, { Component } from 'react'
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

import data from '../../../data/smith.json'

const hoverDash = '10'
const greyColor = '#5d5d5d'

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

const scale = scaleLinear()
  .domain([20, 50, 100])
  .range(['#F3E859', '#D88748', '#B56148'])

const chartData = data.map((d, i) => ({
  x: i,
  y: d.neos / d.total * 100,
  color: scale(d.neos / d.total * 100),
  ...d,
}))

const xTicksScale = scaleLinear().domain([0, chartData.length])
const yTicksScale = scaleLinear().domain([0, 100])

class Smith extends Component {
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
    const { width, height, hoverIndex } = this.state
    const hovered =
      hoverIndex > -1
        ? { x: hoverIndex, y: chartData[hoverIndex].smithes, ...chartData[hoverIndex] }
        : null

    const xTicks = xTicksScale
      .ticks(width / 150)
      .filter(f => !hovered || Math.abs(f - hoverIndex) > 100)
      .concat(hovered ? [hoverIndex] : [])

    const yTicks = yTicksScale
      .ticks(height / 50)
      .filter(() => !hovered)
      .concat(hovered ? [0, hovered.y, 100] : [])

    return (
      <Container>
        <XYPlot
          width={width}
          height={height}
          onMouseLeave={() => this.setState({ hoverIndex: -1 })}
          margin={{ right: 100 }}
        >
          <HorizontalGridLines />
          <YAxis
            orientation="right"
            tickValues={yTicks}
            tickFormat={t =>
              `${t.toFixed(0)}% ${hovered && hovered.y === t ? `(${hovered.neos})` : ''}`
            }
          />
          <XAxis
            tickFormat={i => (i === hoverIndex ? data[i].date : data[i].date.slice(3))}
            tickValues={xTicks}
          />
          <VerticalBarSeries data={chartData} colorType="literal" onNearestX={this.onNearest} />

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
              stroke={'#2f2f2f'}
              color={hovered.color}
              strokeWidth={2}
              size={7}
            />,
          ]}
        </XYPlot>
      </Container>
    )
  }
}

export default Smith
