/**
 * 社保信息
 */
import React from 'react'
import Svg, { G, Path } from 'react-native-svg'

export function SocialSecurity (props) {
  const { size } = props
  return (
    <Svg
      viewBox='0 0 1024 1024'
      width={size}
      height={size}
      fill={props.color || '#147dd5'}
    >
      <G>
        <Path d='M904.410982 182.857016a31.450999 31.450999 0 0 0-48.273999 40.229A450.193991 450.193991 0 1 1 511.99999 60.343019a29.256999 29.256999 0 0 0 29.256999-29.623A29.256999 29.256999 0 0 0 511.99999 0.00002a511.99999 511.99999 0 1 0 511.99999 511.99999 506.51399 506.51399 0 0 0-119.588998-329.142994z' p-id='3211' />
        <Path d='M694.856986 91.429018a54.856999 54.856999 0 1 0 27.429-47.542999 54.856999 54.856999 0 0 0-27.429 47.542999z' p-id='3212' />
        <Path d='M420.936992 460.434011H557.349989v248.319995H402.285992V768.000005H767.999985v-59.245999H616.593988v-248.319995h136.776997V401.190012H616.593988v-181.759996H557.349989v181.759996H420.936992v59.244999z' p-id='3213' />
        <Path d='M373.759993 804.571004v-255.999995a415.450992 415.450992 0 0 1 60.342999 57.051999l7.679999 7.68 33.646-51.931999-3.658-3.657a541.256989 541.256989 0 0 0-93.987998-68.387999 497.73699 497.73699 0 0 0 73.142998-129.096997V310.490014h-65.828999c-7.68-22.674-18.651-49.370999-34.010999-83.747998l-3.657-7.314-54.857999 15.359999 3.658 7.68a606.719988 606.719988 0 0 1 29.988 68.387999h-91.793999v57.051999h150.673997a567.953989 567.953989 0 0 1-162.010996 193.827996l-3.657 3.657 18.650999 64.731999 7.68-8.412c22.674-19.017 45.348999-41.690999 67.656999-64.730999V804.570004z' p-id='3214' />
      </G>
    </Svg>
  )
}