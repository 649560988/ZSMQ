import React, { Component } from 'react'
import { View, ScrollView, Dimensions, Text, TouchableOpacity, Alert ,Linking } from 'react-native'
import request from '../request'
import * as Icons from '../icons'
import { Link } from '../components'
export class CompanyDetails extends Component {
  constructor (props) {
    super(props)
    /**
     * data: 企业信息
     * financeInfo: 该企业每一年的财税信息
     */
    this.state = {
      data: {},
      financeInfo: {},
      showBusinessDetails: false,
      showFinanceDetails: false,
      showSocialSecurityDetails: false,
      showOtherDetails: false,
      showRenderContactsInfo:false,
      isGov:false
    }
    // this.setState({
    //   data:navigation.state.params
    // })
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.state.params.entName,
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
/**
   * 获取登录角色信息
   */
  getCurrectRole=()=>{
    // alert(this.props.navigation.state.params.id)
    this.setState({
      data: this.props.navigation.state.params,
    })
    let url='/v1/sysUserDomin/queryRolesMenus'
    request(url,{
      method: 'Post'
    }).then((res) =>{
      if(res.data==null){
        this.setState({
          isGov:false,
        })
      }else{
        res.data.roles.map((item)=>{
          if(item.name=='gov_user'){
            this.getFinanceInfo()
            this.setState({
              isGov:true,
            })
          }
        })
      }
    })
  }

  componentWillMount () {
    // this.getCompanyInfo()
    this.getCurrectRole()
    
  }
  handCickTel=(data)=>{
    var url='tel:' + data;
    Linking.openURL(url)
  }

  handClick=()=>{
    let url="androidamap://keywordNavi?sourceApplication=softname&keyword="+"清水湾22号楼"+"&style=2"
    Linking.canOpenURL(url).then(supported=>{
      if(supported){
        Linking.openURL(url)
      }else{
        Alert.alert("请先安装")
      }
    })
  }
  /**
   * 根据企业id查询企业的财税信息
   */
  getFinanceInfo = () => {
    let year = new Date().getFullYear()-1
    let url = `/v1/enterprises/finance/selectFinanceByEntId/${this.props.navigation.state.params.id}/${year}`
    request(url, {
      method: 'GET'
    }).then((res) => {
      if (res) {
        // console.log(res)
        if (res.message === ''||res.message===null) {
          console.log('接受的值为：',res.data)
          if (res.data.length > 0) {
            this.setState({
              financeInfo: res.data[0]
            })
          } else {
            this.setState({
              financeInfo: {}
            })
          }
        } else {
          console.log(res.message)
        }
      }
    }).catch((error) => {
      console.log(error)
    })
  }

  /**
   * 返回页面上部的蓝色区域
   */
  renderHeader = () => {
    const { width ,height} = Dimensions.get('window')
    let temp = new Date(Number(this.state.data.establishDate))
    let creationDate = temp.getFullYear() + '年' + (temp.getMonth() + 1) + '月' + temp.getDate() + '日'
    return (
      <View style={{ width: width, backgroundColor: '#147DD5', display: 'flex', flexDirection: 'column' }}>
        <View style={{ flex: 1, marginLeft: 'auto', marginRight: 'auto', marginBottom: 5, display: 'flex', flexDirection: 'row' }}onPress={this.handClick()}>
          <Icons.Location size={20} />
          <Text style={{ color: 'white', fontSize: 18, textAlign: 'center', paddingRight: 20 }}>{this.state.data.mhAddress}</Text>
        </View>
        <View style={{ flex: 2, display: 'flex', flexDirection: 'row', marginLeft: 'auto', marginRight: 'auto', marginBottom: 8 , marginTop: height / 47.862}}>
          <View style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: 'white', fontSize: 18, textAlign: 'center' }}>法定代表人</Text>
            </View>
            <View style={{ flex: 2, marginTop: 5 }}>
              <Text style={{ color: 'white', fontSize: 18, textAlign: 'center' }}>{this.state.data.corporation}</Text>
            </View>
          </View>
          <View style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: 'white', fontSize: 18, textAlign: 'center' }}>注册资本</Text>
            </View>
            <View style={{ flex: 2, marginTop: 5 }}>
              <Text style={{ color: 'white', fontSize: 18, textAlign: 'center' }}>{this.state.data.registeredCapital}</Text>
            </View>
          </View>
          <View style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: 'white', fontSize: 18, textAlign: 'center' }}>成立日期</Text>
            </View>
            <View style={{ flex: 2, marginTop: 5 }}>
              <Text style={{ color: 'white', fontSize: 18, textAlign: 'center' }}>{creationDate}</Text>
            </View>
          </View>
        </View>
      </View>
    )
  }

   /**
   * 返回基本信息
   * wyw
   */
  renderBusinessInfo=()=>{
    const { height, width } = Dimensions.get('window')
    let year = new Date(this.state.data.establishDate).getFullYear()
    if(this.state.isGov){
      return(
        <View style={{ width: width, display: 'flex', flexDirection: 'column', marginTop: height / 47.862 }}>
          <View style={{ flex: 1, backgroundColor: 'white', marginBottom: 2, justifyContent: 'center', paddingLeft: width / 14.136, height: height / 18.757 }}>
            <Text style={{ fontSize: height / 55.52, color: '#8A8A8A' }}>基本信息</Text>
          </View>
           <View style={{ flex: 2, backgroundColor: 'white', justifyContent: 'center', paddingLeft: width / 14.136, paddingRight: width / 14.136, height: height / 16.236, display: 'flex', flexDirection: 'row' }}>
            <View style={{ flex: 1, justifyContent: 'center',backgroundColor:'white' ,alignItems: 'center'}}>
              <Text style={{ fontSize: height / 55.52, color: 'black' }}>工商注册号</Text>
              <Text style={{ color: '#147dd5' ,fontSize: height / 55.52}} >{this.state.data.registrationNum}</Text>
            </View>
              <View style={{ flex: 1, justifyContent: 'center',backgroundColor:'white' ,alignItems: 'center'}}>
                <Text style={{ fontSize: height / 55.52, color: 'black' }}>组织机构代码</Text>
                <Text style={{ color: '#147dd5' ,fontSize: height / 55.52}} >{this.state.data.organizationalCode}</Text>
              </View>
          </View>
          <View style={{ flex: 2, backgroundColor: 'white', justifyContent: 'center', paddingLeft: width / 14.136, paddingRight: width / 14.136, height: height / 28.236, display: 'flex', flexDirection: 'row' }}>
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <Text style={{ fontSize: height / 55.52, color: 'black' }}>成立日期： <Text style={{ color: '#147dd5' }} >{year}年</Text></Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flex: 1, justifyContent: 'center' }}>
                <Text style={{ fontSize: height / 55.52, color: 'black' }}>注册资本： <Text style={{ color: '#147dd5' }} >{this.state.data.registeredCapital}</Text></Text>
              </View>
            </View>
          </View>
          <View style={{ flex: 2, backgroundColor: 'white', justifyContent: 'center', paddingLeft: width / 14.136, paddingRight: width / 14.136, height: height / 28.236, display: 'flex', flexDirection: 'row' }}>
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <Text style={{ fontSize: height / 55.52, color: 'black' }}>注册地址： <Text style={{ color: '#147dd5' }} >{this.state.data.address.length > 6 ? this.state.data.address.substring(0, 6) + '...' : this.state.data.address}</Text></Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flex: 1, justifyContent: 'center' }}>
                <Text style={{ fontSize: height / 55.52, color: 'black' }}>所属行业 ：<Text style={{ color: '#147dd5' }} >XXXXXX</Text></Text>
              </View>
            </View>
          </View>
          <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center', paddingLeft: width / 14.136, paddingRight: width / 14.136, height: height / 28.236, display: 'flex', flexDirection: 'row' }}>
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <Text style={{ fontSize: height / 55.52, color: 'black' }}>股东: <Text style={{ color: '#147dd5' }} >{this.state.data.shareholder}</Text></Text>
            </View>
          </View>
        </View>
      )
    }else{
      return(
        <View style={{ width: width, display: 'flex', flexDirection: 'column', marginTop: height / 47.862 }}>
          <View style={{ flex: 1, backgroundColor: 'white', marginBottom: 2, justifyContent: 'center', paddingLeft: width / 14.136, height: height / 18.757 }}>
            <Text style={{ fontSize: height / 55.52, color: '#8A8A8A' }}>基本信息</Text>
          </View>
          <View style={{ backgroundColor: 'white',paddingLeft: width / 14.136, paddingRight: width / 14.136, height: height / 28.236, display: 'flex', flexDirection: 'row'}}>
            <View style={{  justifyContent: 'center' }}>
            <Text style={{ fontSize: height / 55.52, color: 'black' }}>工商注册号:  <Text style={{ color: '#147dd5' }} >{this.state.data.registrationNum}</Text></Text>  
            </View>
          </View>
          <View style={{ backgroundColor: 'white',paddingLeft: width / 14.136, paddingRight: width / 14.136, height: height / 28.236, display: 'flex', flexDirection: 'row'}}>
            <View style={{  justifyContent: 'center' }}>
            <Text style={{ fontSize: height / 55.52, color: 'black' }}>组织机构代码:  <Text style={{ color: '#147dd5' }} >{this.state.data.organizationalCode}</Text></Text>  
            </View>
          </View>
          <View style={{ backgroundColor: 'white',paddingLeft: width / 14.136, paddingRight: width / 14.136, height: height / 28.236, display: 'flex', flexDirection: 'row'}}>
            <View style={{  justifyContent: 'center' }}>
            <Text style={{ fontSize: height / 55.52, color: 'black' }}>成立日期：  <Text style={{ color: '#147dd5' }} >{year}年</Text></Text>  
            </View>
          </View>
          <View style={{ backgroundColor: 'white',paddingLeft: width / 14.136, paddingRight: width / 14.136, height: height / 28.236, display: 'flex', flexDirection: 'row'}}>
            <View style={{  justifyContent: 'center' }}>
            <Text style={{ fontSize: height / 55.52, color: 'black' }}>注册资本:  <Text style={{ color: '#147dd5' }} >{this.state.data.registeredCapital}</Text></Text>  
            </View>
          </View>
        <View style={{ backgroundColor: 'white',paddingLeft: width / 14.136, paddingRight: width / 14.136, height: height / 28.236, display: 'flex', flexDirection: 'row'}}>
           <View style={{  justifyContent: 'center' }}>
           <Text style={{ fontSize: height / 55.52, color: 'black' }}>注册地址：  <Text style={{ color: '#147dd5' }} >{this.state.data.address.length > 6 ? this.state.data.address.substring(0, 6) + '...' : this.state.data.address}</Text></Text>  
           </View>
        </View>
       <View style={{ backgroundColor: 'white',paddingLeft: width / 14.136, paddingRight: width / 14.136, height: height / 28.236, display: 'flex', flexDirection: 'row'}}>
       <View style={{  justifyContent: 'center' }}>
       <Text style={{ fontSize: height / 55.52, color: 'black' }}>所属行业:  <Text style={{ color: '#147dd5' }} >XXXXXX</Text></Text>  
       </View>
      </View>
    </View>
      )
    }
  }
  /**
   * 返回详细信息-联系人信息部分
   * wyw
   */
  renderContactsInfo = () => {
    const { height, width } = Dimensions.get('window')
    if(this.state.isGov){
      if (!this.state.showRenderContactsInfo) {
        return (
          <View style={{ width: width, display: 'flex', flexDirection: 'column', marginTop: height / 44.064 }}>
          <View style={{ flex: 1, backgroundColor: 'white', marginBottom: 2, justifyContent: 'center', paddingLeft: width / 14.136, height: height / 18.757 }}>
             <Text style={{ fontSize: height / 55.52, color: '#8A8A8A' }}>详细信息</Text>
          </View>
          <TouchableOpacity onPress={() => this.changeState({ showRenderContactsInfo: !this.state.showRenderContactsInfo })}>
            <View style={{ width: width, flex: 1, backgroundColor: 'white', marginBottom: 2, justifyContent: 'center', paddingLeft: width / 14.136, paddingRight: width / 14.136, height: height / 12.45 }}>
              <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <Icons.IconMy size={height / 25.236} />
                <Text style={{ color: 'black', fontSize: height / 55.52, marginLeft: width / 18.294 }}>联系人信息</Text>
                <View style={{ marginRight: 0, marginLeft: 'auto' }}>
                  <Icons.Left size={height / 59.064} />
                </View>
              </View>
            </View>
          </TouchableOpacity>
         </View>
        )
      } else {
        return (
          <View style={{ width: width, display: 'flex', flexDirection: 'column', marginTop: height / 44.064 }}>
          <View style={{ flex: 1, backgroundColor: 'white', marginBottom: 2, justifyContent: 'center', paddingLeft: width / 14.136, height: height / 18.757 }}>
             <Text style={{ fontSize: height / 55.52, color: '#8A8A8A' }}>详细信息</Text>
          </View>
            <TouchableOpacity onPress={() => this.changeState({ showRenderContactsInfo: !this.state.showRenderContactsInfo })}>
              <View style={{ width: width, backgroundColor: 'white', justifyContent: 'center', paddingLeft: width / 14.136, paddingRight: width / 14.136, height: height / 12.45 }}>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                  <Icons.IconMy size={height / 25.236} />
                  <Text style={{ color: 'black', fontSize: height / 55.52, marginLeft: width / 18.294 }}>联系人信息</Text>
                  <View style={{ marginRight: 0, marginLeft: 'auto' }}>
                    <Icons.Fall size={height / 30.064} />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
            <View style={{ flex: 3,height: height / 12.075, backgroundColor: 'white',marginBottom:height / 47.862 , display: 'flex', flexDirection: 'row', justifyContent: 'center', paddingLeft: width / 14.136, paddingRight: width / 14.136, paddingBottom: height / 45 }}>
            <View style={{ flex: 1 }}>
              <View style={{ flex: 1, justifyContent: 'center' }}>
                <Text style={{ fontSize: height / 58.52, color: '#8A8A8A' }}>法人代表<Text style={{ color: '#147dd5' }} >{this.state.data.corporation}</Text></Text>
                <Text style={{ fontSize: height / 58.52, color: '#147dd5'  }} onPress={()=>this.handCickTel(this.state.data.corporationTel)}>{this.state.data.corporationTel}</Text>
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flex: 1, justifyContent: 'center' }}>
                <Text style={{ fontSize: height / 58.52, color: '#8A8A8A' }}>财务<Text style={{ color: '#147dd5' }} >XXXXXX</Text></Text>
                <Text style={{ fontSize: height / 58.52,  color: '#147dd5'  }} onPress={()=>this.handCickTel(this.state.data.corporationTel)}>{this.state.data.corporationTel}</Text>
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flex: 1, justifyContent: 'center' }}>
                <Text style={{ fontSize: height / 58.52, color: '#8A8A8A' }}>负责人<Text style={{ color: '#147dd5' }} >XXXXXX</Text></Text>
                <Text style={{ fontSize: height / 58.52,  color: '#147dd5'  }} onPress={()=>this.handCickTel(this.state.data.corporationTel)}>{this.state.data.corporationTel}</Text>
              </View>
            </View>
            </View>
          </View>
        )
      }
    }else{
      return null
    }
  }

  
  /**
   * 返回基本信息-财务信息部分
   */
  renderFinanceInfo = () => {
    const { height, width } = Dimensions.get('window')
    if(this.state.isGov){
      if (!this.state.showFinanceDetails) {
        return (
          <TouchableOpacity onPress={() => this.changeState({ showFinanceDetails: !this.state.showFinanceDetails })}>
            <View style={{ width: width, flex: 1, backgroundColor: 'white', marginBottom: 2, justifyContent: 'center', paddingLeft: width / 14.136, paddingRight: width / 14.136, height: height / 12.45 }}>
              <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <Icons.FinanceInfo size={height / 25.236} />
                <Text style={{ color: 'black', fontSize: height / 55.52, marginLeft: width / 18.294 }}>财务信息</Text>
                <View style={{ marginRight: 0, marginLeft: 'auto' }}>
                  <Icons.Left size={height / 59.064} />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )
      } else {
        return (
          <View >
            <TouchableOpacity onPress={() => this.changeState({ showFinanceDetails: !this.state.showFinanceDetails })}>
              <View style={{ width: width, backgroundColor: 'white', justifyContent: 'center', paddingLeft: width / 14.136, paddingRight: width / 14.136, height: height / 12.45 }}>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                  <Icons.FinanceInfo size={height / 25.236} />
                  <Text style={{ color: 'black', fontSize: height / 55.52, marginLeft: width / 18.294 }}>财务信息</Text>
                  <View style={{ marginRight: 0, marginLeft: 'auto' }}>
                    <Icons.Fall size={height / 30.064} />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
            <View style={{ height: height / 12.075, backgroundColor: 'white',  display: 'flex', flexDirection: 'column', justifyContent: 'center',paddingLeft: width / 14.136, paddingRight: width / 14.136,marginBottom:height / 47.862}}>
              <View style={{marginLeft: width / 12.136}}>
              <Text style={{ color: '#8A8A8A', fontSize: height / 62.52 }}>本年收入：<Text style={{ color: '#147dd5', fontSize: height / 62.52 }}>{this.state.financeInfo.sale}万元</Text></Text>
              <Text style={{ color: '#8A8A8A', fontSize: height /62.52 }}>本年纳税额：<Text style={{ color: '#147dd5', fontSize: height / 62.52 }}>{this.state.financeInfo.taxes}万元</Text></Text>
              </View>
              <View style={{alignItems:'flex-end'}}>
              <Link to={{routeName:'FinanceInformation',params:{id:this.state.data.organizationalCode}}}>
                <Text style={{ color: '#147dd5', fontSize: height / 62.52 }} >点击查看更多财务信息</Text>
              </Link>
              </View>
  
            </View>
          </View>
        )
      }
    }else{
      return null
    }
  }

  /**
   * 返回基本信息-社保信息部分
   */
  renderSocialSecurity = () => {
    const { height, width } = Dimensions.get('window')
    if(this.state.isGov){
      if (!this.state.showSocialSecurityDetails) {
        return (
          <TouchableOpacity onPress={() => this.changeState({ showSocialSecurityDetails: !this.state.showSocialSecurityDetails })}>
            <View style={{ width: width, flex: 1, backgroundColor: 'white', marginBottom: 2, justifyContent: 'center', paddingLeft: width / 14.136, paddingRight: width / 14.136, height: height / 12.45 }}>
              <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <Icons.SocialSecurity size={height / 25.236} />
                <Text style={{ color: 'black', fontSize: height / 55.52, marginLeft: width / 18.294 }}>社保信息</Text>
                <View style={{ marginRight: 0, marginLeft: 'auto' }}>
                  <Icons.Left size={height / 59.064} />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )
      } else {
        return (
          <TouchableOpacity onPress={() => this.changeState({ showSocialSecurityDetails: !this.state.showSocialSecurityDetails })}>
            <View style={{ width: width, flex: 1, backgroundColor: 'white', marginBottom: 2, justifyContent: 'center', paddingLeft: width / 14.136, paddingRight: width / 14.136, height: height / 12.45 }}>
              <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <Icons.SocialSecurity size={height / 25.236} />
                <Text style={{ color: 'black', fontSize: height / 55.52, marginLeft: width / 18.294 }}>社保信息</Text>
                <View style={{ marginRight: 0, marginLeft: 'auto' }}>
                  <Icons.Fall size={height / 30.064} />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )
      }
    }else{
      return null
    }
  
  }

  /**
   * 用户点击查看各个基本信息的详情
   */
  changeState = (newState) => {
    this.setState(newState)
  }
  /**
   * 返回更多信息部分
   */
  renderMore = () => {
    const { height, width } = Dimensions.get('window')
    // if(this.state.isGov){
      return (
        <View style={{ width: width, height: height / 17.682, justifyContent: 'center', alignItems: 'center', marginTop: height / 43.375, marginBottom: height / 26.692, backgroundColor: 'white' }}>
        {/* <Link to={{ routeName: 'CompanyDescription', params: { id: item.id, isAll: item.isAll } }}>  */}
        {/** 
         *跳转到企业信息代码
         *不知道具体数据信息，这里只设置跳转的页面，其余等有信息之后在做。 
        */}
       <Link to={{routeName:'CompanyDescription',params:{id:this.state.data.organizationalCode}}}>
          <Text  style={{ color: '#147dd5', fontSize: height / 55.52 }}>企业介绍</Text>
      </Link>
        </View>
    )
  }

  /**
   * 更多信息（仅供政府账号查询）
   */
  moreInfo = () => {
    Alert.alert('错误', '暂不支持')
  }
  aboutCompanyInfo=()=>{
    Alert.alert('错误', '此功能仅供政府账号查询')
  }

  render () {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: '#F4F4F4' }}>
        {this.renderHeader()}
        {this.renderBusinessInfo()}
        {this.renderContactsInfo()}
        {this.renderFinanceInfo()}
        {this.renderSocialSecurity()}
        {this.renderMore()}
      </ScrollView>
    )
  }
}
