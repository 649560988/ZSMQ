/**
 * 下拉
 */
import React from 'react'
import Svg, { G, Path } from 'react-native-svg'

export function DropDown (props) {
  const { size } = props
  return (
    <Svg
      viewBox='0 0 1024 1024'
      width={size}
      height={size}
      fill={props.color || '#ffffff'}
    >
      <G>
        <Path d='M267.264 434.176q9.216-10.24 23.04-10.24t23.04 10.24q10.24 9.216 10.24 22.528t-10.24 23.552l-128 126.976q-8.192 10.24-23.552 9.216t-25.6-10.24l-126.976-125.952q-9.216-10.24-9.216-23.552t9.216-22.528q10.24-10.24 23.552-10.24t23.552 10.24l105.472 103.424z' p-id='1708' />
      </G>
    </Svg>
  )
}
