import React from 'react'
import Svg, { G, Defs, Polygon, Stop, LinearGradient } from 'react-native-svg'

export function HomeBg (props) {
  const { size = 750 } = props

  return (
    <Svg width={size} height={size / 750 * 405} viewBox='0 0 750 405'>
      <Defs>
        <LinearGradient x1='0%' y1='65.226044%' x2='100%' y2='50%' id='linearGradient-1'>
          <Stop stopColor='#1471D5' offset='0%' />
          <Stop stopColor='#27E5E8' offset='100%' />
        </LinearGradient>
        <LinearGradient x1='0%' y1='57.0907502%' x2='100%' y2='50%' id='linearGradient-2'>
          <Stop stopColor='#1480D6' offset='0%' />
          <Stop stopColor='#21C5E7' offset='100%' />
        </LinearGradient>
      </Defs>
      <G id='Page-1' stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
        <G id='Artboard-2' transform='translate(-381.000000, -228.000000)'>
          <G id='背景' transform='translate(381.000000, 228.000000)'>
            <Polygon id='Fill-1' fill='#007CD8' points='750 0.0004 750 130.0914 503.41 234.2374 0 81.0004 0 0.0004' />
            <Polygon id='Fill-2' fill='url(#linearGradient-1)' points='750 309.297 750 405 0 405 0 81 503.41 234.238' />
            <Polygon id='Fill-4' fill='url(#linearGradient-2)' points='750 130.091 750 309.297 503.41 234.238' />
          </G>
        </G>
      </G>
    </Svg>
  )
}
