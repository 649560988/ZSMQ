/**
 * 消息
 */
import React from 'react'
import Svg, { Path } from 'react-native-svg'

export function Message (props) {
  const { size = 60, stroke, fill = '#999', fillCircle = '#fff' } = props
  return (
    <Svg
      viewBox='0 0 1304 1024'
      width={size}
      height={size / 254.6875 * 200}
    >
      <Path
        d='M1078.06466969 815.07975268H758.54757525l-76.52300154 98.00314207c-18.79512286 22.82264978-52.35784332 28.19268512-75.1804931 9.39756142-4.02752609-2.68501767-6.71254376-5.37003534-9.39756142-9.39756142L520.92351765 815.07975268H218.85903765c-59.07038708 0-107.40070432-48.33031723-107.40070432-107.40070431V197.52570432c0-59.07038708 48.33031723-107.40070432 107.40070432-107.40070432h859.20563205c59.07038708 0 107.40070432 48.33031723 107.40070431 107.40070432v510.15334405c0 59.07038708-48.33031723 107.40070432-107.40070431 107.40070431z'
        fill={fill}
        stroke={stroke}
        strokeWidth={80}
      />
      <Path
        d='M406.81026958 385.47693625c37.59024655 0 67.12544009 29.53519354 67.1254401 67.1254401s-29.53519354 67.12544009-67.1254401 67.12544009-67.12544009-29.53519354-67.1254401-67.12544009 29.53519354-67.12544009 67.1254401-67.1254401z m241.6515845 0c37.59024655 0 67.12544009 29.53519354 67.12543928 67.1254401s-29.53519354 67.12544009-67.12543928 67.12544009-67.12544009-29.53519354-67.12544009-67.12544009 29.53519354-67.12544009 67.12544009-67.1254401z m241.65158368 0c37.59024655 0 67.12544009 29.53519354 67.1254401 67.1254401s-29.53519354 67.12544009-67.1254401 67.12544009-67.12544009-29.53519354-67.1254401-67.12544009 29.53519354-67.12544009 67.1254401-67.1254401z'
        fill={fillCircle}
      />
    </Svg>
  )
}