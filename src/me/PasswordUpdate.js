import React from 'react'
import { View, Text, TextInput, Dimensions, Alert, AsyncStorage } from 'react-native'
import * as Icons from '../icons'
import request from '../request'
export class PasswordUpdate extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      oldPassword: '',
      newPassword: '',
      newPasswordAgain: '',
      rightIcon1: <Text />,
      rightIcon2: <Text />,
      rightIcon3: <Text />,
      currentUser: {}
    }
  }

    componentDidMount = async () => {
      let _this = this
      this.props.navigation.setParams({ confirmPassword: this.confirmPassword })
      await AsyncStorage.getItem('currentUser', function (error, result) {
        if (error) {
          Alert.alert('错误', '获取当前登录人信息失败')
        } else {
          let currentUser = JSON.parse(result)
          console.log(currentUser)
          _this.setState({ currentUser })
        }
      })
    }

    static navigationOptions = ({ navigation, navigationOptions }) => {
      const { state } = navigation
      let header = navigationOptions
      header.headerRight = <Text onPress={() => state.params.confirmPassword()} style={{ color: 'white', fontSize: 23, marginRight: 20 }}>完成</Text>
      return header
    }

    confirmPassword = () => {
      // console.log('原始密码:', this.state.oldPassword)
      // console.log('新密码:', this.state.newPassword)
      // console.log('重复新密码:', this.state.newPasswordAgain)
      const { oldPassword, newPassword, newPasswordAgain } = this.state
      let message = ''
      if (oldPassword.length === 0 || newPassword.length < 8 || newPasswordAgain.length < 8) {
        message = '请完整输入原始密码以及新密码，新密码长度不得小于8'
      } else {
        if (oldPassword === newPassword) {
          message = '原始密码与新密码相同，请重新输入!!'
        } else if (newPassword !== newPasswordAgain) {
          message = '两次输入的新密码不相同，请重新输入!!'
        } else {
          message = ''
        }
      }

      if (message !== '') {
        Alert.alert('错误', message)
      } else {
        this.savePassword()
      }
    }

    savePassword = async () => {
      let data = {}
      let _this = this
      data.id = this.state.currentUser.id
      data.oldPwd = this.state.oldPassword
      data.newPwd1 = this.state.newPassword
      data.newPwd2 = this.state.newPasswordAgain
      request('/v1/sysUserDomin/updatePwd', {
        method: 'POST',
        // credentials: 'omit',
        body: data
      }).then((res) => {
        console.log(res)
        if (res) {
          if (res.message === '成功') {
            _this.props.navigation.navigate('Login')
          } else {
            Alert.alert('错误', res.message)
          }
        }
      }).catch((error) => {
        console.log(error)
      })
    }

    /**
     * 原始密码文本框内容变化
     */
    oldPasswordChange = (text) => {
      const { height } = Dimensions.get('window')
      if (text.length > 0) {
        this.setState({
          rightIcon1: <Icons.RadioButton size={height / 29.824} />,
          oldPassword: text
        })
      } else {
        this.setState({
          rightIcon1: <Text />,
          oldPassword: text
        })
      }
    }

    /**
     * 新密码文本框内容变化
     */
    newPasswordChange = (text) => {
      const { height } = Dimensions.get('window')
      if (text.length > 7) {
        this.setState({
          rightIcon2: <Icons.RadioButton size={height / 29.824} />,
          newPassword: text
        })
      } else {
        this.setState({
          rightIcon2: <Text />,
          newPassword: text
        })
      }
    }

    /**
     * 重复新密码文本框内容变化
     */
    newPasswordAgainChange = (text) => {
      const { height } = Dimensions.get('window')
      if (text.length > 7) {
        this.setState({
          rightIcon3: <Icons.RadioButton size={height / 29.824} />,
          newPasswordAgain: text
        })
      } else {
        this.setState({
          rightIcon3: <Text />,
          newPasswordAgain: text
        })
      }
    }

    render () {
      const { height, width } = Dimensions.get('window')
      return (
        <View style={{ flexDirection: 'column', alignItems: 'center' }}>
          <View style={{ flexDirection: 'column', alignItems: 'flex-start', marginTop: height / 8.54 }}>
            <Text style={{ color: '#8A8A8A', fontSize: 20, fontFamily: '黑体' }}>原密码</Text>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', width: width / 1.33, borderBottomColor: '#8A8A8A', borderBottomWidth: 1, paddingBottom: 5 }}>
              <Icons.Lock size={height / 23.824} />
              <TextInput onChangeText={(text) => this.oldPasswordChange(text)} style={{ width: width / 1.7, fontSize: 20, color: '#8A8A8A', padding: 0, marginLeft: 15 }} password secureTextEntry />
              {this.state.rightIcon1}
            </View>
          </View>
          <View style={{ flexDirection: 'column', alignItems: 'flex-start', marginTop: 10 }}>
            <Text style={{ color: '#8A8A8A', fontSize: 20, fontFamily: '黑体' }}>新密码</Text>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', width: width / 1.33, borderBottomColor: '#8A8A8A', borderBottomWidth: 1, paddingBottom: 5 }}>
              <Icons.Lock size={height / 23.824} />
              <TextInput onChangeText={(text) => this.newPasswordChange(text)} style={{ width: width / 1.7, fontSize: 20, color: '#8A8A8A', padding: 0, marginLeft: 15 }} password secureTextEntry />
              {this.state.rightIcon2}
            </View>
          </View>
          <View style={{ flexDirection: 'column', alignItems: 'flex-start', marginTop: 10 }}>
            <Text style={{ color: '#8A8A8A', fontSize: 20, fontFamily: '黑体' }}>再次确认密码</Text>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', width: width / 1.33, borderBottomColor: '#8A8A8A', borderBottomWidth: 1, paddingBottom: 5 }}>
              <Icons.Lock size={height / 23.824} />
              <TextInput onChangeText={(text) => this.newPasswordAgainChange(text)} style={{ width: width / 1.7, fontSize: 20, color: '#8A8A8A', padding: 0, marginLeft: 15 }} password secureTextEntry />
              {this.state.rightIcon3}
            </View>
          </View>
        </View>
      )
    }
}
