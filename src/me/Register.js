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
// import { Link } from '../components'
import * as Icons from '../icons'

export class Register extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      telephone: '',
      organizationCode: ''
    }
  }

  /**
   * 获取手机号码
   */
  getTelephoneNumber = (telephone) => {
    this.setState({ telephone })
  }

  /**
   * 获取企业组织代码
   */
  getOrganizationCode = (organizationCode) => {
    this.setState({ organizationCode })
  }

  /**
   * 点击下一步按钮
   */
  handleOnNextStep = () => {
    if (this.state.telephone.length === 0 || this.state.organizationCode.length === 0) {
      Alert.alert('错误', '请填写完整组织代码和手机号')
    } else {
      if (!(/^(?=\d{11}$)^1(?:3\d|4[57]|5[^4\D]|66|7[^249\D]|8\d|9[89])\d{8}$/.test(this.state.telephone))) {
        Alert.alert('错误', '手机号码格式错误')
      } else {
        let data = {}
        data.telephone = this.state.telephone
        data.organizationCode = this.state.organizationCode
        this.props.navigation.navigate('RegisterPage2', { 'data': data })
      }
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
          <View style={{ width: width, height: height / 3.33, alignItems: 'center' }}>
            <View style={{ width: width / 1.259 }}>
              <Text style={{ color: '#8A8A8A', fontFamily: '黑体', fontSize: 18 }}>输入手机号</Text>
              <View style={{ flexDirection: 'row', borderBottomColor: '#8A8A8A', borderBottomWidth: 1, marginTop: 5, paddingBottom: 5 }}>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                  <Icons.IconPhone size={height / 32.392} />
                </View>
                <View style={{ flex: 6, justifyContent: 'center' }}>
                  <TextInput onChangeText={(text) => this.getTelephoneNumber(text)} placeholder={'请输入手机号'} style={{ padding: 0, fontSize: 15 }} />
                </View>
              </View>
            </View>
            <View style={{ width: width / 1.259, marginTop: 10 }}>
              <Text style={{ color: '#8A8A8A', fontFamily: '黑体', fontSize: 18 }}>企业组织代码</Text>
              <View style={{ flexDirection: 'row', borderBottomColor: '#8A8A8A', borderBottomWidth: 1, marginTop: 5, paddingBottom: 5 }}>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                  <Icons.IconOrganization size={height / 32.392} />
                </View>
                <View style={{ flex: 6, justifyContent: 'center' }}>
                  <TextInput onChangeText={(text) => this.getOrganizationCode(text)} placeholder={'请输入企业组织代码'} password secureTextEntry style={{ padding: 0, fontSize: 15 }} />
                </View>
              </View>
            </View>
          </View>
          <View style={{ width: width, justifyContent: 'center', alignItems: 'center', marginTop: height / 13.523 }}>
            <TouchableOpacity onPress={() => this.handleOnNextStep()} style={{ width: width / 2.008, height: 50, borderRadius: 50, backgroundColor: '#0475DD', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: 'white', fontFamily: '黑体', fontSize: 22, letterSpacing: 10 }}>下一步</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    )
  }
}
