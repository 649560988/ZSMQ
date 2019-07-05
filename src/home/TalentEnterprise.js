/**
 * 财税信息列表
 */

import React from 'react'
import {
  ScrollView,
  View,
  StyleSheet,
  FlatList,
  Switch,
  Text,
  Dimensions,
  Alert
} from 'react-native'
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
export class TalentEnterprise extends React.Component {
  constructor (props) {
    super(props)
    const { width } = Dimensions.get('window')
    this.state = {
      isOn: false,
      sort: 'desc',
      sortParam: 'selectedDate',
      dataList: [],
      refreshing: false,
      order:1,
      renderItem:({item,index})=>
      {
        if(index%2===0){
          return(
            <CompanySearchItemCard onPress={()=>this.handlePressCompanyCard(item)}>
              <View style={{  width: '100%',height:'100%', paddingTop:25, display: 'flex', flexDirection: 'row' }} onPress={item.onPress}>
              <Text style={styles.order}>{item.order}</Text>
              <Text style={styles.one}>{this.state.isOn ? item.entShortName:item.entName}</Text>
              <Text style={styles.two}>{item.talent}</Text>
              <Text style={styles.three}>{item.project}</Text>
              <Text style={styles.four}>{item.date}</Text>
              </View>
            </CompanySearchItemCard>
          )
        }else{
          return(
               <CompanySearchItemCard onPress={()=>this.handlePressCompanyCard(item)}>
              <View style={{  width: '100%',height:'100%', paddingTop:25, display: 'flex', flexDirection: 'row',backgroundColor:'#F5F6F8' }} onPress={item.onPress}>
              <Text style={styles.order}>{item.order}</Text>
              <Text style={styles.one}>{this.state.isOn ? item.entShortName:item.entName}</Text>
              <Text style={styles.two}>{item.talent}</Text>
              <Text style={styles.three}>{item.project}</Text>
              <Text style={styles.four}>{item.date}</Text>
              </View>
            </CompanySearchItemCard>
          )
        }
      },
      
    }
  }
  static navigationOptions = ({ navigation }) => {
    return {
      title: '人才企业',
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
      headerTitleStyle: {
        flex: 1,
        textAlign: 'center',
        fontSize: 23

      },
      headerBackTitleStyle: {
        color: '#FFF'
      },
      headerRight: <View />
    }
  }

  switchValue (e) {
    this.setState(
      {
        isOn: !this.state.isOn
      }
    )
  }

  componentDidMount () {
    this.getDataList()
  }

  getDataList () {
    if (this.state.refreshing) return
    this.setState({
      loadingEnd: false,
      pageNo: 1,
      refreshing: true,
      promise: request('/v1/enterprises/talent?pageNo=1&pageSize=200&sort=' + this.state.sort + '&sortParam=' + this.state.sortParam, {
        method: 'GET'
      }),
      promiseHandle: (state, res) => {
        if (state === 'resolved') {
          // let dataList=[]
          let order = 1
          res.data.list.map((val) => {
            let time = new Date(val.selectedDate)
            let year = time.getFullYear()
            // let month = time.getMonth() + 1
            // let day = time.getDate()
            // let hours = time.getHours()
            // let minutes = time.getMinutes()
            // let seconds = time.getSeconds()
            val.date = year
            // + '/' + (month < 10 ? '0' + month : month)
            // + '/' + (day < 10 ? '0' + day : day)
            // + ' ' + (hours < 10 ? '0' + hours : hours)
            // + ':' + (minutes < 10 ? '0' + minutes : minutes)
            // + ':' + (seconds < 10 ? '0' + seconds : seconds)
            // val.key = val.entId.toString()
            val.order = order
            val.entName = val.entName.length > 4 ? val.entName.substring(0, 4) + '...' : val.entName
            val.entShortName=val.entShortName
            // val.entShortName = val.entShortName.length > 4 ? val.entShortName.substring(0, 4) + '...' : val.entShortName
            val.project = val.project.length > 5? val.project.substring(0, 5) + '...' : val.project
            val.talent = val.talent.length > 4 ? val.talent.substring(0, 4) + '...' : val.talent
            order++
          })
          this.setState({
            error: null,
            refreshing: false,
            dataList: res.data.list,
            order:order
          })
        } else if (state === 'rejected') {
          this.setState({
            error: res,
            refreshing: false,
            dataList: [],
            order:order
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
    const { pageNo, dataList ,order} = this.state
    this.setState({
      pageNo: pageNo + 1,
      loading: true,
      loadMorePromise: request(`/v1/enterprises/talent?pageNo=${pageNo+1}&pageSize=200&sort=` + this.state.sort + `&sortParam=` + this.state.sortParam, {
        method: 'GET'
      }),
      loadMorePromiseHandle: (state, res) => {
        if (state === 'resolved') {
          let order = this.state.order
          res.data.list.map((val) => {
            let time = new Date(val.selectedDate)
            let year = time.getFullYear()
            // let month = time.getMonth() + 1
            // let day = time.getDate()
            // let hours = time.getHours()
            // let minutes = time.getMinutes()
            // let seconds = time.getSeconds()
            val.date = year
            // + '/' + (month < 10 ? '0' + month : month)
            // + '/' + (day < 10 ? '0' + day : day)
            // + ' ' + (hours < 10 ? '0' + hours : hours)
            // + ':' + (minutes < 10 ? '0' + minutes : minutes)
            // + ':' + (seconds < 10 ? '0' + seconds : seconds)
            // val.key = val.entName
            val.order = order
            val.entName = val.entName.length > 4 ? val.entName.substring(0, 4) + '...' : val.entName
            val.entShortName=val.entShortName
            // val.entShortName = val.entShortName.length > 4 ? val.entShortName.substring(0, 4) + '...' : val.entShortName
            val.project = val.project.length > 5 ? val.project.substring(0, 5) + '...' : val.project
            val.talent = val.talent.length > 4 ? val.talent.substring(0, 4) + '...' : val.talent
            order++
          })
          this.setState({
            loadingError: null,
            loading: false,
            loadingEnd: res.data.list.length < 200,
            dataList: [...dataList, ...res.data.list],
            order:order
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
   * 详情也跳转
   * 
   */
  handlePressCompanyCard=(item)=>{
    const { navigation } = this.props
    let url=`/v1/enterprises/base/queryOneById/${item.id}`
    request(url,{
      method:'GET'
    }).then((res)=>{
      if(res.message==='查询成功'){
        navigation.navigate('CompanyDetails', res.data)
      }
    })
  }
  getList () {
    const renderHeader = () => {
      if (this.state.refreshing) return <View  />
      if (!this.state.error) {
        if (this.state.dataList.length > 0) return <View  />
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
    return  <View style={styles.list}>
    <PromiseView
              promise={this.state.promise}
              onStateChange={this.state.promiseHandle}
            />
            <PromiseView
              promise={this.state.loadMorePromise}
              onStateChange={this.state.loadMorePromiseHandle}
            />
    <FlatList
      extraData={this.state}
      data={this.state.dataList}
      renderItem={this.state.renderItem}
      onEndReached={()=>this.loadMoreData()}
      ListHeaderComponent={renderHeader}
    />
    </View>
  }

  render () {
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
                value={this.state.isOn == true}
                onValueChange={(e) => this.switchValue(e)}
              />
            </View>
          </View>
          <View style={styles.title}>
            <Text style={styles.tone1}>排序</Text>
            <View style={styles.line} />
            <Text style={styles.tone2}>企业名称</Text>
            <View style={styles.line} />
            <Text style={styles.tone3}>人才(团队)</Text>
            <View style={styles.line} />
            <Text style={styles.tone4}>项目</Text>
            <View style={styles.line} />
            <Text style={styles.tone5}>入选时间</Text>
          </View>
        </View>
        <View style={styles.list}>
          {this.getList()}
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
    flexDirection: 'row-reverse',
    alignItems: 'center'
  },
  selectContainer: {
    width: 120,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 30,
    marginRight: 13,
    // borderRadius: 50,
    // borderWidth: 1,
    // borderColor: '#fff'
  },
  selectText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
    paddingLeft: 5
  },
  switch: {
    transform: [{ scaleX: 1 }, { scaleY: 1 }],
    marginRight: 7
  },
  title: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 30,
    flex: 1
  },
  titleContent: {
    color: '#fff',
    fontSize: 14
  },
  line: {
    borderWidth: 1,
    borderColor: '#fff',
    marginTop: 4,
    height: 15,
    fontSize:14,
  },
  listContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 30,
    paddingTop: 5
  },
  order: {
    flex: 1,
    // textAlign: 'center'
    fontSize:14,
    paddingTop: 5,
    paddingLeft: 10,
    color:'#007BD8',
    fontWeight:'bold',
  },
  one: {
    flex: 2,
    textAlign: 'center',
    // paddingRight: 5
    fontSize:14,
    paddingTop: 5
  },
  two: {
    flex: 2,
    textAlign: 'center',
    // paddingRight: 5
    fontSize:14,
    color:'#007BD8',
    paddingTop: 5
  },
  three: {
    flex: 2,
    textAlign: 'center',
    // paddingRight: 25
    fontSize:14,
    color:'#007BD8',
    paddingTop: 5
  },
  four: {
    flex: 2,
    textAlign: 'center',
    paddingRight: 20,
    fontSize:14,
    color:'#007BD8',
    paddingTop: 5
  },
  tone1:{
    flex: 1,
    textAlign: 'center',
    // paddingRight: 5,
    fontSize:14,
    borderColor: '#fff',
    color:'#fff',
  },
  tone2:{
    flex: 2,
    textAlign: 'center',
    // paddingRight: 5,
    fontSize:14,
    borderColor: '#fff',
    color:'#fff',
  },
  tone3:{
    flex: 2,
    textAlign: 'center',
    // paddingRight: 5,
    fontSize:14,
    borderColor: '#fff',
    color:'#fff',
  },
  tone4:{
    flex: 2,
    textAlign: 'center',
    // paddingRight: 5,
    fontSize:14,
    borderColor: '#fff',
    color:'#fff',
  },
  tone5:{
    flex: 2,
    textAlign: 'center',
    // paddingRight: 5,
    fontSize:14,
    borderColor: '#fff',
    color:'#fff',
  }
})
