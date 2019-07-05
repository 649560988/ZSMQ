/**
 * 上市企业
 */
import React from 'react'
import Svg, { G, Path } from 'react-native-svg'

export function MoreCompany (props) {
  const { size = 60, fill = '#333' } = props
  return (
    <Svg
      viewBox='0 0 1024 1024'
      width={size}
      height={size}
    >
      <G fill={fill}>
        <Path d='M166.6 99.6h228.6c37.9 0 68.6 30.7 68.6 68.6v228.6c0 37.9-30.7 68.6-68.6 68.6H166.6c-38 0-68.6-30.8-68.6-68.6V168.2c0-38 30.7-68.6 68.6-68.6z m457.3 0h228.6c38 0 68.6 30.7 68.6 68.6v228.6c0 37.9-30.7 68.6-68.6 68.6H623.9c-37.9 0-68.6-30.7-68.6-68.6V168.2c0-38 30.7-68.6 68.6-68.6zM166.6 556.8h228.6c37.9 0 68.6 30.7 68.6 68.6V854c0 37.9-30.7 68.6-68.6 68.6H166.6c-38 0-68.6-30.7-68.6-68.6V625.5c0-37.9 30.7-68.7 68.6-68.7z m685.9 45.8c12.7 0 22.8 10.3 22.8 22.8V854c0 12.7-10.3 22.8-22.8 22.8H623.9c-12.7 0-22.8-10.3-22.8-22.8V625.5c0-12.7 10.3-22.8 22.8-22.8h228.6z m0-45.8H623.9c-37.9 0-68.6 30.7-68.6 68.6V854c0 37.9 30.7 68.6 68.6 68.6h228.6c37.9 0 68.6-30.7 68.6-68.6V625.5c0.1-37.9-30.6-68.7-68.6-68.7z' />
      </G>
    </Svg>
  )
}
