import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ComposableMap, ZoomableGroup, Geographies, Geography } from 'react-simple-maps'
import countries, { numericToAlpha2, getName } from 'i18n-iso-countries'
import { scaleLinear } from 'd3-scale'
import styled from 'styled-components'

import data from '../../../data/map.json'

countries.registerLocale(require('i18n-iso-countries/langs/en.json'))

const topCountries = Object.keys(data)
  .reduce((acc, k) => {
    const { count } = data[k]
    return acc.concat([{ country: k, count }])
  }, [])
  .sort((a, b) => b.count - a.count)
  .slice(0, 10)

const Container = styled.div`
  background-color: #f1f1f1;
`

const InfoBox = styled.div`
  position: absolute;
  bottom: 0;
  padding: 1rem;
  background-color: white;
  font-family: monospace;
  width: 10rem;
`

const WorldBox = styled(InfoBox)`
  right: 0;
`

const CountryBox = styled(InfoBox)`
  left: 0;
  width: inherit;

  .b {
    font-weight: bold;
  }

  > div:first-child {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;

    > img {
      margin-right: 0.5rem;
    }

    > span:last-child {
      margin-left: auto;
    }
  }
`

const TopCountry = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  .count {
    text-align: right;
    width: 3rem;
    font-weight: bold;
  }
`

const City = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  > span:last-child {
    font-weight: bold;
  }

  > * + * {
    margin-left: 0.8rem;
  }
`

const scale = scaleLinear()
  .domain([0, 5e3, 70e3])
  .range(['#CFD8DC', '#607D8B', '#37474F'])

const zoomOverrides = {
  RU: 2,
  AQ: 1,
  BR: 3,
  CL: 3,
  AR: 3,
  CN: 3,
  CA: 3,
}

@connect(({ ui: { isMobile } }) => ({ isMobile }))
class Map extends Component {
  state = {
    width: 0,
    height: 0,
    code: null,
    center: [0, 20],
    zoom: 1,
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

  reset = () => {
    this.setState({ zoom: 1, center: [0, 20], code: null })
  }

  onClick = geo => {
    const code = numericToAlpha2(geo.id)
    if (this.state.code === code) {
      return this.reset()
    }

    const country = data[code]
    if (!country) {
      return
    }

    const { center } = country
    const zoom = zoomOverrides[code] || 5
    this.setState({ center, zoom, code })
  }

  renderGeo = (geo, i, projection) => {
    const { isMobile } = this.props
    const fill = data[numericToAlpha2(geo.id)]
      ? scale(data[numericToAlpha2(geo.id)].count)
      : '#ebebeb'

    const style = {
      fill,
      stroke: '#607D8B',
      strokeWidth: 0.75,
      outline: 'none',
    }

    return (
      <Geography
        key={i}
        geography={geo}
        projection={projection}
        onClick={geo => !isMobile && this.onClick(geo)}
        style={{
          default: style,
          hover: style,
          pressed: style,
        }}
      />
    )
  }

  render() {
    const { isMobile } = this.props
    const { width, height, zoom, center, code } = this.state
    const [x, y] = center

    if (!width) {
      return null
    }

    const cities = code && data[code].cities && data[code].cities.slice(0, 10)

    return (
      <Container>
        <ComposableMap
          projectionConfig={{
            scale: 205,
            rotation: [-11, 0, 0],
          }}
          width={width}
          height={height}
          style={{
            width: '100%',
            height: 'auto',
          }}
        >
          <ZoomableGroup center={[x, y]} zoom={zoom}>
            <Geographies geographyUrl="https://unpkg.com/world-atlas@1.1.4/world/50m.json">
              {(geographies, projection) =>
                geographies.map((geography, i) => this.renderGeo(geography, i, projection))
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
        <WorldBox>
          {topCountries.map(({ country, count }) => (
            <TopCountry key={country}>
              <img
                src={`https://cdn.rawgit.com/hjnilsson/country-flags/master/svg/${country.toLowerCase()}.svg`}
                height={10}
                width={20}
              />{' '}
              <span>{country}</span>
              <span className="count">{count}</span>
            </TopCountry>
          ))}
        </WorldBox>

        {code &&
          !isMobile && (
            <CountryBox>
              <div>
                <img
                  src={`https://cdn.rawgit.com/hjnilsson/country-flags/master/svg/${code.toLowerCase()}.svg`}
                  height={10}
                  width={20}
                />
                <span style={{ marginRight: 20 }}>{getName(code, 'en')}</span>
                <span className="b">{data[code].count}</span>
              </div>
              <div>
                {cities &&
                  cities.map(c => (
                    <City key={c.name}>
                      <span>{c.name}</span>
                      <span>{c.count}</span>
                    </City>
                  ))}
              </div>
            </CountryBox>
          )}
      </Container>
    )
  }
}

export default Map
