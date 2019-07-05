/**
 * 财税信息列表
 */

import React from 'react'
import {   ActivityIndicator,FlatList, Picker, Text, View, Dimensions, StyleSheet, Switch, TouchableOpacity, DatePickerAndroid, Alert } from 'react-native'
import * as Icons from '../icons'
import request from '../request'
import styled from 'styled-components'
import { PromiseView } from '../components'
const CompanySearchItemCard = styled.TouchableOpacity`
background-color: #FFF;
/* box-shadow: 2px 5px 0px #000; */
elevation: 5;
box-shadow: 2px 5px 0px black;
border-left-width: 0px;
border-color: #147dd5;
padding: 0px 0px;
margin-bottom: 0px;
height: 80px;
`
export class CompanyList extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: '规模企业',
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
  constructor (props) {
    super(props)
    const { width } = Dimensions.get('window')
    this.state = {
      data: [],
      isGov:false,
      renderItem:({ item ,index}) =>
      {
        if(index%2===0){
          return(
            <CompanySearchItemCard onPress={()=>this.handlePressCompanyCard(item)}>
            {
              this.state.isGov?
              <View style={{  width: '100%',height:'100%', paddingTop:25, display: 'flex', flexDirection: 'row' }} onPress={item.onPress}>
              <View style={{ flex: 1,height:'100%'}}>
              <Text style={styles.name}>{item.entName.length > 4 ? item.entName.substring(0, 4) + '...' : item.entName}</Text>
                 </View>  
                 <View style={{ flex: 1 ,justifyContent:'center',alignItems: 'center'}}>
                    <Text style={styles.sale}>{item.sale}</Text>
                 </View>
                 <View style={{ flex: 1 }}>  
                 <Text style={styles.tax}>{item.taxes}</Text>
                 </View>
                 <View style={{ flex: 1 }}>
                 <Text style={styles.sale}>{item.saleRow}</Text>
                   </View>
                   <View style={{ flex: 1 }}>
                   <Text style={styles.tax}>{item.taxesRow}</Text>
                   </View>
              </View>
              :
              <View style={{  width: '100%',height:'100%', paddingTop:25, display: 'flex', flexDirection: 'row' }} onPress={item.onPress}>
              <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.entName.length > 6 ? item.entName.substring(0, 6) + '...' : item.entName}</Text>
              </View>  
              <View style={{ flex: 1 }}>
                 <Text style={styles.sale}>{item.sale}</Text>
              </View>
              <View style={{ flex: 1 }}>
              <Text style={styles.sale}>{item.saleRow}</Text>
                </View>
              </View>
            }
            </CompanySearchItemCard>
          )
        }else{
          return(
               <CompanySearchItemCard onPress={()=>this.handlePressCompanyCard(item)}>
            {
              this.state.isGov?
              <View style={{  width: '100%',height:'100%', paddingTop:25, display: 'flex', flexDirection: 'row',backgroundColor:'#F5F6F8' }} onPress={item.onPress}>
              <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.entName.length > 4 ? item.entName.substring(0, 4) + '...' : item.entName}</Text>
                 </View>  
                 <View style={{ flex: 1}}>
                    <Text style={styles.sale}>{item.sale}</Text>
                 </View>
                 <View style={{ flex: 1 }}>  
                 <Text style={styles.tax}>{item.taxes}</Text>
                 </View>
                 <View style={{ flex: 1 }}>
                 <Text style={styles.sale}>{item.saleRow}</Text>
                   </View>
                   <View style={{ flex: 1 }}>
                   <Text style={styles.tax}>{item.taxesRow}</Text>
                   </View>
              </View>
              :
              <View style={{  width: '100%',height:'100%', paddingTop:25, display: 'flex', flexDirection: 'row',backgroundColor:'#F5F6F8' }} onPress={item.onPress}>
              <View style={{ flex: 1, }}>
              <Text style={styles.name}>{item.entName.length > 6 ? item.entName.substring(0, 6) + '...' : item.entName}</Text>
              </View>  
              <View style={{ flex: 1, }}>
                 <Text style={styles.sale}>{item.sale}</Text>
              </View>
              <View style={{ flex: 1, }}>
              <Text style={styles.sale}>{item.saleRow}</Text>
                </View>
              </View>
            }
            </CompanySearchItemCard>
          )
        }
      },
      showShortName: false,
      realTimeSort: true,
      year: new Date().getFullYear(),
      now: new Date().getFullYear(),
      list: <View />,
      refreshing: false,
    }
  }
  componentDidMount () {
    this.getCurrectRole()
  }
  /**
   * 获取登录角色信息
   */
  getCurrectRole=()=>{
    let url='/v1/sysUserDomin/queryRolesMenus'
    request(url,{
      method: 'Post'
    }).then((res) =>{
      if(res.data==null){
        this.setState({
          isGov:false
        })
      }else{
        res.data.roles.map((item)=>{
          if(item.name=='gov_user'){
            this.setState({
              isGov:true
            })
          }
        })
      }
    })
  }
  /**
   * 从后台获取所有企业信息
   */
  getCompanyList = (year) => {
    if (this.state.refreshing) return
    this.setState({
      loadingEnd: false,
      pageNo: 1,
      refreshing: true,
      promise: request(`/v1/enterprises/finance/queryEntScale/${year}?pageNo=1&pageSize=200`, {
        method: 'GET'
      }),
      promiseHandle: (state, res) => {
        if (state === 'resolved') {
          // let data = []
          //   res.data.list.map((item, index) => {
          //     item.key = item.entId.toString()
          //     data.push(item)
          //   })
          this.setState({
            error: null,
            refreshing: false,
            data:res.data.list
          })
        } else if (state === 'rejected') {
          this.setState({
            error: res,
            refreshing: false,
            data: []
          })
        }
      }
    })
  }
  /**
   * 加载跟多数据
   */
  loadMoreData = () => {
    if (this.state.loading || this.state.loadingEnd) return
    const { pageNo, data } = this.state
    this.setState({
      pageNo: pageNo + 1,
      loading: true,
      loadMorePromise: request(`/v1/enterprises/finance/queryEntScale/${this.state.year}?pageNo=${pageNo+1}&pageSize=200`, {
        method: 'GET'
      }),
      loadMorePromiseHandle: (state, res) => {
        if (state === 'resolved') {
          // let dataList=[]
          // res.data.list.map((item, index) => {
          //   item.key = item.entId.toString()
          //   dataList.push(item)
          // })
          this.setState({
            loadingError: null,
            loading: false,
            loadingEnd: res.data.list.length < 200,
            data: [...data, ...res.data.list]
          })
        } else if (state === 'rejected') {
          this.setState({
            pageNo,
            loadingError: res,
            loading: false
          })
        }
      }
    })
  }
 
  /**
   * 将后台的数据填入list
   */
  addToList = () => {
    const { width } = Dimensions.get('window')
    //是否显示简称
    if (this.state.showShortName) {
      //判断是否为企业账号
      if(this.state.isGov){
      this.setState({
        renderItem: ({ item ,index}) =>
        {
          if(index%2===0){
            return(
              <CompanySearchItemCard onPress={()=>this.handlePressCompanyCard(item)}>
              <View style={{  width: '100%',height:'100%', paddingTop:25, display: 'flex', flexDirection: 'row' }} onPress={item.onPress}>
            <View style={{ flex: 1 }}>
            <Text style={styles.name}>{item.entShortName}</Text>
               </View>  
               <View style={{ flex: 1}}>
                  <Text style={styles.sale}>{item.sale}</Text>
               </View>
               <View style={{ flex: 1 }}>  
               <Text style={styles.tax}>{item.taxes}</Text>
               </View>
               <View style={{ flex: 1 }}>
               <Text style={styles.sale}>{item.saleRow}</Text>
                 </View>
                 <View style={{ flex: 1 }}>
                 <Text style={styles.tax}>{item.taxesRow}</Text>
                 </View>
            </View>
            </CompanySearchItemCard>
            )
          }else{
            return(
              <CompanySearchItemCard onPress={()=>this.handlePressCompanyCard(item)}>
        <View style={{  width: '100%',height:'100%', paddingTop:25, display: 'flex', flexDirection: 'row',backgroundColor:'#F5F6F8'  }} onPress={item.onPress}>
        <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.entShortName}</Text>
        </View>  
        <View style={{ flex: 1}}>
           <Text style={styles.sale}>{item.sale}</Text>
        </View>
        <View style={{ flex: 1 }}>  
        <Text style={styles.tax}>{item.taxes}</Text>
        </View>
        <View style={{ flex: 1 }}>
        <Text style={styles.sale}>{item.saleRow}</Text>
          </View>
          <View style={{ flex: 1 }}>
          <Text style={styles.tax}>{item.taxesRow}</Text>
          </View>
        </View>
          </CompanySearchItemCard>
            )
          }
        }
      })
    }else{
      this.setState({
        renderItem: ({ item,index }) =>
        {
          if(index%2===0){
            return(
              <CompanySearchItemCard onPress={()=>this.handlePressCompanyCard(item)}>
              <View style={{  width: '100%',height:'100%', paddingTop:25, display: 'flex', flexDirection: 'row' }} onPress={item.onPress}>
            <View style={{ flex: 1 }}>
            <Text style={styles.name}>{item.entShortName}</Text>
               </View>  
               <View style={{ flex: 1 ,justifyContent:'center',alignItems: 'center'}}>
                  <Text style={styles.sale}>{item.sale}</Text>
               </View>
               <View style={{ flex: 1 }}>
               <Text style={styles.sale}>{item.saleRow}</Text>
                 </View>
            </View>
            </CompanySearchItemCard>
            )
          }else{
            return(
              <CompanySearchItemCard onPress={()=>this.handlePressCompanyCard(item)}>
        <View style={{  width: '100%',height:'100%', paddingTop:25, display: 'flex', flexDirection: 'row',backgroundColor:'#F5F6F8'  }} onPress={item.onPress}>
        <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.entShortName}</Text>
        </View>  
        <View style={{ flex: 1 }}>
           <Text style={styles.sale}>{item.sale}</Text>
        </View>
        <View style={{ flex: 1 }}>
        <Text style={styles.sale}>{item.saleRow}</Text>
          </View>
        </View>
          </CompanySearchItemCard>
            )
          }
        }
      })
    }
    } else {
      if(this.state.isGov){
        this.setState({
          renderItem: ({ item,index }) =>
          {
            if(index%2===0){
              return(
                <CompanySearchItemCard onPress={()=>this.handlePressCompanyCard(item)}>
                <View style={{  width: '100%',height:'100%', paddingTop:25, display: 'flex', flexDirection: 'row' }} onPress={item.onPress}>
              <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.entName.length > 4 ? item.entName.substring(0, 4) + '...' : item.entName}</Text>
                 </View>  
                 <View style={{ flex: 1}}>
                    <Text style={styles.sale}>{item.sale}</Text>
                 </View>
                 <View style={{ flex: 1 }}>  
                 <Text style={styles.tax}>{item.taxes}</Text>
                 </View>
                 <View style={{ flex: 1 }}>
                 <Text style={styles.sale}>{item.saleRow}</Text>
                   </View>
                   <View style={{ flex: 1 }}>
                   <Text style={styles.tax}>{item.taxesRow}</Text>
                   </View>
              </View>
              </CompanySearchItemCard>
              )
            }else{
              return(
                <CompanySearchItemCard onPress={()=>this.handlePressCompanyCard(item)}>
          <View style={{  width: '100%',height:'100%', paddingTop:25, display: 'flex', flexDirection: 'row',backgroundColor:'#F5F6F8'  }} onPress={item.onPress}>
          <View style={{ flex: 1 }}>
          <Text style={styles.name}>{item.entName.length > 4 ? item.entName.substring(0, 4) + '...' : item.entName}</Text>
          </View>  
          <View style={{ flex: 1}}>
             <Text style={styles.sale}>{item.sale}</Text>
          </View>
          <View style={{ flex: 1 }}>  
          <Text style={styles.tax}>{item.taxes}</Text>
          </View>
          <View style={{ flex: 1 }}>
          <Text style={styles.sale}>{item.saleRow}</Text>
            </View>
            <View style={{ flex: 1 }}>
            <Text style={styles.tax}>{item.taxesRow}</Text>
            </View>
          </View>
            </CompanySearchItemCard>
              )
            }
          }
        })
      }else{
        this.setState({
          renderItem: ({ item,index }) => 
          {
            if(index%2===0){
              return(
                <CompanySearchItemCard onPress={()=>this.handlePressCompanyCard(item)}>
                <View style={{  width: '100%',height:'100%', paddingTop:25, display: 'flex', flexDirection: 'row' }} onPress={item.onPress}>
              <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.entName.length > 6 ? item.entName.substring(0, 6) + '...' : item.entName}</Text>
                 </View>  
                 <View style={{ flex: 1 ,justifyContent:'center',alignItems: 'center'}}>
                    <Text style={styles.sale}>{item.sale}</Text>
                 </View>
                 <View style={{ flex: 1 }}>
                 <Text style={styles.sale}>{item.saleRow}</Text>
                   </View>
              </View>
              </CompanySearchItemCard>
              )
            }else{
              return(
                <CompanySearchItemCard onPress={()=>this.handlePressCompanyCard(item)}>
          <View style={{  width: '100%',height:'100%', paddingTop:25, display: 'flex', flexDirection: 'row',backgroundColor:'#F5F6F8'  }} onPress={item.onPress}>
          <View style={{ flex: 1}}>
          <Text style={styles.name}>{item.entName.length > 6 ? item.entName.substring(0, 6) + '...' : item.entName}</Text>
          </View>  
          <View style={{ flex: 1 }}>
             <Text style={styles.sale}>{item.sale}</Text>
          </View>
          <View style={{ flex: 1 }}>
          <Text style={styles.sale}>{item.saleRow}</Text>
            </View>
          </View>
            </CompanySearchItemCard>
              )
            }
          }
        })
      }
    }
  }
  /**
   * 获取switch的状态
   */
  switchValue (value, state, type) {
    const { now } = this.state
    this.setState(state, () => {
      if (type === 'shortName') {
        this.addToList()
      } else {
        if (state.realTimeSort) {
          this.setState({
            year: this.state.now
          })
          this.getCompanyList(now)
        } else {
          this.setState({
            year: this.state.now - 1
          })
          this.getCompanyList(now - 1)
        }
      }
    })
  }
  /**
   * 详情也跳转
   * 
   */
  handlePressCompanyCard=(item)=>{
    const { navigation } = this.props
    let url=`/v1/enterprises/base/queryOneById/${item.entId}`
    request(url,{
      method:'GET'
    }).then((res)=>{
      if(res.message==='查询成功'){
        navigation.navigate('CompanyDetails', res.data)
      }
    })
  }
  /**
   * 安卓，显示年份选择器
   */
  // yearChoose = async () => {
  //   let _this = this
  //   try {
  //     const { action, year } = await DatePickerAndroid.open({
  //       // 要设置默认值为今天的话，使用`new Date()`即可。
  //       // 下面显示的会是2020年5月25日。月份是从0开始算的。
  //       date: new Date(_this.state.year, 1, 1),
  //       mode: 'spinner'
  //     })
  //     if (action !== DatePickerAndroid.dismissedAction) {
  //       // 这里开始可以处理用户选好的年月日三个参数：year, month (0-11), day
  //       if (year !== _this.state.now) {
  //         _this.setState({
  //           year,
  //           realTimeSort: false
  //         }, () => {
  //           this.getCompanyList(year)
  //         })
  //       } else {
  //         _this.setState({
  //           year,
  //           realTimeSort: true
  //         }, () => {
  //           this.getCompanyList(year)
  //         })
  //       }
  //     }
  //   } catch ({ code, message }) {
  //     console.warn('Cannot open date picker', message)
  //   }
  // }
  /**
   * 年份变化时回调
   */
  handleOnYearChange = (year) => {
    if (year !== this.state.now) {
      this.setState({
        year,
        realTimeSort: false
      }, () => {
        this.getCompanyList(year)
      })
    } else {
      this.setState({
        year,
        realTimeSort: true
      }, () => {
        this.getCompanyList(year)
      })
    }
  }
  renderYears = () => {
    let current = new Date().getFullYear()
    let endYear = current + 20
    return Array.from({ length: endYear - 1900 }, (v, k) => {
      return k + 1900
    }).map(year => {
      return (
        <Picker.Item key={year} label={String(year)} value={year} />
      )
    })
  }
renderTitle=()=>{
  if(this.state.isGov){
    return(
<View style={styles.title}>
            {/* <View style={{ flex: 1, textAlign: 'center', borderRightColor: '#ffffff', borderRightWidth: 3, height: 20, marginTop: 4 }}>
              <Text style={styles.titleContent}>排序</Text>
              <View style={styles.line} /> 
            </View> */}
            <View style={{ flex: 2, textAlign: 'center', borderRightColor: '#ffffff', borderRightWidth: 3, marginTop: 4 }}>
              <Text style={styles.titleContent}>企业名称</Text>
              {/* <View style={styles.line} /> */}
            </View>
            <View style={{ flex: 2, textAlign: 'center', borderRightColor: '#ffffff', borderRightWidth: 3,  marginTop: 4 }}>
              <Text style={styles.titleContent}>销售(万元)</Text>
              {/* <View style={styles.line} /> */}
            </View>
            <View style={{ flex: 2, textAlign: 'center',  marginTop: 4 ,borderRightColor: '#ffffff', borderRightWidth: 3}}>
              <Text style={styles.titleContent}>纳税(万元)</Text>
            </View>
            <View style={{ flex: 2, textAlign: 'center', borderRightColor: '#ffffff', borderRightWidth: 3,marginTop: 4 }}>
                <Text style={styles.titleContent}>销售排名</Text>
            </View>
            <View style={{ flex: 2, textAlign: 'center', marginTop: 4}}>
              <Text style={styles.titleContent}>纳税排名</Text>
            </View>
            {/* {
              this.state.realTimeSort? 
              <View style={{ flex: 2, textAlign: 'center', height: 20, marginTop: 4,borderLeftColor:'#ffffff',borderLeftWidth: 3}}>
              <Text style={styles.titleContent}>纳税排名</Text>
            </View>:null
            } */}
          </View>
      )
  }else{
    return(
<View style={styles.title}>
            {/* <View style={{ flex: 1, textAlign: 'center', borderRightColor: '#ffffff', borderRightWidth: 3, height: 20, marginTop: 4 }}>
              <Text style={styles.titleContent}>排序</Text>
              <View style={styles.line} /> 
            </View> */}
            <View style={{ flex: 2, textAlign: 'center', borderRightColor: '#ffffff', borderRightWidth: 3, height: 20, marginTop: 4 }}>
              <Text style={styles.titleContent}>企业名称</Text>
              {/* <View style={styles.line} /> */}
            </View>
            <View style={{ flex: 2, textAlign: 'center', borderRightColor: '#ffffff', borderRightWidth: 3, height: 20, marginTop: 4 }}>
              <Text style={styles.titleContent}>销售(万元)</Text>
              {/* <View style={styles.line} /> */}
            </View>
            {/* <View style={{ flex: 2, textAlign: 'center',  height: 20, marginTop: 4 ,borderRightColor: '#ffffff', borderRightWidth: 3}}>
              <Text style={styles.titleContent}>纳税(元)</Text>
            </View> */}
            <View style={{ flex: 2, textAlign: 'center',  height: 20, marginTop: 4 }}>
                <Text style={styles.titleContent}>销售排名</Text>
            </View>
            {/* <View style={{ flex: 2, textAlign: 'center', height: 20, marginTop: 4}}>
              <Text style={styles.titleContent}>纳税排名</Text>
            </View> */}
            {/* {
              this.state.realTimeSort? 
              <View style={{ flex: 2, textAlign: 'center', height: 20, marginTop: 4,borderLeftColor:'#ffffff',borderLeftWidth: 3}}>
              <Text style={styles.titleContent}>纳税排名</Text>
            </View>:null
            } */}
          </View>
      )
  }
  
}
  render () {
    const renderHeader = () => {
      if (this.state.refreshing) return <View  />
      if (!this.state.error) {
        if (this.state.data.length > 0) return <View />
        return (
          <View style={{ height: 40,  alignItems: 'center', justifyContent: 'center' }}>
            <Text>没有数据，换个关键词试试</Text>
          </View>
        )
      }
      return (
        <View style={{ alignItems: 'center', padding: 20 }}>
          <Text style={{ color: '#FFF', fontSize: 14, marginBottom: 6 }}>{this.state.error.message}</Text>
          <Text style={{ color: '#FFF', fontSize: 12 }}>下拉可重新加载</Text>
        </View>
      )
    }
    const renderFooter = () => {
      if (this.state.loading) {
        return (
          <View style={{ paddingTop: 20 }} >
            <ActivityIndicator />
          </View>
        )
      }
      if (!this.state.loadingError) {
        return <View style={{ paddingTop: 20 }} />
      }
      return (
        <TouchableOpacity style={{ alignItems: 'center', padding: 20 }} onPress={this.loadMoreData}>
          <Text style={{ color: '#FFF', fontSize: 14, marginBottom: 6 }}>{this.state.loadingError.message}</Text>
          <Text style={{ color: '#FFF', fontSize: 12 }}>点击可重新加载</Text>
        </TouchableOpacity>
      )
    }
    // const { width } = Dimensions.get('window')
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.select}>
            <View style={styles.selectContainer}>
              <Text style={styles.selectText}>显示简称：</Text>
              <Switch
                style={styles.switch}
                trackColor={{ false: '#FFFFFF', true: '#FFFFFF' }}
                thumbColor='#555657'
                value={this.state.showShortName}
                onValueChange={(value) => this.switchValue(value, { showShortName: value }, 'shortName')}
              />
            </View>
            {/* <View style={styles.selectContainer}>
              <Text style={styles.selectText}>实时排序：</Text>
              <Switch
                style={styles.switch}
                trackColor={{ false: '#FFFFFF', true: '#FFFFFF' }}
                thumbColor='#555657'
                value={this.state.realTimeSort}
                onValueChange={(value) => this.switchValue(value, { realTimeSort: value }, 'realTime')}
              />
            </View> */}
            <View style={styles.selectContainer}>
              <Picker
                selectedValue={this.state.year}
                style={{
                  padding: 0,
                  width: 110,
                  // fontSize: 12,
                  height: 30,
                  color: 'white',
                }}
                onValueChange={(itemValue, itemIndex) => this.handleOnYearChange(itemValue)}
                itemStyle={{ marginRight: 0 }}
              >
                {this.renderYears()}
              </Picker>
            </View>
            {/* <TouchableOpacity onPress={this.yearChoose} style={styles.selectContainer}>
              <Text style={styles.selectText}>年份:</Text>
              <Text style={{ color: 'white', marginLeft: 10 }}>{this.state.year}</Text>
              <View style={{ marginLeft: 10 }}>
                <Icons.DropDown size={40} />
              </View>
            </TouchableOpacity> */}
          </View>
          {this.renderTitle()}
        </View>
        <View style={styles.list}>
        <PromiseView
              promise={this.state.promise}
              onStateChange={this.state.promiseHandle}
            />
            <PromiseView
              promise={this.state.loadMorePromise}
              onStateChange={this.state.loadMorePromiseHandle}
            />
          <FlatList
          //  keyExtractor={(item, index) => String(item.entId)}
            extraData={this.state}
            data={this.state.data}
            renderItem={this.state.renderItem}
            refreshing={this.state.refreshing}
            // onRefresh={()=>this.getCompanyList()}
            ListHeaderComponent={renderHeader}
            ListFooterComponent={renderFooter}
            onEndReached={()=>this.loadMoreData()}
          />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    height: 100,
    backgroundColor: '#147dd5'
  },
  select: {
    height: 50,
    marginTop: 20,
    paddingLeft: 13,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  selectContainer: {
    width: 130,
    height: 30,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 30,
  },
  selectText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
    paddingLeft: 5
  },
  switch: {
    transform: [{ scaleX: 1 }, { scaleY: 1 }],
    marginRight: 0,
    fontSize: 18,
  },
  title: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 30,
    flex: 1
  },
  titleContent: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center'
  },
  line: {
    borderWidth: 1,
    borderColor: '#fff',
    marginTop: 4,
    height: 15
  },
  listContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 30,
    paddingTop: 5
  },
  order: {
    flex: 1,
    textAlign: 'center',
    paddingTop: 5
  },
  name: {
    flex: 2,
    textAlign: 'center',
    fontSize:14,
    paddingTop: 5
  },
  sale: {
    flex: 2,
    textAlign: 'center',
    fontSize:14,
    color:'#007BD8',
    paddingTop: 5
  },
  tax: {
    flex: 2,
    textAlign: 'center',
    fontSize:14,
    color:'#007BD8',
    paddingTop: 5
  }
})
