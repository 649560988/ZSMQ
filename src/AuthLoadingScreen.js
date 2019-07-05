import React from 'react'
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  View,
  Alert
} from 'react-native'

export class AuthLoadingScreen extends React.Component {
  constructor (props) {
    super(props)
    this._bootstrapAsync()
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    // AsyncStorage.clear()
    let _this = this
    let userToken = await AsyncStorage.getItem('userToken')
    let currentUser = await AsyncStorage.getItem('currentUser', function (error, result) {
      if (error) {
        return null
      } else {
        return JSON.parse(result)
      }
    })
    currentUser = JSON.parse(currentUser)
    console.log(currentUser)
    console.log(userToken)
    if (userToken) {
      await fetch('http://api.zsmq.console.retailsolution.cn/oauth/token?client_id=client&client_secret=secret&grant_type=password&password=' + currentUser.loginPassword + '&type=111&username=' + currentUser.userName, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then((response) => response.json()
      ).then((res) => {
        // console.log(res)
        if (res.error) {
          Alert.alert('错误', '刷新token失败')
        } else {
          let newUserToken = {}
          let accessToken = res.data.access_token
          let expiresIn = res.data.expires_in
          let refreshToken = res.data.refresh_token
          let scope = res.data.scope
          let tokenType = res.data.token_type
          if (expiresIn === 0) {
            _this.refreshToken(refreshToken)
          } else {
            newUserToken.accessToken = accessToken
            newUserToken.expiresIn = expiresIn
            newUserToken.refreshToken = refreshToken
            newUserToken.scope = scope
            newUserToken.tokenType = tokenType
            AsyncStorage.setItem('userToken', JSON.stringify(newUserToken), function (error) {
              if (error) {
                Alert.alert('登录失败', 'userToken储存失败')
              } else {
                _this.props.navigation.navigate('App')
              }
            })
          }
        }
      }
      ).catch((err) => {
        console.log(err)
      })
      AsyncStorage.getItem('userToken', function (error, result) {
        if (error) {
          console.log(error)
        } else {
          let userToken = JSON.parse(result)
          if (userToken.expiresIn === 0) {
            _this.props.navigation.navigate('SignIn')
          } else {
            _this.props.navigation.navigate('App')
          }
        }
      })
    } else {
      _this.props.navigation.navigate('SignIn')
    }

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    // this.props.navigation.navigate(userToken ? 'App' : 'SignIn');
  }

  /**
 * 刷新token
 */
  refreshToken = async (refreshToken) => {
    console.log('刷新token')
    let _this = this
    await fetch(`http://api.zsmq.console.retailsolution.cn/oauth/token?grant_type=refresh_token&refresh_token=${refreshToken}&client_id=client&client_secret=secret&type=222`, {
      method: 'POST',
      credentials: 'omit'
    }).then((response) => response.json()).then((json) => {
      // console.log(json)
      let newUserToken = {}
      newUserToken.accessToken = json.data.access_token
      newUserToken.expiresIn = json.data.expires_in
      newUserToken.refreshToken = json.data.refresh_token
      newUserToken.scope = json.data.scope
      newUserToken.tokenType = json.data.token_type
      AsyncStorage.setItem('userToken', JSON.stringify(newUserToken), function (error) {
        if (error) {
          Alert.alert('错误', 'userToken储存失败')
        } else {
          _this.props.navigation.navigate('App')
        }
      })
    }).catch((error) => {
      console.log(error)
      Alert.alert('错误', '刷新token失败')
    })
  }

  // Render any loading content that you like here
  render () {
    return (
      <View>
        <ActivityIndicator />
        <StatusBar barStyle={'default'} />
      </View>
    )
  }
}
