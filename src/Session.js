import React from 'react'
import PropTypes from 'prop-types'
import {
  AsyncStorage,
  Alert
} from 'react-native'

export const SessionContext = React.createContext({})

export class SessionProvider extends React.Component {
  static propTypes = {
    children: PropTypes.element.isRequired
  }

  state = {
    currentUser: null,
    toggle: (currentUser) => this.toggle(currentUser)
  }

  componentWillMount () {
    let _this = this
    let currentUser = null
    AsyncStorage.getItem('currentUser', function (error, result) {
      if (error) {
        currentUser = null
        _this.setState({ currentUser })
        Alert.alert('错误', '获取当前登录人信息失败')
      } else {
        currentUser = JSON.parse(result)
        console.log(currentUser)
        _this.setState({ currentUser })
      }
    })
  }

  toggle = (currentUser) => {
    console.log('session接收到了:', currentUser)
    this.setState({ currentUser })
  }

  render () {
    const props = this.props
    const state = this.state
    return (
      <SessionContext.Provider value={{
        ...state
      }}>
        {props.children}
      </SessionContext.Provider>
    )
  }
}
