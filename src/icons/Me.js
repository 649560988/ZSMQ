/**
 * 我
 */
import React from 'react'
import Svg, { Path } from 'react-native-svg'

export function Me (props) {
  const { stroke, size = 60, fill = 'transparent' } = props
  return (
    <Svg viewBox='0 0 1024 1024' width={size} height={size}>
      <Path
        stroke={stroke}
        strokeWidth={80}
        fill={fill}
        d='M614.401228 672.16584c-3.022847-32.95046-1.868557-55.95643-1.868557-86.067214 15.167444-7.855922 42.312688-57.784054 46.8971-99.963713 11.920494-0.954745 30.692023-12.410658 36.205597-57.625442 2.960425-24.276916-8.818853-37.937031-15.993253-42.237987 19.381419-57.4392 59.664891-235.137345-74.487481-253.513878-13.805424-23.873734-49.163723-35.961026-95.101985-35.961026-183.801143 3.325745-205.977211 136.721895-165.694763 289.474904-7.158027 4.301979-18.957771 17.962094-15.997346 42.237987 5.513574 45.215808 24.289196 56.670697 36.205597 57.625442 4.567016 42.180681 32.80515 92.108814 47.988967 99.963713 0 30.110785 1.137916 53.116755-1.88493 86.067214-36.367279 96.335069-281.780665 69.272713-293.111734 255.037581l788.883121 0C895.126864 741.438553 650.768507 768.500908 614.401228 672.16584z'
      />
    </Svg>
  )
}