/**
 * 财务信息部分
 * ys add
 */
import React , {Component} from 'react'
import {View,Text,ScrollView,Dimensions,StyleSheet,Table,Row,Picker ,FlatList} from 'react-native'
import request from '../request'
export class FinanceInformation extends Component{
    constructor(props){
        super(props)
        this.state={
          corporation:'',
          registeredCapital:'',
          establishDate:'',
          entName:'',
          id:'',
          data:[],
          renderItem: ({ item }) => 
          <View>
          <View style={{ width: width, display: 'flex', flexDirection: 'row' }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.order}>{item.month}月</Text> 
            </View>
            <View style={{ flex: 2 }}>
              <Text style={styles.name}>{item.sale}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.sale}>{item.taxes}</Text>
            </View>
            <View style={{ flex: 2 }}>
              <Text style={styles.tax}>{item.sale}</Text>
            </View>
          </View>
        </View>,
       showShortName: false,
       realTimeSort: true,
       year: new Date().getFullYear(),
       now: new Date().getFullYear(),
       list: <View />
        }
    }
    static navigationOptions = ({ navigation }) => {
        return {
          title: '财务信息',
          headerTintColor: '#FFF',
          headerStyle: {
            /**
             * ??
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
      componentDidMount () {
        this.getCompanyInfoByCode()
      }
    /**
   * 根据id和year从后台获取当前企业财税信息
   */
    getCompanyList=(year)=>{
      let url = `/v1/enterprises/finance/selectFinanceByEntId/${this.state.id}/${year}`
      request(url, {
      method: 'GET'
    }).then((res) => {
      if (res) {
        if (res.message === null) {
          let data = []
          res.data.map((item, index) => {
            // item.order = index + 1
            item.key = item.entId.toString()
            data.push(item)
          })
          this.setState({
            data: data
          }, () => {
            this.addToList()
          })
        } else {
          Alert.alert(res.message)
        }
      }
    }).catch((error) => {
      console.log(error)
    })
      }
  /**
   * 根据code从后台获取当前企业信息
   */
  getCompanyInfoByCode = () => {
    let url = `/v1/enterprises/base/${this.props.navigation.state.params.id}`
    request(url, {
      method: 'GET'
    }).then((res) => {
      // console.log(res)
      if (res) {
        if (res.message === '查询成功') {
          this.setState({
            corporation: res.data.corporation,
            registeredCapital:res.data.registeredCapital,
            establishDate:res.data.establishDate,
            entName:res.data.entName,
            id:res.data.id
          }, () => {
            this.addToList()
          })
        } else {
          Alert.alert(res.message)
        }
      } else {
        this.props.navigation.navigate('FinanceInformation')
      }
    }).catch((error) => {
      console.log(error)
    })
  }
  /**
   * 将后台的数据填入list
   */
  addToList = () => {
    const { width ,height} = Dimensions.get('window')
      this.setState({
        renderItem: ({ item }) =>
         <View>
          <View style={{ width: width, display: 'flex', flexDirection: 'row' }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.order}>{item.month}月</Text> 
            </View>
            <View style={{ flex: 2 }}>
              <Text style={styles.name}>{item.sale}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.sale}>{item.taxes}</Text>
            </View>
            <View style={{ flex: 2 }}>
              <Text style={styles.tax}>{item.sale}</Text>
            </View>
          </View>
        </View>
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
    return Array.from({ length: endYear - 1990 }, (v, k) => {
      return k + 1990
    }).map(year => {
      return (
        <Picker.Item key={year} label={String(year)} value={year} />
      )
    })
  }
  /**
   * 返回页面上部的蓝色区域
   */
  renderHeader = () => {
    const { width ,height} = Dimensions.get('window')
    let temp = new Date(Number(this.state.establishDate))
    let creationDate = temp.getFullYear() + '年' + (temp.getMonth() + 1) + '月' + temp.getDate() + '日'
    return (
      <View style={{ width: width, backgroundColor: '#147DD5', display: 'flex', flexDirection: 'column' }}>
        <View style={{ flex: 1, marginLeft: 'auto', marginRight: 'auto', marginBottom: 5, display: 'flex', flexDirection: 'row' }}>
          
          <Text style={{ color: 'white', fontSize: 18, textAlign: 'center', paddingRight: 20 }}>{this.state.entName}</Text>
        </View>
        <View style={{ flex: 2, display: 'flex', flexDirection: 'row', marginLeft: 'auto', marginRight: 'auto', marginBottom: 8 , marginTop: height / 47.862}}>
          <View style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: 'white', fontSize: 14, textAlign: 'center' }}>法定代表人</Text>
            </View>
            <View style={{ flex: 2, marginTop: 5 }}>
              <Text style={{ color: 'white', fontSize: 14, textAlign: 'center' }}>{this.state.corporation}</Text>
            </View>
          </View>
          <View style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: 'white', fontSize: 14, textAlign: 'center' }}>注册资本</Text>
            </View>
            <View style={{ flex: 2, marginTop: 5 }}>
              <Text style={{ color: 'white', fontSize: 14, textAlign: 'center' }}>{this.state.registeredCapital}</Text>
            </View>
          </View>
          <View style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: 'white', fontSize: 14, textAlign: 'center' }}>成立日期</Text>
            </View>
            <View style={{ flex: 2, marginTop: 5 }}>
              <Text style={{ color: 'white', fontSize: 14, textAlign: 'center' }}>{creationDate}</Text>
            </View>
          </View>
        </View>
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
                itemStyle={{ marginRight: 0, backgroundColor: 'red' }}
              >
                {this.renderYears()}
              </Picker>
            </View>
      </View>
    )
  }
   /**
   * 表格
   */
  detailTable=()=>{
  }
    render(){
      const { width ,height} = Dimensions.get('window')
        return(
          <ScrollView style={{ flex: 1, backgroundColor: '#F4F4F4' }}>
            {this.renderHeader()}
          <View style={styles.container}>
          <View >
            <View style={styles.title}>
              <View style={{ flex: 1, textAlign: 'center', borderRightColor: '#ffffff', borderRightWidth: 3, height: 20, marginTop: 4 }}>
                <Text style={styles.titleContent}>月份</Text>
              </View>
              <View style={{ flex: 2, textAlign: 'center', borderRightColor: '#ffffff', borderRightWidth: 3, height: 20, marginTop: 4 }}>
                <Text style={styles.titleContent}>月收入（元）</Text>
              </View>
              <View style={{ flex: 1, textAlign: 'center', borderRightColor: '#ffffff', borderRightWidth: 3, height: 20, marginTop: 4 }}>
                <Text style={styles.titleContent}>税收(元)</Text>
              </View>
              <View style={{ flex: 2, textAlign: 'center', height: 20, marginTop: 4 }}>
                <Text style={styles.titleContent}>已扣除税收(元)</Text>
              </View>
            </View>
          </View>
          <View style={styles.list}>
            <FlatList
              extraData={this.state}
              data={this.state.data}
              renderItem={this.state.renderItem}
            />
          </View>
        </View>
          </ScrollView>
          
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
    // marginRight: 5,
    // borderRadius: 50,
    // borderWidth: 1,
    // borderColor: '#fff'
  },
  selectText: {
    fontSize: 12,
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
    color: 'black',
    fontSize: 16,
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
    textAlign: 'center'
  },
  name: {
    flex: 2,
    textAlign: 'center'
  },
  sale: {
    flex: 2,
    textAlign: 'center'
  },
  tax: {
    flex: 2,
    textAlign: 'center'
  }
})