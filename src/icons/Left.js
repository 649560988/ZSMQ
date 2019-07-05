/**
 * 向左
 */
import React from 'react'
import Svg, { G, Path } from 'react-native-svg'

export function Left (props) {
  const { size } = props
  return (
    <Svg
      viewBox='0 0 1024 1024'
      width={size}
      height={size}
      fill={props.color || '#8A8A8A'}
    >
      <G>
        <Path d='M213.15968 511.825126a85.304188 85.304188 0 0 1 24.738214-60.565973l426.520939-426.520939a85.304188 85.304188 0 0 1 121.131947 121.131947L418.742772 511.825126l366.808008 365.954966a85.304188 85.304188 0 1 1-121.131947 121.131946l-426.520939-426.520938A85.304188 85.304188 0 0 1 213.15968 511.825126z' fill='#383B48' p-id='4208' />
      </G>
    </Svg>
  )
}
