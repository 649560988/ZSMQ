/**
 * 企业介绍
 * ys  2019.6.5
 */
import React,{Component} from 'react'
import {View,Text,Button,TextareaItem,RichTextView } from 'react-native'
import request from '../request'
import { Link } from '../components'
export class CompanyDescription extends Component{
    constructor(props){
        super(props)
        this.state={
          introduction:null,
          organizationalCode:null,
        }
    }
    static navigationOptions = ({ navigation }) => {
        return {
          title: '企业介绍',
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
        this.getOrganizationalIntro()
        this.getOrganizationalByUserId()
      }
  /**
  * 根据组织代码获取企业介绍
  */
    getOrganizationalIntro= () => {
        let url = `/v1/enterprises/base/queryEntAbstract/${this.props.navigation.state.params.id}`
        request(url, {
          method: 'GET'
        }).then((res) => {
          console.log(res)
          if (res) {
            if (res.message === '查询成功') {
              this.setState({
                introduction:res.data,
              })
            } else {
              console.log(res.message)
            }
          }
        }).catch((error) => {
          console.log(error)
        })
      }
    /**
  * 根据用户id查询所绑定的企业
  */
    getOrganizationalByUserId=()=>{
      let url = `/v1/enterprises/base/userEnt`
      request(url, {
        method: 'GET'
      }).then((res) => {
        console.log(res)
        if (res) {
          if (res.message === '查询成功') {
            this.setState({
              organizationalCode:res.data.organizationalCode
            })
          } else {
            console.log(res.message)
          }
        }
      }).catch((error) => {
        console.log(error)
      })
    }
    render(){
      if(this.state.organizationalCode==this.props.navigation.state.params.id){
        return(
            <View>
              <Text>
                {this.state.introduction}
              </Text>
              <View style={{alignItems:'center'}}>
              <Text></Text>
              <Link to={{routeName:'CompanyDescriptionEdit',params:{id:this.props.navigation.state.params.id,linkType:1}}}>
                <Text style={{ color: '#147dd5', fontSize: 15 }} >点此编辑..</Text>
              </Link>
              </View>
            </View>
        )
    }else{
       return(
        <View>
        <Text>
          {this.state.introduction}
        </Text>
        </View>
       )   
    }
  }
}