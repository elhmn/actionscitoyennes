/* ************************************************************************** */
/*                                                                            */
/*  AfterDetail.js                                                            */
/*                                                                            */
/*   By: elhmn <www.elhmn.com>                                                */
/*             <nleme@live.fr>                                                */
/*                                                                            */
/*   Created: Thu Jan 01 01:00:00 1970                        by elhmn        */
/*   Updated: Sun Jun 16 00:20:59 2019                        by bmbarga      */
/*                                                                            */
/* ************************************************************************** */

import	React from 'react';
import	{ Row, Col } from 'antd';
import	{ Input } from 'antd';
import	{ Icon } from 'antd';
import	{ Button } from 'antd';
import	{ Divider } from 'antd';
import	{ Breadcrumb } from 'antd';
import	{ Avatar } from 'antd';
import	{ List, Checkbox } from 'antd';
import	{ Tag, InputNumber } from 'antd';
import	'../../../css/ActionDetail.css'
import { PAGES, ActionCardImages } from '../../common/Constants';
import	MaterialNeeds from './MaterialNeeds';

class	AfterDetail extends React.Component
{
	constructor(props)
	{
		super(props);
		this.state = {
			showAfterLaborContributions: false
		}
	}

	ToggleAfterLaborContributions()
	{
		this.setState({ showAfterLaborContributions: !this.state.showAfterLaborContributions});
	}

	render()
	{
		const	{ afterData, isContribute, addContributions, actionData } = this.props;

		return (
			<React.Fragment>
				<div className="margin-top-100">
					<Divider> <h2> After </h2> </Divider>
				</div>

				<h1>{ afterData.title || "Action citoyenne 2"}</h1>

				<Row type="flex" justify="start" gutter={50} className="marin-top-20">
					<Col className="action-detail-info-element">
						<Icon className="card-meta-icon" type="environment"/>
						{
							(afterData.address_info || afterData.street) &&
							(<span>{ (afterData.address_info || afterData.street) } | </span>)
						}
						<span>{ afterData.city }, </span>
						<span>{ afterData.coutry }</span>
					</Col>
					<Col className="action-detail-info-element">
						<div>
							<Icon className="card-meta-icon" type="clock-circle"/>
							<span> { (afterData.time || 17:30) } </span>
						</div>
					</Col>
				</Row>

				<div className="margin-top-50">
					<h2>Description : </h2>
					<span>
					{ afterData.description }
					</span>
				</div>

				<div className="margin-top-50">
					<h2>Besoins : </h2>
				</div>
				{
					(afterData.materialNeeds) && (
					<MaterialNeeds
						actionData={actionData}
						needs={afterData.materialNeeds}
						contribs={afterData.materialContributions}
						isContribute={isContribute}
						addContributions={addContributions}
						/>)
				}
			</React.Fragment>
		);
	}
};


export default AfterDetail;
