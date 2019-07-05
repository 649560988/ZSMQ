import React from 'react'
import {
  AsyncStorage
} from 'react-native'

export const ThemeContext = React.createContext({
  /**
   * @type {string} 主要颜色
   */
  primaryColor: '#147dd5'
})

export class ThemeProvider extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      toggleIsLight: this.toggleIsLight.bind(this),
      isPending: true,
      isLight: false
    }
    this.init()
  }

  async init () {
    const themeConfig = {}
    try {
      const rawConfig = await AsyncStorage.getItem('theme_config')
      const config = JSON.parse(rawConfig)
      if (!config) {
        throw new Error('Theme config not init.')
      }
      Object.assign(themeConfig, config)
    } catch (e) {
      await AsyncStorage.setItem('theme_config', JSON.stringify({
        isLight: false
      }))
    }
    this.setState({
      ...themeConfig,
      isPending: false
    }, () => {
      // console.log(`isLight is ${this.state.isLight}`)
    })
  }

  toggleIsLight () {
    this.setState({
      isLight: !this.state.isLight
    }, async () => {
      try {
        await AsyncStorage.setItem('theme_config', JSON.stringify({
          isLight: this.state.isLight
        }))
      } catch (e) {
      }
    })
  }

  render () {
    const { isPending } = this.state

    return (
      <ThemeContext.Provider value={{
        ...this.state,
        primaryColor: '#147dd5',
        isDark: !this.state.isLight
      }}>
        {isPending ? null : this.props.children}
      </ThemeContext.Provider>
    )
  }
}
