/**
 * 注册
 */

import React from 'react'
import {
  ScrollView,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Alert,
  TextInput
} from 'react-native'
import * as Icons from '../icons'

export class RegisterPage2 extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      telephone: '',
      organizationCode: '',
      userName: '',
      password: '',
      passwordAgain: '',
      rightIcon1: <View />,
      rightIcon2: <View />,
      YHGLColor: '#8a8a8a',
      LockColor1: '#8a8a8a',
      LockColor2: '#8a8a8a'
    }
  }

  componentWillMount() {
    let data = this.props.navigation.getParam('data', {})
    this.setState({
      telephone: data.telephone,
      organizationCode: data.organizationCode
    })
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
    const { height } = Dimensions.get('window')
    if (password.length >= 8) {
      this.setState({
        password,
        rightIcon1: <Icons.RadioButton size={height / 29.824} />
      })
    } else {
      this.setState({
        password,
        rightIcon1: <View />
      })
    }
  }

  /**
   * 获取再次输入的密码
   */
  getPasswordAgain = (passwordAgain) => {
    const { height } = Dimensions.get('window')
    if (passwordAgain.length >= 8) {
      this.setState({
        passwordAgain,
        rightIcon2: <Icons.RadioButton size={height / 29.824} />
      })
    } else {
      this.setState({
        passwordAgain,
        rightIcon2: <View />
      })
    }
  }

  /**
   * 点击完成注册
   */
  register = () => {
    let _this = this
    if (this.state.userName.length === 0 || this.state.password.length < 8 || this.state.passwordAgain.length < 8) {
      Alert.alert('错误', '请填写完整用户名和密码,密码长度不小于8')
    } else {
      if (this.state.password !== this.state.passwordAgain) {
        Alert.alert('错误', '两次输入密码不一致，请重新输入密码')
      } else {
        // Alert.alert('', '注册成功')
        console.log(this.state)
        let userInfo = {}
        userInfo.realName = '测试'
        userInfo.userName = this.state.userName
        userInfo.telephone = this.state.telephone
        userInfo.password = this.state.password
        fetch('http://api.zsmq.console.retailsolution.cn/user/register/' + this.state.organizationCode, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userInfo)
        }).then((response) => response.json()
        ).then((res) => {
          console.log(res)
          if (res.data) {
            if (res.message === 'Register success') {
              Alert.alert('成功', '注册成功')
              _this.props.navigation.navigate('Login')
            } else {
              Alert.alert('错误', res.message)
            }
          } else {
            Alert.alert('错误', res.message)
          }
        }).catch((error) => {
          console.log(error)
          Alert.alert('错误', error)
        })
      }
    }
  }

  /**
   * 当文本框获取焦点时图标变色
   */
  onFocusChangeIconColor = (Icon) => {
    switch (Icon) {
      case 'userName':
        this.setState({
          YHGLColor: '#0575DD'
        })
        break
      case 'password':
        this.setState({
          LockColor1: '#0575DD'
        })
        break
      case 'passwordAgain':
        this.setState({
          LockColor2: '#0575DD'
        })
        break
      default:
        break
    }
  }

  /**
   * 当文本框失焦时图标变色
   */
  onBlurChangeIconColor = (Icon) => {
    switch (Icon) {
      case 'userName':
        this.setState({
          YHGLColor: '#8a8a8a'
        })
        break
      case 'password':
        this.setState({
          LockColor1: '#8a8a8a'
        })
        break
      case 'passwordAgain':
        this.setState({
          LockColor2: '#8a8a8a'
        })
        break
      default:
        break
    }
  }

  render () {
    const { height, width } = Dimensions.get('window')
    return (
      <ScrollView>
        <View style={{ alignItems: 'center' }}>
          <View style={{ height: height / 3.93, width: width, justifyContent: 'center', alignItems: 'center' }}>
            <Icons.IconMy size={height / 10.025} />
          </View>
          <View style={{ height: height / 3.33, width: width, alignItems: 'center' }}>
            <View style={{ width: width / 1.259 }}>
              <Text style={{ color: '#8A8A8A', fontFamily: '黑体', fontSize: 18 }}>用户名</Text>
              <View style={{ flexDirection: 'row', borderBottomColor: '#8A8A8A', borderBottomWidth: 1, marginTop: 5, paddingBottom: 5 }}>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                  <Icons.IconYHGL color={this.state.YHGLColor} size={height / 32.392} />
                </View>
                <View style={{ flex: 6, justifyContent: 'center' }}>
                  <TextInput
                    onChangeText={(text) => this.getUserName(text)}
                    placeholder={'请输入用户名'}
                    style={{ padding: 0, fontSize: 15 }}
                    onFocus={() => this.onFocusChangeIconColor('userName')}
                    onBlur={() => this.onBlurChangeIconColor('userName')}
                  />
                </View>
              </View>
            </View>
            <View style={{ width: width / 1.259, marginTop: 10 }}>
              <Text style={{ color: '#8A8A8A', fontFamily: '黑体', fontSize: 18 }}>密码</Text>
              <View style={{ flexDirection: 'row', borderBottomColor: '#8A8A8A', borderBottomWidth: 1, marginTop: 5, paddingBottom: 5 }}>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                  <Icons.Lock color={this.state.LockColor1} size={height / 32.392} />
                </View>
                <View style={{ flex: 6, justifyContent: 'center' }}>
                  <TextInput
                    onChangeText={(text) => this.getPassword(text)}
                    placeholder={'请输入密码'}
                    password
                    secureTextEntry
                    style={{ padding: 0, fontSize: 15 }}
                    onFocus={() => this.onFocusChangeIconColor('password')}
                    onBlur={() => this.onBlurChangeIconColor('password')}
                  />
                </View>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end' }}>
                  {this.state.rightIcon1}
                </View>
              </View>
            </View>
            <View style={{ width: width / 1.259, marginTop: 10 }}>
              <Text style={{ color: '#8A8A8A', fontFamily: '黑体', fontSize: 18 }}>再次确认密码</Text>
              <View style={{ flexDirection: 'row', borderBottomColor: '#8A8A8A', borderBottomWidth: 1, marginTop: 5, paddingBottom: 5 }}>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                  <Icons.Lock color={this.state.LockColor2} size={height / 32.392} />
                </View>
                <View style={{ flex: 6, justifyContent: 'center' }}>
                  <TextInput
                    onChangeText={(text) => this.getPasswordAgain(text)}
                    placeholder={'请再次确认输入密码'}
                    password
                    secureTextEntry
                    style={{ padding: 0, fontSize: 15 }}
                    onFocus={() => this.onFocusChangeIconColor('passwordAgain')}
                    onBlur={() => this.onBlurChangeIconColor('passwordAgain')}
                  />
                </View>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end' }}>
                  {this.state.rightIcon2}
                </View>
              </View>
            </View>
          </View>
          <View style={{ width: width, justifyContent: 'center', alignItems: 'center', marginTop: height / 13.523 }}>
            <TouchableOpacity onPress={() => this.register()} style={{ width: width / 2.008, height: 50, borderRadius: 50, backgroundColor: '#0475DD', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: 'white', fontFamily: '黑体', fontSize: 22, letterSpacing: 10 }}>完成注册</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    )
  }
}
