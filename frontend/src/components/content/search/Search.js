/* ************************************************************************** */
/*                                                                            */
/*  Search.js                                                                 */
/*                                                                            */
/*   By: elhmn <www.elhmn.com>                                                */
/*             <nleme@live.fr>                                                */
/*                                                                            */
/*   Created: Thu Jan 01 01:00:00 1970                        by elhmn        */
/*   Updated: Sun Jun 23 13:50:35 2019                        by bmbarga      */
/*                                                                            */
/* ************************************************************************** */

import	React from 'react';
import	{ Modal } from 'antd';
import	SearchActionDetail from './SearchActionDetail';
import	SearchActionList from './SearchActionList';
import	UserDetail from '../profile/UserDetail.js';
import  { AppConsumer } from '../../store/AppContext';

import	'../../../css/SearchPage.css'

class	Search extends React.Component
{
	getSearch(value)
	{
		let search = {};

		value = value.slice(1);
		const params = value.split('&');

		params.forEach((e) => {
			e = e.split('=');
			search[e[0]] = e[1];
		});

		return (search);
	}

	constructor(props)
	{
		super(props);

		const search = this.getSearch(props.location.search);

		this.state = {
			mustShowSearchActionDetail: search.actionid !== undefined,
			searchValue: search.value
						|| (props.location.state
						&& (props.location.state.search || {}).value),
			searchCity: search.city,
			searchCountry: search.country,
			actionData: {...((props.location.state
							&& props.location.state.actionData)
						|| props.actionData || {})},
			actionId: search.actionid,
		};
	}

	showSearchPage()
	{
		window.scrollTo(0, 0);
		this.props.history.push('/search');
		this.setState({mustShowSearchActionDetail: false, actionData: {}});
	}

	showSearchActionDetailPage(data)
	{
		window.scrollTo(0, 0);
		this.props.history.push('/search?actionid=' + data.id);
		this.setState({mustShowSearchActionDetail: true, actionData: data});
	}

	//Putain c'est laid X)
	render ()
	{
	    const { userDetailModalVisible } = this.props.store;
	    const { toggleUserDetailModal } = this.props.store.actions;

		return (
		    <React.Fragment>
				{(this.state.mustShowSearchActionDetail)
			    ? <SearchActionDetail
				    showSearchPage={() => this.showSearchPage()} actionData={this.state.actionData}
				    changeContentPage={this.props.changeContentPage}
				    actionId={this.state.actionId}
			    />
			    : <SearchActionList
				    searchValue={this.state.searchValue}
				    searchCity={this.state.searchCity}
				    searchCountry={this.state.searchCountry}
                    showSearchActionDetailPage={ (data) => this.showSearchActionDetailPage(data) }
                />}
		        <Modal
                    centered
                    visible={userDetailModalVisible}
                    onOk={toggleUserDetailModal}
                    onCancel={toggleUserDetailModal}
                    >
                    <UserDetail/>
                </Modal>
		    </React.Fragment>
			);
	}
}

export default (props) => {
	return (
		<AppConsumer>
		{
			(store) => <Search {...props} store={store}/>
		}
		</AppConsumer>
	);
}
