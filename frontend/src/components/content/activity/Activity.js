/* ************************************************************************** */
/*                                                                            */
/*  Activity.js                                                               */
/*                                                                            */
/*   By: elhmn <www.elhmn.com>                                                */
/*             <nleme@live.fr>                                                */
/*                                                                            */
/*   Created: Thu Jan 01 01:00:00 1970                        by elhmn        */
/*   Updated: Mon Feb 18 17:10:44 2019                        by elhmn        */
/*                                                                            */
/* ************************************************************************** */

import	'../../../css/Activity.css';
import	Contributions from './Contributions';
import	Creations from './Creations';
import React from 'react';

import {
	Row,
	Col,
	Menu,
	Breadcrumb,
} from 'antd';

import  { AppConsumer } from '../../store/AppContext';

class	Activity extends React.Component
{
	constructor(props)
	{
		super(props);
		this.state = {
			key: this.keys.creations,
		};
	}

	keys = {
		creations: 'creations',
		contributions: 'contributions'
	}

	handleClick = (event) =>
	{
		this.setState({
			key: event.key,
		});
	}

	render ()
	{
		return (
			<React.Fragment>
					<Row type="flex" style={{marginTop: 50}} justify="space-around" align="middle">
					<Col span={16} xs={22} sm={22} md={16}>
						<Menu
							mode="horizontal"
							onClick={this.handleClick}
							>
							<Menu.Item key={this.keys.creations}>
								Creations
							</Menu.Item>
							<Menu.Item key={this.keys.contributions}>
								Contributions
							</Menu.Item>
						</Menu>
					</Col>
				</Row>
				{
					this.state.key === this.keys.creations &&
					(
						<Creations />
					)
				}
				{
					this.state.key === this.keys.contributions &&
					(
						<Contributions />
					)
				}
			</React.Fragment>
		);
	}
};

export default (props) => {
	return (
		<AppConsumer>
		{
			(store) => <Activity {...props} store={store}/>
		}
		</AppConsumer>
	);
}
