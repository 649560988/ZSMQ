import React from 'react'
import Svg, { Path } from 'react-native-svg'
/**
 * Xqm Added
 * @param {*} props
 */
export function BusinessInfo (props) {
  return (
    <Svg id={'BusinessInfo'} width={props.size} height={props.size} viewBox={'0 0 1024 1024'} fill={props.color || '#147dd5'}>
      <Path d={'M512 115.2l384 179.2v76.8H128v-76.8zM128 908.8v-89.6h768v89.6z m563.2-467.2h96v320h-96z m-243.2 0h96v320h-96z m-243.2 0h96v320h-96z'} fill={'#147dd5'} p-id={'1606'} />
    </Svg>
  )
}
