
import React from 'react'
import { View, Text, Dimensions, TouchableOpacity, Alert, AsyncStorage} from 'react-native'
import * as Icons from '../icons'
import { Link } from '../components'
import { SessionContext } from '../Session'
import request from '../request'
export class MeScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      tabBarIcon: (props) => (
        <Icons.Me
          size={24}
          stroke={props.focused ? props.tintColor : '#999'}
          fill={props.focused ? props.tintColor : 'transparent'}
        />
      ),
      tabBarOnPress:(obj)=>{
          AsyncStorage.getItem('userToken').then((__values)=>{
           const jsonValue = JSON.parse(__values);
           if(jsonValue==null){
            navigation.navigate('Login')
           }else{
            navigation.navigate('Me')
           }
         })
      }
    }
  }
  /**
   * 确认是否退出登录
   */
  confirmLogout = () => {
    let _this = this
    Alert.alert(
      '确认',
      '是否确认退出登录?',
      [
        { text: '否', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
        { text: '是', onPress: () => _this.logout() }
      ],
      { cancelable: false }
    )
  }

  /**
   * 退出登录
   */
  logout = () => {
    let _this = this
    AsyncStorage.clear(function (error) {
      if (error) {
        Alert.alert('', '退出失败')
      } else {
        Alert.alert('', '退出成功')
        _this.props.navigation.navigate('AuthLoading')
      }
    })
  }
 //

  /**
   * 测试跳转企业详情
   */
  // jump = () => {
  //   this.props.navigation.navigate('CompanyDetails', { organizationalCode: '74027295X', entShortName: '上海汉得' })
  // }

  render () {
    return (
      <SessionContext.Consumer>
        {context => <Content context={context} jump={() => this.jump()} myHandPress={() => this.myHandPress()} confirmLogout={() => this.confirmLogout()} />}
      </SessionContext.Consumer>
    )
  }
}

class Content extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      currentUser: {},
      isEnt:false,
      organizeCode:''
    }
  }

  componentWillMount (props) {
   this.getAbleLogin()
  }


  /*
  是否登录
  */
  getAbleLogin=()=>{
     AsyncStorage.getItem('userToken').then((__values)=>{
      const jsonValue = JSON.parse(__values);
      if(jsonValue==null){
      }else{
        this.getCurrentUserInfo()
        this.getCurrentOrganizeCode()
      }
    })
  }
  /**
   * 获取当前登录人信息
   */
  getCurrentUserInfo = async () => {
    let _this = this
    await AsyncStorage.getItem('currentUser', function (error, result) {
      if (error) {
        Alert.alert('错误', '获取当前登录人信息失败')
      } else {
          let currentUser = JSON.parse(result)
          _this.setState({ currentUser })
      }
    })
    await AsyncStorage.getItem('userToken', function (error, result) {
      if (error) {
        Alert.alert('错误', '获取当前登录人信息失败')
      } else {
        console.log('result',result)
      }
    })
  }
  /**
   * 获取组织结构代码
   */
  getCurrentOrganizeCode=()=>{
    let url='/v1/enterprises/base/userEnt'
    request(url,{
      method:'GET'
    }).then((res)=>{
      if(res.message==='查询成功'){
        this.setState({
          isEnt:true,
          organizeCode:res.data.organizationalCode
        })
      }
    })
  }
  renderNotLogin = () => {
    const { height, width } = Dimensions.get('window')
    // console.log('没登录')
    return (
      <View style={{ width: width, height: height / 8.95, flexDirection: 'row', marginTop: height / 40.875, backgroundColor: 'white' }}>
        <View style={{ flex: 1, height: height / 8.95, justifyContent: 'center', alignItems: 'center' }}>
          <Icons.IconMy windowSize={{ height: height, width: width }} size={width / 10}></Icons.IconMy>
        </View>
        <View style={{ flex: 3, height: height / 8.95, justifyContent: 'center' }}>
          <Text style={{ fontSize: 20, fontFamily: '黑体', color: '#4E4E4E' }}>未登录</Text>
        </View>
      </View>
    )
  }

  renderLogin = () => {
    const { height, width } = Dimensions.get('window')
    // console.log('登录')
    return (
      <View style={{ width: width, height: height / 8.95, marginTop: height / 40.875, flexDirection: 'row', backgroundColor: 'white' }}>
        <View style={{ flex: 1, height: height / 8.95, alignItems: 'center', justifyContent: 'center' }}>
          <Icons.IconMy windowSize={{ height: height, width: width }} size={width / 10}></Icons.IconMy>
        </View>
        <View style={{ flex: 3, height: height / 8.95, justifyContent: 'center' }} >
          <Text style={{ fontSize: 20, fontFamily: '黑体', color: '#4E4E4E' }}>{this.state.currentUser.userName}</Text>
          {/* <Text style={{ fontSize: 18, fontFamily: '黑体', color: '#767676' }}>简介</Text> */}
        </View>
      </View>
    )
  }
  render () {
    const { height, width } = Dimensions.get('window')
    let decision = true
    let login = decision=== false? this.renderNotLogin() : this.renderLogin()
    return (
      // <ScrollView>
      // this.state.isLogin?
        <View style={{ flex: 1, flexDirection: 'column', alignItems: 'flex-start', backgroundColor: '#F4F4F4' }}>
        <View style={{ width: width, height: 60, backgroundColor: '#147dd5', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Text style={{ color: 'white', textAlign: 'center', fontSize: 23 }}>个人中心</Text>
      </View>
        {login}
      <Link to={'PasswordUpdate'}>
        <View id={'password'} style={{ width: width, height: height / 17.817, flexDirection: 'row', marginTop: height / 40.875, backgroundColor: 'white' }}>
          <View style={{ flex: 1, height: height / 17.817, alignItems: 'center', justifyContent: 'center' }}>
            <Icons.IconShezhi1 windowSize={{ height: height, width: width }} size={width / 21.088}></Icons.IconShezhi1>
          </View>
          <View style={{ flex: 3, height: height / 17.817, justifyContent: 'center' }}>
            <Text style={{ fontSize: 20, fontFamily: '黑体', color: '#4E4E4E' }}>修改密码</Text>
          </View>
        </View>
      </Link>
      <Link to={'CompanyVersion'}>
        <View id={'password'} style={{ width: width, height: height / 17.817, flexDirection: 'row', marginTop: height / 40.875, backgroundColor: 'white' }}>
          <View style={{ flex: 1, height: height / 17.817, alignItems: 'center', justifyContent: 'center' }}>
            <Icons.IconGuanli windowSize={{ height: height, width: width }} size={width / 21.088}></Icons.IconGuanli>
          </View>
          <View style={{ flex: 3, height: height / 17.817, justifyContent: 'center' }} >
            <Text style={{ fontSize: 20, fontFamily: '黑体', color: '#4E4E4E' }}>企业版本号</Text>
          </View>
        </View>
      </Link>
      {
        this.state.isEnt?
       <Link to={{routeName:'CompanyDescription',params:{id:this.state.organizeCode,linkType:1}}}>
        <View id={'password'} style={{ width: width, height: height / 17.817, flexDirection: 'row', marginTop: height / 40.875, backgroundColor: 'white' }}>
          <View style={{ flex: 1, height: height / 17.817, alignItems: 'center', justifyContent: 'center' }}>
            <Icons.IconGuanli windowSize={{ height: height, width: width }} size={width / 21.088}></Icons.IconGuanli>
          </View>
          <View style={{ flex: 3, height: height / 17.817, justifyContent: 'center' }} >
            <Text style={{ fontSize: 20, fontFamily: '黑体', color: '#4E4E4E' }}>企业介绍</Text>
          </View>
        </View>
      </Link>
      :
      null
      }
      
      <View id={'signOut'} style={{ width: width, height: height / 17.817, flexDirection: 'row', marginTop: height / 40.875, backgroundColor: 'white' }}>
        <View style={{ flex: 1, height: height / 17.817, alignItems: 'center', justifyContent: 'center' }}>
          <Icons.Logout windowSize={{ height: height, width: width }} size={width / 21.088}></Icons.Logout>
        </View>
        <View style={{ flex: 3, height: height / 17.817, justifyContent: 'center' }}>
          <TouchableOpacity onPress={this.props.confirmLogout} id={'logout'}>
            <Text style={{ fontSize: 20, fontFamily: '黑体', color: '#4E4E4E' }}>退出登录</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* <TouchableOpacity onPress={this.props.jump} id={'logout'}>
        <Text style={{ fontSize: 20, fontFamily: '黑体', color: '#4E4E4E' }}>测试跳转企业详情</Text>
      </TouchableOpacity> */}
    </View>
    )
  }
}
