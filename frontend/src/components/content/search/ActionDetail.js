/* ************************************************************************** */
/*                                                                            */
/*  ActionDetail.js                                                           */
/*                                                                            */
/*   By: elhmn <www.elhmn.com>                                                */
/*             <nleme@live.fr>                                                */
/*                                                                            */
/*   Created: Mon Oct 15 21:18:20 2018                        by elhmn        */
/*   Updated: Sun Jun 23 14:03:27 2019                        by bmbarga      */
/*                                                                            */
/* ************************************************************************** */

import	React from 'react';
import	{ Row, Col } from 'antd';
import	{ Icon } from 'antd';
import	{ Button } from 'antd';
import	{ Switch } from 'antd';
import	{ Divider } from 'antd';
import	{ Avatar } from 'antd';
import	{ List } from 'antd';
import	{ Carousel } from 'antd';
import	'../../../css/ActionDetail.css'
import { ActionCardImages } from '../../common/Constants';
import	AfterDetail from './AfterDetail';
import	MaterialNeeds from './MaterialNeeds';
import { JsonRequest } from '../../../utilities/DataHandler';
import Config from '../../../config.js'
import moment from 'moment';
import { getActionStateComponent } from '../../../helpers/actions';
import Comments from './Comments';
import  { AppConsumer } from '../../store/AppContext';


class	ActionDetail extends React.Component
{
	constructor(props)
	{
		super(props);
		this.state = {
			showActionLaborContributions: false,
            laborContributionChecked: this.didContributeWithLabor(this.props.actionData),
			actionData: {},
		}
	}

	ToggleActionLaborContributions()
	{
		this.setState({ showActionLaborContributions: !this.state.showActionLaborContributions});
	}

	getAction = (id) =>
    {
        const onsuccess = (response) => {
			const actionData = (JSON.parse(response) || [])[0];

			if (JSON.stringify(actionData) !== JSON.stringify(this.state.actionData))
			{
				this.setState({
					actionData: actionData,
				});
            }
       };

        const onerror = (response) => {
        };


        JsonRequest({
            url: `${Config.apiDomainName}/v1/public/actions/${id}`,
            onsuccess,
            onerror
        });
    }

	componentDidMount(prevProps, prevState)
	{
		this.getAction(this.props.actionId);
	}

	didContributed(data)
	{
		return (this.didContributeWithLabor(data)
		        || this.didContributeWithMaterial(data));
	}

	didContributeWithLabor(data)
	{
		const	labContribs = data.laborContributions;
		const	userLaborContributions = (labContribs && labContribs.filter(
											(contrib) =>
											contrib.user_id === localStorage.getItem('userid'))) || [];
		return (userLaborContributions.length > 0);
	}


	didContributeWithMaterial(data)
	{
		const	matContribs = data.materialContributions;

		const	userMaterialContributions = (matContribs && matContribs.filter(
											(contrib) =>
											contrib.user_id === localStorage.getItem('userid'))) || [];
		return (userMaterialContributions.length > 0);
	}



	componentDidUpdate()
	{
		this.getAction(this.props.actionId);

		if (!this.props.alreadyContributed && this.didContributed(this.state.actionData))
			this.props.toggleAlreadyContributed();

	}

	onLaborContributionChange = (data) =>
	{
	    this.setState({ laborContributionChecked: !this.state.laborContributionChecked }, () => {
		    let		method = undefined;
		    const	labContribs = this.state.actionData.laborContributions;

		    const	userLaborContributions = labContribs && labContribs.filter(
											    (contrib) =>
											    contrib.user_id === localStorage.getItem('userid'));

		    const	contributed = userLaborContributions && (userLaborContributions.filter(
				    (e) => e.laborNeed_id === data.labneed_id) || []).length > 0;
            if (this.state.laborContributionChecked)
		    {
			    if (!contributed)
			    {
				    method = "POST";
			    }
		    }
		    else
		    {
			    if (contributed)
			    {
				    method = "DELETE";
			    }
		    }

		    this.props.addContributions({
			    laborNeed_id: data.labneed_id,
			    action_id: data.action_id,
			    method: method,
			    laborContribution_id: userLaborContributions
									    && (userLaborContributions.find(
				    (e) => e.laborNeed_id === data.labneed_id) || []).id
		    });
	    });
	}

	render ()
	{
		const		{ isContribute, addContributions, actionId } = this.props;
	    const       { toggleUserDetailModal } = this.props.store.actions;
		const		{ actionData } = this.state;

		return (
				<Row id="action-detail" className="col-h-100 col-100" type="flex" justify="space-around" align="top">
					<Col className="margin-top-40" span={14} xs={22} sm={22} md={14}>

						<h1 >{actionData.title || "Action citoyenne 2"}</h1>



						<Row type="flex" justify="start" className="marin-top-20">
							<Col className="action-detail-info-element">
								<Icon className="card-meta-icon" type="environment"/>
								{
									(actionData.address_info || actionData.street) &&
									(<span>{ (actionData.address_info || actionData.street) } | </span>)
								}
								<span>{ actionData.city }, </span>
								<span>{ actionData.coutry }</span>
							</Col>
						</Row>
						<Row type="flex" justify="start" className="marin-top-20">
							<Col className="action-detail-info-element">
								<div>
									<Icon className="card-meta-icon" type="clock-circle"/>
									<span>{ (moment(actionData.date).format("LL") || 21/12/2018) } , { (actionData.time || 17:30) } </span>
								</div>
							</Col>
						</Row>
						<Row type="flex" justify="start" className="marin-top-20">
							<Col className="action-detail-info-element" style={{cursor: "pointer"}} onClick={() => { toggleUserDetailModal(actionData.user_id)}}>
								<Avatar icon="user" src={ actionData.userImage && `${Config.apiDomainName}/v1/public/images/users/${actionData.userImage[0].src}`} />
								<span style={{margin: "0px 10px"}} className="col-h-100">{actionData.firstname + " " + actionData.lastname}</span>
							</Col>
						</Row>
						<Row type="flex" justify="start" gutter={50} className="marin-top-20">
							<Col className="action-detail-info-element">
							    <div style={{marginTop: 20}}>
								    {getActionStateComponent(actionData)}
							    </div>
							</Col>
						</Row>
                        <Divider />
						<Row className="margin-top-10 margin-bottom-10" type="flex" justify="space-between" align="start">
							<Col span={10} xs={22} sm={22} md={10}>
								<h2>Description : </h2>
								<span>
								{ actionData.description }
								</span>
							</Col>
							<Col span={10} style={{minWidth: 300, marginTop: 20}}>

								<Carousel autoplay={true}>
								{
									actionData.images ?
										actionData.images.map((image) =>
											<div key={image.file} style={{diplay: 'inline-block'}}>
												<h3 className="card-image-container" style={{ backgroundImage: `url(${`${Config.apiDomainName}/v1/public/images/actions/${image.file}`
													})`, minWidth: 300, height: 300}}>
												</h3>
											</div>
										)
										:
										<div style={{diplay: 'inline-block'}}>
											<h3 className="card-image-container" style={{ backgroundImage: `url(${ActionCardImages[Math.floor(Math.random() * ActionCardImages.length)]

											})`, minWidth: 300, height: 300}}>
											</h3>
										</div>
								}
								</Carousel>
							</Col>
						</Row>
                        <Divider />
						<div id="action-detail-needs" className="margin-top-10">
							<h2>Besoins : </h2>
							<Row className="margin-top-20" type="flex" justify="start" gutter={20}>
								<Col className="action-detail-needs-element" span={8} xs={18} sm={18} md={8}>
								    <h4><Icon type="team" style={{fontSize: "1.5rem"}}/> Benevoles: {actionData.laborContributions ? actionData.laborContributions.length : 0} / { actionData.participants } </h4>
								</Col>
								<Col span={4}>
									<Button type="primary"
										shape="square"
										icon={(this.state.showActionLaborContributions)
										? "minus" : "plus"}
										size="medium"
										onClick={() => this.ToggleActionLaborContributions()}/>
								</Col>
								{
									(isContribute) && (
									<React.Fragment>
										<Col className="action-contributions" span={8} xs={22} sm={22} md={8}>
							                <Row type="flex" justify="middle" align="center">
											    <h4 style={{marginRight: "5px"}}>Participez</h4> {' '}
                                                <Switch
                                                    size="large"
												    checked={this.state.laborContributionChecked}
												    onChange={() => {
													    this.onLaborContributionChange({
														    labneed_id: actionData.labneed_id,
														    action_id: actionData.id
													    });
												    }}
											    />
							                </Row>
										</Col>
									</React.Fragment>
								)}
							</Row>
							{ this.state.showActionLaborContributions &&
								<List
									className="margin-top-20"
									size="large"
									bordered
									dataSource={actionData.laborContributions}
									renderItem={elem => (
										<List.Item>
							                <Row type="flex" justify="start" gutter={50}>
								                <Col style={{cursor: "pointer"}} onClick={() => { toggleUserDetailModal(elem.user_id)}} >
								                    <Avatar icon="user" src={ elem.userImage && `${Config.apiDomainName}/v1/public/images/users/${elem.userImage[0].src}`} />
											        <span className="col-h-100"> {
												        elem.userFirstName + ' ' + elem.userLastName
											        }
											        </span>
								                </Col>
							                </Row>
										</List.Item>
									)}
								/>
							}
						</div>
						{
							(actionData.materialNeeds) &&
								(<MaterialNeeds
									actionData={ actionData }
									needs={actionData.materialNeeds}
									contribs={actionData.materialContributions}
									isContribute={isContribute}
									addContributions={addContributions}
								/>)
						}
						{
							(actionData.extra) && (
							<AfterDetail
								{...this.props}
								afterData={ actionData.extra }
								actionData={ actionData }
								isContribute={isContribute}
								addContributions={addContributions}
							/>
						)}
						<div className="margin-bottom-40"></div>
						<div>
                            <Divider>
				                <h2>Commentaires</h2>
                            </Divider>
				            <Comments
				                actionData={ actionData }
				                toggleModal={ this.props.toggleModal }
				                />
			            </div>
					</Col>
				</Row>
		);
	}
}

export default (props) => {
	return (
		<AppConsumer>
		{
			(store) => <ActionDetail {...props} store={store}/>
		}
		</AppConsumer>
	);
}
