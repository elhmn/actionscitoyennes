/* ************************************************************************** */
/*                                                                            */
/*  AppContext.js                                                             */
/*                                                                            */
/*   By: elhmn <www.elhmn.com>                                                */
/*             <nleme@live.fr>                                                */
/*                                                                            */
/*   Created: Thu Jan 01 01:00:00 1970                        by elhmn        */
/*   Updated: Sun Jun 23 10:51:09 2019                        by bmbarga      */
/*                                                                            */
/* ************************************************************************** */

import	React from 'react';
import	{ message } from 'antd';
import Config from '../../config.js'
import { JsonRequest } from '../../utilities/DataHandler';

export const	AppContext = React.createContext();

export class	AppProvider extends React.Component
{

	constructor(props)
	{
		super(props);
		this.state =
		{
			user: JSON.parse(localStorage.getItem('user') || "[{}]")[0],
			token: localStorage.getItem('token'),
			userid: localStorage.getItem('userid'),
			actions: {
				fetchUserData: this.fetchUserData.bind(this),
				updateToken: this.updateToken.bind(this),
				toggleUserDetailModal: this.toggleUserDetailModal.bind(this),
			},
            userDetailModalVisible: false,
			userDetailId: null,
		};
	}

    toggleUserDetailModal(id = null)
    {
        this.setState({
            userDetailId: id,
            userDetailModalVisible: !this.state.userDetailModalVisible
        });
    }

	updateToken()
	{
		this.setState({
			token: localStorage.getItem('token'),
			userid: localStorage.getItem('userid'),
		});
	}

	fetchUserData(onSuccess, onError)
	{
		const token = localStorage.getItem('token');
		const userid = localStorage.getItem('userid');

		const onsuccess = (response) => {
			let data =  response;
            localStorage.setItem('user', data);
			data = JSON.parse(data);
			onSuccess && onSuccess();
			this.setState({
				user: (data || [{}])[0]
			});
		};

		const onerror = (response) => {
			message.error('could not get user data');
			onError && onError();
		};

		JsonRequest({
			url: `${Config.apiDomainName}/v1/private/${token}/users/${userid}`,
			method: 'get',
			onsuccess,
			onerror
		});
	}

	render()
	{
		return (
			<AppContext.Provider value={this.state}>
			{this.props.children}
			</AppContext.Provider>
		);
	}
};

export class	AppConsumer extends React.Component
{
	render()
	{
		return (
			<AppContext.Consumer>
			{this.props.children}
			</AppContext.Consumer>
		);
	}
}
