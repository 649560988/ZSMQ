/**
 * 向下箭头
 */
import React from 'react'
import Svg, { G, Path } from 'react-native-svg'

export function Fall (props) {
  const { size } = props
  return (
    <Svg
      viewBox='0 0 1024 1024'
      width={size}
      height={size}
      fill={props.color || '#8A8A8A'}
    >
      <G>
        <Path d='M762.76 371.92l-2.68-2.68a48.24 48.24 0 0 0-68 0l-180 180-180-180a48.24 48.24 0 0 0-68 0l-2.68 2.68a48.24 48.24 0 0 0 0 68l214.65 214.84a53.19 53.19 0 0 0 71.9 0L762.76 440a48.24 48.24 0 0 0 0-68.08z' p-id='4309' />
      </G>
    </Svg>
  )
}
