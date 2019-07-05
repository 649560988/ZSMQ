/**
 * 登录
 */

import React from 'react'
import {
  ScrollView,
  View,
  Text,
  Dimensions,
  TextInput,
  TouchableOpacity,
  AsyncStorage,
  Alert
} from 'react-native'
import * as Icons from '../icons'
import { Link } from '../components'
// import request from '../request'
import { SessionContext } from '../Session'

export class Login extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      userName: '',
      password: '',
      YHGLColor: '#8a8a8a',
      LockColor: '#8a8a8a'
    }
  }

  /**
   * 获取用户名
   */
  getUserName = (userName) => {
    this.setState({ userName })
  }

  /**
   * 获取密码
   */
  getPassword = (password) => {
    this.setState({ password })
  }

  /**
   * 点击登录按钮，触发登录事件
   */
  handleOnLogin = (context) => {
    let _this = this
    // console.log('用户名:', this.state.userName)
    // console.log('密码:', this.state.password)
    if (this.state.userName.length === 0 || this.state.password.length === 0) {
      Alert.alert('错误', '请填写完整用户名和密码')
      return null
    }
    fetch('http://api.zsmq.console.retailsolution.cn/oauth/token?client_id=client&client_secret=secret&grant_type=password&password=' + this.state.password + '&type=111&username=' + this.state.userName, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then((response) => response.json()
    ).then((res) => {
      // console.log(res)
      if (res.error) {
        Alert.alert('错误', '登录失败，请检查用户名和密码')
      } else {
        AsyncStorage.setItem('able','true')
        let userToken = {}
        let accessToken = res.data.access_token
        let expiresIn = res.data.expires_in
        let refreshToken = res.data.refresh_token
        let scope = res.data.scope
        let tokenType = res.data.token_type
        if (expiresIn === 0) {
          _this.refreshToken(refreshToken, context)
        } else {
          userToken.accessToken = accessToken
          userToken.expiresIn = expiresIn
          userToken.refreshToken = refreshToken
          userToken.scope = scope
          userToken.tokenType = tokenType
          AsyncStorage.setItem('userToken', JSON.stringify(userToken), function (error) {
            if (error) {
              Alert.alert('登录失败', 'userToken储存失败')
            } else {
              _this.getAuth(tokenType, accessToken, context)
            }
          })
        }
      }
    }
    ).catch((err) => {
      console.log(err)
    })
  }

  /**
   * 获取当前登录人信息
   */
  getAuth = (tokenType, accessToken, context) => {
    let _this = this
    // request('/v1/sysUserDomin/getAuth', {
    //   method: 'GET'
    // }).then((response) => {
    //   console.log(response)
    // })
    fetch('http://api.zsmq.console.retailsolution.cn/v1/sysUserDomin/getAuth', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': tokenType + accessToken
      }
    }).then((response) =>
      response.json()
    ).then((res) => {
      // console.log(res)
      if (res.message === '成功') {
        let data = JSON.parse(JSON.stringify(res.data))
        data.loginPassword = _this.state.password
        AsyncStorage.setItem('currentUser', JSON.stringify(data), function (error) {
          if (error) {
            Alert.alert('错误', '储存当前登录人信息失败')
          } else {
            context.toggle(data)
            _this.props.navigation.navigate('App')
          }
        })
      } else {
        Alert.alert('错误', '获取当前登录人信息失败')
      }
    })
  }

  /**
   * 刷新token
   */
  refreshToken = async (refreshToken, context) => {
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
          _this.getAuth(newUserToken.tokenType, newUserToken.accessToken, context)
          // _this.handleOnLogin()
        }
      })
    }).catch((error) => {
      console.log(error)
      Alert.alert('错误', '刷新token失败')
    })
  }

  /**
   * 清空用户名输入文本框
   */
  clearUserName = () => {
    // console.log('清空用户名')
    this.setState({
      userName: ''
    })
  }

  /**
   * 清空密码文本框
   */
  clearPassword = () => {
    // console.log('清空密码')
    this.setState({
      password: ''
    })
  }

  /**
   * 当文本框获取焦点时，改变文本框前图标的颜色
   */
  onFoucsChangeIconColor = (Icon) => {
    if (Icon === 'userName') {
      this.setState({
        YHGLColor: '#0575DD'
      })
    } else if (Icon === 'password') {
      this.setState({
        LockColor: '#0575DD'
      })
    }
  }

  /**
   * 当文本框失焦时，改变文本框前图标的颜色
   */
  onBlurChangeIconColor = (Icon) => {
    if (Icon === 'userName') {
      this.setState({
        YHGLColor: '#8a8a8a'
      })
    } else if (Icon === 'password') {
      this.setState({
        LockColor: '#8a8a8a'
      })
    }
  }

  render () {
    const { height, width } = Dimensions.get('window')
    return (
      <SessionContext.Consumer>
        {(context) =>
          <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps={'always'}>
            <View style={{ width: width, height: width / 750 * 405 }}>
              <View style={{ position: 'absolute', top: 60, left: (width - width / 2.312) / 2 }}>
                <Icons.CompanyLogo size={width / 2.612} />
              </View>
            </View>
            <View style={{ width: width, alignItems: 'center', paddingLeft: width / 5.571, paddingRight: width / 5.571 }}>
              <View style={{ flexDirection: 'row', borderBottomColor: '#8A8A8A', borderBottomWidth: 1, paddingBottom: 5 }}>
                <View style={{ justifyContent: 'center', alignItems: 'center', flex: 2 }}>
                  <Icons.IconYHGL color={this.state.YHGLColor} size={width / 18} />
                </View>
                <View style={{ justifyContent: 'center', flex: 7 }}>
                  <TextInput
                    onChangeText={(text) => this.getUserName(text)}
                    onFocus={() => this.onFoucsChangeIconColor('userName')}
                    onBlur={() => this.onBlurChangeIconColor('userName')}
                    style={{ fontSize: 15, color: '#8A8A8A', padding: 0 }}
                    placeholder={'请输入用户名'}
                    clearButtonMode={'always'}
                    value={this.state.userName}
                  />
                </View>
                <View style={{ justifyContent: 'center', flex: 1 }}>
                  <TouchableOpacity onPress={this.clearUserName}>
                    <Icons.CloseSearch size={25} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{ marginTop: 15, flexDirection: 'row', borderBottomColor: '#8A8A8A', borderBottomWidth: 1, paddingBottom: 5 }}>
                <View style={{ justifyContent: 'center', alignItems: 'center', flex: 2, padding: 0 }}>
                  <Icons.Lock color={this.state.LockColor} size={width / 17} />
                </View>
                <View style={{ justifyContent: 'center', flex: 7 }}>
                  <TextInput
                    onChangeText={(text) => this.getPassword(text)}
                    onFocus={() => this.onFoucsChangeIconColor('password')}
                    onBlur={() => this.onBlurChangeIconColor('password')}
                    password
                    secureTextEntry
                    style={{ fontSize: 15, color: '#8A8A8A', padding: 0 }}
                    placeholder={'请输入密码'}
                    clearButtonMode={'always'}
                    value={this.state.password}
                  />
                </View>
                <View style={{ justifyContent: 'center', flex: 1 }}>
                  <TouchableOpacity onPress={() => this.clearPassword()}>
                    <Icons.CloseSearch size={25} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={{ width: width, alignItems: 'center', marginTop: 5 }}>
              <View style={{ width: width - 2 * (width / 5.571), alignItems: 'flex-end' }}>
                <Link to={'Register'}>
                  <Text style={{ fontSize: 16, color: '#0376DC', fontFamily: '黑体' }}>新用户注册</Text>
                </Link>
              </View>
            </View>
            <View style={{ width: width, justifyContent: 'center', alignItems: 'center', marginTop: height / 13.523 }}>
              <TouchableOpacity onPress={() => this.handleOnLogin(context)} style={{ width: width / 2.008, height: 50, borderRadius: 50, backgroundColor: '#0475DD', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: 'white', fontFamily: '黑体', fontSize: 22, letterSpacing: 10 }}>登录</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        }
      </SessionContext.Consumer>
    )
  }
}
