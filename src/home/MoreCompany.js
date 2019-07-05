/**
 * 财税信息列表
 */

import React from 'react'
import { Text, View } from 'react-native'

export class MoreCompany extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: '更多企业',
      headerTintColor: '#FFF',
      headerStyle: {
        /**
         * ⚠️
         * 这个颜色照理说应该使用ThemeContext里的颜色
         * 但是ReactNavigation只支持借助setParams的形式给这个函数传参
         * 而当前最新版本的ReactNative还不支持Hooks API，所以导致比较context不是很‘优雅’
         * 所以暂时这个地方硬编下
         */
        backgroundColor: '#147dd5',
        elevation: 0
      },
      headerBackTitleStyle: {
        color: '#FFF'
      }
    }
  }

  render () {
    return (
      <View>
        <Text>此功能正在开发中...</Text>
      </View>
    )
  }
}
