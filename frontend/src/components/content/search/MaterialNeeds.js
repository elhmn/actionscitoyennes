/* ************************************************************************** */
/*                                                                            */
/*  MaterialNeeds.js                                                          */
/*                                                                            */
/*   By: elhmn <www.elhmn.com>                                                */
/*             <nleme@live.fr>                                                */
/*                                                                            */
/*   Created: Thu Jan 01 01:00:00 1970                        by elhmn        */
/*   Updated: Sun Jun 23 16:07:29 2019                        by bmbarga      */
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
import { PAGES, ActionCardImages } from '../../common/Constants';
import	MaterialNeedContribution from './MaterialNeedContribution';
import Config from '../../../config.js'
import  { AppConsumer } from '../../store/AppContext';

class MaterialNeed extends React.Component
{
	constructor(props)
	{
		super(props);
		this.state = {
			showMaterialContributions: false
		};
	}

	ToggleContributions()
	{
		this.setState({ showContributions: !this.state.showContributions});
	}

	getContributionAmount(contribs)
	{
		let contributionAmount;

		if (contribs.length <= 0)
		{
			contributionAmount = 0;
		}
		else if (contribs.length === 1)
		{
			contributionAmount = parseFloat(contribs[0].amount || 0);
		}
		else
		{
			contributionAmount = contribs.reduce((memo, elem) => {
				memo = isNaN(memo) ? parseFloat(memo.amount) : memo;
				elem = parseFloat(elem.amount || 0);
				return (memo + elem);
			});
		}

		return contributionAmount;
	}

	onMaterialNeedContributionChange = (data, value) =>
	{
		const	matContribs = this.props.actionData.materialContributions;
		const	userMaterialContributions = (matContribs && matContribs.filter(
											(contrib) =>
											contrib.user_id === localStorage.getItem('userid'))) || [];


		this.props.addContributions({
			materialNeed_id: data.materialNeed_id,
			action_id: data.action_id,
			extra_id: data.extra_id,
			method: (userMaterialContributions
									&& (userMaterialContributions.filter(
				(e) => e.materialNeed_id === data.materialNeed_id) || []).length > 0)
				? "PATCH"
				: "POST",
			amount: parseFloat(value || 0),
			materialContribution_id: userMaterialContributions
									&& (userMaterialContributions.find(
				(e) => e.materialNeed_id === data.materialNeed_id) || []).id
		});
	}

	render ()
	{
		const { need, contribs, isContribute, toggleUserDetailModal, actionData } = this.props;
		const	contributionAmount = this.getContributionAmount(contribs);
		const   loggedUserId = localStorage.getItem('userid');

		return (
			<div className="margin-top-20">
				<Row type="flex" justify="start" gutter={20}>
					<Col className="action-detail-needs-element" span={8} xs={18} sm={18} md={8}>
					    <h4><Icon type="tool" style={{fontSize: "1.5rem"}}/> {need.title}:
                        {' '} { contributionAmount } / { ' ' }
						{ parseFloat(need.required || 0) } { need.unit || ' unit '}
					    </h4>
					</Col>
					<Col span={4}>
						<Button
						    type="primary"
						    shape="square"
						    icon={(this.state.showContributions)
						    ? "minus" : "plus"}
						    size="medium"
						    onClick={() => this.ToggleContributions()}/>
					</Col>
					{
						(isContribute) && (
							<MaterialNeedContribution
							    need={need}
							    contrib={contribs.filter((c) => c.user_id === loggedUserId)[0]}
							    onChange={(value) => {
								this.onMaterialNeedContributionChange(
									{
										action_id: need.action_id,
										extra_id: need.extra_id,
										materialNeed_id: need.id,
									}, value);
							}}/>
					)}
				</Row>
				{ this.state.showContributions &&
					<List
						className="margin-top-20"
						size="large"
						bordered
						dataSource={contribs}
						renderItem={elem => (
							<List.Item>
							<Row type="flex" justify="start" gutter={50}>
								<Col style={{cursor: "pointer"}} onClick={() => { toggleUserDetailModal(elem.user_id)}}>
								    <Avatar icon="user" src={ elem.userImage && `${Config.apiDomainName}/v1/public/images/users/${elem.userImage[0].src}`} />
									<span className="col-h-100"> {
										elem.userFirstName + ' ' + elem.userLastName
									}
									</span>
								</Col>
								<Col>
									{parseFloat(elem.amount || 0)}
								</Col>
								<Col>
									{need.unit || 'unit'}
								</Col>
							</Row>
							</List.Item>
						)}
					/>
				}
			</div>
		);
	}
}

class MaterialNeeds extends React.Component
{
	render ()
	{
		const	{ contribs = [], isContribute, addContributions, actionData } = this.props;
	    const   { toggleUserDetailModal } = this.props.store.actions;


		const	ListItem = this.props.needs.map( (need) =>
			<MaterialNeed
				key={'needID_' + need.id}
				need={need}
				isContribute={isContribute}
				actionData={actionData}
				addContributions={addContributions}
				contribs={contribs.filter((elem) => elem.materialNeed_id === need.id)}
				toggleUserDetailModal={toggleUserDetailModal}
			/>);

		return(<div>{ListItem}</div>);
	}
}

export default (props) => {
	return (
		<AppConsumer>
		{
			(store) => <MaterialNeeds {...props} store={store}/>
		}
		</AppConsumer>
	);
}
