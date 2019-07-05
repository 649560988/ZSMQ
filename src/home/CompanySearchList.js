/**
 * 企业搜索列表
 */

import React from 'react'
import {
  ActivityIndicator,
  TextInput,
  SafeAreaView,
  FlatList,
  Text,
  View,
  Dimensions,
  Switch,
  TouchableOpacity,
  Button,
  Alert
} from 'react-native'
import styled from 'styled-components'
import * as Icons from '../icons'
import request from '../request'
import { ThemeContext } from '../Theme'
import { HeaderSearch } from './HeaderSearch'
import { PromiseView } from '../components'

const CompanySearchItemCard = styled.TouchableOpacity`
  background-color: #FFF;
  /* box-shadow: 2px 5px 0px #000; */
  elevation: 5;
  box-shadow: 10px 5px 5px black;
  border-left-width: 8px;
  border-color: #147dd5;
  padding: 15px 40px;
  margin-bottom: 20px;
`

/**
 * 企业查询结果卡片
 * @param {*} props
 * @returns {React.ReactElement}
 */
function CompanySearchItem (props) {
  return (
    <CompanySearchItemCard onPress={props.onPress}>
      <View style={{ marginBottom: 15 }}>
        <Text style={{ fontSize: 18, color: '#147dd5' }}>
          {props.item.entName}
        </Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View>
          <Text style={{ fontSize: 14 }}>法定代表人</Text>
          <Text style={{ fontSize: 14, color: '#147dd5' }}>{props.item.corporation || '-'}</Text>
        </View>
        <View style={{ height: 30, paddingTop: 4 }}>
          <View
            style={{
              width: 2,
              height: '100%',
              backgroundColor: '#888'
            }}
          />
        </View>
        <View>
          <Text style={{ fontSize: 14 }}>企业联系人</Text>
          <Text style={{ fontSize: 14, color: '#147dd5' }}>{props.item.contacts || '-'}</Text>
        </View>
      </View>
    </CompanySearchItemCard>
  )
}

export class CompanySearchList extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const initialSearchText = navigation.getParam('preInputText') || function noop () { }
    const onSearchChangeText = navigation.getParam('onSearchChangeText') || function noop () { }
    const onPressSearch = navigation.getParam('onPressSearch') || function noop () { }

    return {
      headerTitle: (
        <HeaderSearch
          placeholder={'企业搜索'}
          defaultValue={initialSearchText}
          onChangeText={onSearchChangeText}
          onSubmit={onPressSearch}
          style={{
            height: 40,
            width: Dimensions.get('window').width - 64
          }}
        />
      ),
      headerTitleStyle: {
        flex: 1,
        textAlign: 'center',
        fontSize: 23,
        color: 'white'
      },
      headerStyle: {
        backgroundColor: '#147DD5',
        elevation: 0
      },
      headerBackImage: <View><Icons.BackIcon size={20} /></View>
    }
  }

  state = {
    refreshing: false,
    searchText: '',
    data: []
  }

  componentDidMount () {
    const { navigation } = this.props
    navigation.setParams({
      onSearchChangeText: (searchText) => {
        this.setState({
          searchText
        })
      },
      onPressSearch: ({ text }) => {
        this.refresh({
          searchText: text
        })
      }
    })
    const preInputText = navigation.getParam('preInputText')
    if (preInputText) {
      this.refresh({
        searchText: preInputText
      })
    }
  }

  componentWillUnmount () {
    this._unmounted = true
  }

  refresh = (options = { }) => {
    if (this.state.refreshing) return
    const searchText = options.searchText || this.state.searchText || ''
    this.setState({
      loadingEnd: false,
      pageNo: 1,
      searchText,
      refreshing: true,
      promise: request(`/v1/enterprises/base/selectByEntName/${searchText}?pageNo=0&pageSize=10`, {
        method: 'GET'
      }),
      promiseHandle: (state, res) => {
        if (state === 'resolved') {
          this.setState({
            error: null,
            refreshing: false,
            data: res.data.list
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

  loadMoreData = (options = {}) => {
    if (this.state.loading || this.state.loadingEnd) return
    const searchText = options.searchText || this.state.searchText || ''
    const { pageNo, data } = this.state
    this.setState({
      pageNo: pageNo + 1,
      searchText,
      loading: true,
      loadMorePromise: request(`/v1/enterprises/base/selectByEntName/${searchText}?pageNo=${pageNo + 1}&pageSize=10`, {
        method: 'GET'
      }),
      loadMorePromiseHandle: (state, res) => {
        if (state === 'resolved') {
          this.setState({
            loadingError: null,
            loading: false,
            loadingEnd: res.data.list.length < 10,
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

  render () {
    const { navigation } = this.props

    function handlePressCompanyCard (e, item) {
      navigation.navigate('CompanyDetails', item)
    }

    function renderItem ({ item, index }) {
      return (
        <CompanySearchItem
          onPress={e => handlePressCompanyCard(e, item)}
          item={item}
          index={index}
        />
      )
    }

    const renderHeader = () => {
      if (this.state.refreshing) return <View style={{ paddingTop: 20 }} />
      if (!this.state.error) {
        if (this.state.data.length > 0) return <View style={{ paddingTop: 20 }} />
        return (
          <View style={{ height: 40, padding: 20, alignItems: 'center', justifyContent: 'center' }}>
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

    return (
      <ThemeContext.Consumer>
        {(theme) => (
          <SafeAreaView style={{ flex: 1, backgroundColor: '#f4f4f4' }}>
            <PromiseView
              promise={this.state.promise}
              onStateChange={this.state.promiseHandle}
            />
            <PromiseView
              promise={this.state.loadMorePromise}
              onStateChange={this.state.loadMorePromiseHandle}
            />
            <FlatList
              style={{
                flex: 1,
                paddingBottom: 20
              }}
              keyExtractor={(item, index) => String(item.organizationalCode)}
              refreshing={this.state.refreshing}
              onRefresh={this.refresh}
              onEndReached={this.loadMoreData}
              data={this.state.data}
              ListHeaderComponent={renderHeader}
              ListFooterComponent={renderFooter}
              renderItem={renderItem}
            />
          </SafeAreaView>
        )}
      </ThemeContext.Consumer>

    )
  }
}
