/* ************************************************************************** */
/*                                                                            */
/*  Creations.js                                                              */
/*                                                                            */
/*   By: elhmn <www.elhmn.com>                                                */
/*             <nleme@live.fr>                                                */
/*                                                                            */
/*   Created: Mon Feb 18 07:24:03 2019                        by elhmn        */
/*   Updated: Mon Apr 15 13:51:16 2019                        by bmbarga      */
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
import  Create from '../../content/create/Create';

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
								<a
									onClick={() => props.onEditAction(item)}>
								modifier
								</a>,
								<a
									onClick={() => props.onDeleteAction(item)}>
									supprimer
								</a>]}
						>
						  <List.Item.Meta
							title={
									<Link
									to={"/search?actionid=" + item.id}
									onClick={ () => window.scrollTo(0, 0) }>{item.title}</Link>
							}
							description={
							<React.Fragment>
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

class Creations extends React.Component
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

	fetchUserCreatedActions()
	{
		const token = localStorage.getItem('token');

		const onsuccess = (response) => {
			let data = JSON.parse(response);
			if (data.response)
			{
				data = [];
			}
			this.setState({
				actions: data
			});
		};

		const onerror = (response) => {
			message.error('could not get user data');
		};

		JsonRequest({
			url: `${Config.apiDomainName}/v1/private/${token}/actions`,
			method: 'get',
			onsuccess,
			onerror
		});
	}

	fetchAction(id)
	{
		const onsuccess = (response) => {
			let data = JSON.parse(response);
			if (data.response)
			{
				data = [{}];
			}
			this.setState({
				isEditing: true,
				currentAction: data[0],
			});
		};

		const onerror = (response) => {
			message.error('could not get user data');
		};

		JsonRequest({
			url: `${Config.apiDomainName}/v1/public/actions/${id}`,
			method: 'get',
			onsuccess,
			onerror
		});
	}

	deleteAction(id, onSuccess, onError)
	{
		const token = localStorage.getItem('token');

		const onsuccess = (response) => {
			onSuccess && onSuccess();
		};

		const onerror = (response) => {
			onError && onError();
			message.error('could not delete data');
		};

		JsonRequest({
			url: `${Config.apiDomainName}/v1/private/${token}/actions/${id}`,
			method: 'delete',
			onsuccess,
			onerror
		});
	}

	onDeleteAction(item)
	{
		this.deleteAction(item.id,
			this.fetchUserCreatedActions.bind(this));
	}

	onEditAction(item)
	{
		this.fetchAction(item.id);
	}

	componentDidMount()
	{
		this.fetchUserCreatedActions();
	}

	render()
	{
		return (
			<React.Fragment>
				{
					this.state.isEditing && (
					<React.Fragment>
						<Row type="flex" justify="space-around" align="middle">
							<Col span={16} xs={22} sm={22} md={16}>
								<Breadcrumb className="margin-top-30">
									<Breadcrumb.Item>
										<a onClick={() => this.setState({
											isEditing: false,
										})}>
										<Icon type="arrow-left"/> Retour
										</a>
									</Breadcrumb.Item>
								</Breadcrumb>
							</Col>
						</Row>
						<Row type="flex" justify="space-around" align="middle">
							<Col span={20} xs={24} sm={24} md={20}>
								<Create action={this.state.currentAction}/>
							</Col>
						</Row>
					</React.Fragment>
					)
				}
				{
					!this.state.isEditing && (
						<ActionList
							actions={this.state.actions}
							onDeleteAction={this.onDeleteAction.bind(this)}
							onEditAction={this.onEditAction.bind(this)}
						/>
					)
				}
			}
			</React.Fragment>
		);
	}
}


export default Creations;
