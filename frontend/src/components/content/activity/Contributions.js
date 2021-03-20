/* ************************************************************************** */
/*                                                                            */
/*  Contributions.js                                                          */
/*                                                                            */
/*   By: elhmn <www.elhmn.com>                                                */
/*             <nleme@live.fr>                                                */
/*                                                                            */
/*   Created: Thu Jan 01 01:00:00 1970                        by elhmn        */
/*   Updated: Mon Apr 15 13:52:17 2019                        by bmbarga      */
/*                                                                            */
/* ************************************************************************** */

import React from 'react';
import	'../../../css/Activity.css';

import {
	Row,
	Col,
	Menu,
	List,
	message,
	Avatar,
	Icon,
	Breadcrumb,
} from 'antd';
import moment from 'moment';

import  { AppConsumer } from '../../store/AppContext';
import Config from '../../../config.js'
import { JsonRequest } from '../../../utilities/DataHandler';
import { Link } from 'react-router-dom';

const ActionList = (props) => {

	return (
		<Row id="activity-container" type="flex" justify="space-around" align="top">
			<Col span={10} xs={22} sm={22} md={10}>
				<List
					bordered={true}
					className="margin-top-50 margin-bottom-50"
					pagination={{pageSize: 7, position: 'both'}}
					total={3}
					locale="aucune action cree"
					itemLayout="horizontal"
					dataSource={props.actions}
					renderItem={ item => (
						<List.Item
							actions={[
								<Link to="/search?"
									to={"/search?actionid=" + item.id}
									onClick={ () => window.scrollTo(0, 0) }>
								ouvrir
								</Link>]}>
						  <List.Item.Meta
							avatar={<Avatar icon="user" src="" />}
							title={
									<Link
									to={"/search?actionid=" + item.id}
									onClick={ () => window.scrollTo(0, 0) }>{item.title}</Link>
							}
							description={
							<React.Fragment>
								<div><b>{item && item.lastname} {item && item.firstname}</b></div>
								<Icon className="margin-top-10 card-meta-icon" type="environment"/>
								{
									(item.address_info || item.street) &&
											(<span>{ (item.address_info || item.street) } | </span>)
								}
								<span>{item && item.city}, </span>
								<span>{item && item.coutry}</span>
								<div>
									<Icon className="card-meta-icon" type="clock-circle"/>
									<span> {item && (moment(item.date).format("LL") || 21/12/2018)} </span>
								</div>
								<p
								className="margin-top-20"
								style={{
										maxWidth: 300,
										overflow: 'hidden',
										whiteSpace: 'nowrap',
										textOverflow:'ellipsis'}}>
								{item.description}
								</p>
							</React.Fragment>
							}
						  />
						</List.Item>
					)}
				>
				</List>
			</Col>
		</Row>
	);
}

class Contributions extends React.Component
{
	constructor(props)
	{
		super(props);
		this.state = {
			actions: [],
			currentAction: undefined,
			isEditing: false,
		}
	}

	fetchContributedActions(id)
	{
		const token = localStorage.getItem('token');

		const onsuccess = (response) => {
			let data = JSON.parse(response);
			if (data.response)
			{
				data = [];
			}
			this.setState({
				actions: data,
			});
		};

		const onerror = (response) => {
			message.error('could not get user data');
		};

		JsonRequest({
			url: `${Config.apiDomainName}/v1/private/${token}/actionscontributed/`,
			method: 'get',
			onsuccess,
			onerror
		});
	}

	componentDidMount()
	{
		this.fetchContributedActions();
	}

	render()
	{
		return (
			<React.Fragment>
				{
					!this.state.isEditing && (
						<ActionList
							actions={this.state.actions}
						/>
					)
				}
			</React.Fragment>
		);
	}
}

export default Contributions;
