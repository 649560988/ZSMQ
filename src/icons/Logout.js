import React from 'react'
import Svg, { Path } from 'react-native-svg'
/**
 * Added By Xqm
 * @param {*} props
 */
export function Logout (props) {
  return (
    <Svg fill={props.color || '#147dd5'} width={props.size} height={props.size} viewBox={'0 0  880 880'}>
      <Path d={'M657.28 220.48a32 32 0 0 1 29.44-56.96A388.16 388.16 0 0 1 512 896a388.16 388.16 0 0 1-174.72-732.48 32 32 0 1 1 29.44 56.96 322.56 322.56 0 1 0 465.28 288 323.52 323.52 0 0 0-174.72-288z'} p-id={'2262'} /><Path d={'M480 96a32 32 0 0 1 64 0v320a32 32 0 0 1-64 0z'} p-id={'2263'} />
    </Svg>
  )
}
