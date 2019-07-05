/**
 * 销售信息列表
 */

import React from 'react'
import { FlatList, Picker, Text, View, Dimensions, StyleSheet, Switch, Alert } from 'react-native'
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
  height: 70px;
`

export class FiscalTaxList extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: '销售',
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
    const { width,height } = Dimensions.get('window')
    this.state = {
      data: [],
      detail:null,
      renderItem: ({ item,index }) => 
      {
        if(index%2===0){
        return(
        <CompanySearchItemCard onPress={()=>this.handlePressCompanyCard(item)}>
    
        <View style={{ width: '100%',height:'100%', paddingTop:25,display: 'flex', flexDirection: 'row' ,backgroundColor: '#F5F6F8'}} onPress={item.onPress}>
              <View style={{ flex: 1,height:40 }}>
                <Text style={styles.order}>{item.order}</Text>
              </View>
              <View style={{ flex: 4 ,height:40}}>
              <Text style={styles.name}>{item.entName.length > 10 ? item.entName.substring(0, 10) + '...' : item.entName}</Text>
              </View>
              <View style={{ flex: 2 ,height:40}}>
              <Text style={styles.sale}>{item.sale}</Text>
              </View>
        </View></CompanySearchItemCard>)}
        else{
          return(
              <CompanySearchItemCard onPress={()=>this.handlePressCompanyCard(item)}>
                <View style={{ width: '100%',height:'100%',  paddingTop:25,display: 'flex', flexDirection: 'row' ,backgroundColor: '#FFF'}} onPress={item.onPress}>
                <View style={{ flex: 1,height:20 }}>
                <Text style={styles.order}>{item.order}</Text>
            </View>
            <View style={{ flex: 4 ,height:20}}>
            <Text style={styles.name}>{item.entName.length > 10 ? item.entName.substring(0, 10) + '...' : item.entName}</Text>
            </View>
            <View style={{ flex: 2 ,height:20}}>
            <Text style={styles.sale}>{item.sale}</Text>
            </View>
      </View></CompanySearchItemCard>
          )
        }
      },
      showShortName: false,
      refreshing: false,
      realTimeSort: true,
      year: new Date().getFullYear(),
      now: new Date().getFullYear(),
      list: <View />
    }
  }

  componentDidMount () {
  }
  /**
   * 根据名称从后台查询企业信息
   */
  getCompanyInfo = (name) => {
    let url = `/v1/enterprises/base/selectByEntName/${name}?pageNo=1&pageSize=10`
    request(url, {
      method: 'GET'
    }).then((res) => {
      console.log(res)
      if (res) {
        if (res.message === '查询成功') {
          this.setState({
            detail: res.data.list[0]
          }
          )
        } else {
          Alert.alert('查询出错')
        }
      } else {
        
      }
    }).catch((error) => {
      console.log(error)
    })
  }
  /**
   * 根据entid从后台查询企业信息
   */
  getCompanyInfoById = (entId) => {
    let url = `/v1/enterprises/base/queryOneById/${entId}`
    request(url, {
      method: 'GET'
    }).then((res) => {
      console.log(res)
      if (res) {
        if (res.message === '查询成功') {
          this.setState({
            detail: res.data
          }
          )
          const { navigation } = this.props
          navigation.navigate('CompanyDetails', this.state.detail)
        } else {
          Alert.alert(res.message)
        }
      } else {
        
      }
    }).catch((error) => {
      console.log(error)
    })
  }
  /**
   * 将后台的数据填入list
   */
  addToList = () => {
    const { width } = Dimensions.get('window')
    if (this.state.showShortName) {
      this.setState({
        renderItem: ({ item ,index}) => 
        {
        if(index%2===0){
          return(
          <CompanySearchItemCard onPress={()=>this.handlePressCompanyCard(item)}>
      
          <View style={{ width: '100%',height:'100%',paddingTop:25,display: 'flex', flexDirection: 'row' ,backgroundColor: '#F5F6F8'}} onPress={item.onPress}>
                <View style={{ flex: 1,height:40 }}>
                  <Text style={styles.order}>{item.order}</Text>
                </View>
                <View style={{ flex: 4 ,height:40}}>
                <Text style={styles.name}>{item.entShortName}</Text>
                </View>
                <View style={{ flex: 2 ,height:40}}>
                <Text style={styles.sale}>{item.sale}</Text>
                </View>
          </View></CompanySearchItemCard>)}
          else{
            return(
                <CompanySearchItemCard onPress={()=>this.handlePressCompanyCard(item)}>
                  <View style={{ width: '100%',height:'100%', paddingTop:25, flexDirection: 'row' ,backgroundColor: '#FFF'}} onPress={item.onPress}>
                  <View style={{ flex: 1,height:20 }}>
                  <Text style={styles.order}>{item.order}</Text>
              </View>
              <View style={{ flex: 4 ,height:20}}>
              <Text style={styles.name}>{item.entShortName}</Text>
              </View>
              <View style={{ flex: 2 ,height:20}}>
              <Text style={styles.sale}>{item.sale}</Text>
              </View>
        </View></CompanySearchItemCard>
            )
          }
        }
      })
    } else {
      this.setState({
        renderItem: ({ item,index }) => 
        {
          if(index%2===0){
            return(
            <CompanySearchItemCard onPress={()=>this.handlePressCompanyCard(item)}>
        
            <View style={{ width: '100%',height:'100%', paddingTop:25,display: 'flex', flexDirection: 'row' ,backgroundColor: '#F5F6F8'}} onPress={item.onPress}>
                  <View style={{ flex: 1,height:40 }}>
                    <Text style={styles.order}>{item.order}</Text>
                  </View>
                  <View style={{ flex: 4 ,height:40}}>
                  <Text style={styles.name}>{item.entName.length > 10 ? item.entName.substring(0, 10) + '...' : item.entName}</Text>
                  </View>
                  <View style={{ flex: 2 ,height:40}}>
                  <Text style={styles.sale}>{item.sale}</Text>
                  </View>
            </View></CompanySearchItemCard>)}
            else{
              return(
                  <CompanySearchItemCard onPress={()=>this.handlePressCompanyCard(item)}>
                    <View style={{ width: '100%',height:'100%', paddingTop:25,display: 'flex', flexDirection: 'row' ,backgroundColor: '#FFF'}} onPress={item.onPress}>
                    <View style={{ flex: 1,height:20 }}>
                    <Text style={styles.order}>{item.order}</Text>
                </View>
                <View style={{ flex: 4 ,height:20}}>
                <Text style={styles.name}>{item.entName.length > 10 ? item.entName.substring(0, 10) + '...' : item.entName}</Text>
                </View>
                <View style={{ flex: 2 ,height:20}}>
                <Text style={styles.sale}>{item.sale}</Text>
                </View>
          </View></CompanySearchItemCard>
              )
            }
          }
      })
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
          this.refresh(now)
        } else {
          this.setState({
            year: this.state.now - 1
          })
          this.refresh(now - 1)
        }
      }
    })
  }
  /**
   * 年份变化时回调
   */
  handleOnYearChange = (year) => {
    if (year !== this.state.now) {
      this.setState({
        year,
        realTimeSort: false
      }, () => {
        this.refresh(year)
      })
    } else {
      this.setState({
        year,
        realTimeSort: true
      }, () => {
        this.refresh(year)
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
   /**
   * 点击跳转
   */
  handlePressCompanyCard=(item)=>{
    this.getCompanyInfoById(item.entId)
    
  }
 /**
   * 刷新
   */
  refresh = (year) => {
    if (this.state.refreshing) return
    this.setState({
      loadingEnd: false,
      pageNo: 1,
      refreshing: true,
      promise: request(`/v1/enterprises/finance/selectFinanceByYear/{year}?pageNo=1&pageSize=20&year=${year}`, {
        method: 'GET'
      }),
      promiseHandle: (state, res) => {
        if (state === 'resolved') {
          if(res.message === '成功'){
            let data = []
            res.data.list.map((item, index) => {
              item.order = index + 1
              item.key = item.entId.toString()
              data.push(item)
            })
            this.setState({
              error: null,
              refreshing: false,
              data: data
            })
          }
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
   *加载更多
   */
  loadMoreData = () => {
    if (this.state.loading || this.state.loadingEnd) return
    const { pageNo, data } = this.state
    this.setState({
      pageNo: pageNo + 1,
      loading: true,
      loadMorePromise: request(`/v1/enterprises/finance/selectFinanceByYear/{year}?pageNo=${pageNo + 1}&pageSize=20&year=${this.state.year}`, {
        method: 'GET'
      }),
      loadMorePromiseHandle: (state, res) => {
        if (state === 'resolved') {
          if(res.message === '成功'){
            let data1 = []
            res.data.list.map((item, index) => {
              item.order = index + 20*(pageNo)
              item.key = item.entId.toString()
              data1.push(item)
            })
            this.setState({
              loadingError: null,
              loading: false,
              loadingEnd: res.data.list.length< 20,
              data: [...data, ...data1]
            })
          }
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
                value={this.state.showShortName}
                onValueChange={(value) => this.switchValue(value, { showShortName: value }, 'shortName')}
              />
            </View>
            <View style={styles.selectContainer}>
              <Text style={styles.selectText}>实时排序：</Text>
              <Switch
                style={styles.switch}
                trackColor={{ false: '#FFFFFF', true: '#FFFFFF' }}
                thumbColor='#555657'
                value={this.state.realTimeSort}
                onValueChange={(value) => this.switchValue(value, { realTimeSort: value }, 'realTime')}
              />
            </View>
            <View style={styles.selectContainer}>
              <Picker
                selectedValue={this.state.year}
                style={{ width: 110, height: 30, color: 'white' }}
                onValueChange={(itemValue, itemIndex) => this.handleOnYearChange(itemValue)}
                mode={'dialog'}
              >
                {this.renderYears()}
              </Picker>
            </View>
          </View>
          <View style={styles.title}>
            <View style={{ flex: 1, textAlign: 'center', borderRightColor: '#ffffff', borderRightWidth: 3, height: 20, marginTop: 4 }}>
              <Text style={styles.titleContent}>排序</Text>
            </View>
            <View style={{ flex: 4, textAlign: 'center', borderRightColor: '#ffffff', borderRightWidth: 3, height: 20, marginTop: 4 }}>
              <Text style={styles.titleContent}>企业名称</Text>
            </View>
            <View style={{ flex: 2, textAlign: 'center',  height: 20, marginTop: 4 }}>
              <Text style={styles.titleContent}>销售(万元)</Text>
            </View>
          </View>
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
            extraData={this.state}
            data={this.state.data}
            renderItem={this.state.renderItem}
            refreshing={this.state.refreshing}
            // onRefresh={()=>this.refresh()}
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
    height: 50,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 30,
    marginRight: 5,
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
    marginRight: 0
  },
  title: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 30,
    flex: 1
  },
  titleContent: {
    color: '#fff',
    fontSize: 18,
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
    color:'#007BD8',
    fontSize:19,
    height: '100%',
    fontWeight:'bold',
  },
  name: {
    flex: 2,
    textAlign: 'center',
    fontSize:17,
    height: '100%',
  },
  sale: {
    flex: 2,
    textAlign: 'center',
    color:'#5FADE6',
    height: '100%',
    fontSize:18
  },
  tax: {
    flex: 2,
    textAlign: 'center'
  },
  even:{
    backgroundColor:'#E6E6FA',
    },
  uneven:{
    backgroundColor:'#F0F8FF',
    }
})
