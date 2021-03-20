/* ************************************************************************** */
/*                                                                            */
/*  ActionListSection.js                                                      */
/*                                                                            */
/*   By: elhmn <www.elhmn.com>                                                */
/*             <nleme@live.fr>                                                */
/*                                                                            */
/*   Created: Thu Jan 01 01:00:00 1970                        by elhmn        */
/*   Updated: Sun Jun 23 13:56:48 2019                        by bmbarga      */
/*                                                                            */
/* ************************************************************************** */

import	React from 'react';
import	{ Row, Col } from 'antd';
import { List, Avatar, Icon } from 'antd';
import { ActionCardImages } from '../../common/Constants';
import Config from '../../../config.js'
import moment from 'moment';
import { getActionStateComponent } from '../../../helpers/actions'
import  { AppConsumer } from '../../store/AppContext';

const IconText = ({ type, text }) => (
	<span>
		<Icon type={type} style={{ marginRight: 8 }} />
		{text}
	</span>
);

class	ActionListSection extends React.Component
{
	render ()
	{
	    const { toggleUserDetailModal } = this.props.store.actions;

		return (
			<List
				bordered={true}
				loading={false}
				split={true}
				itemLayout="vertical"
				size="large"
				pagination={{
							onChange: (page) => {
								},
							pageSize: 6,
							}}
				dataSource={ this.props.actionData || [] }
				renderItem={item => (
						<List.Item
							key={item.title}
							extra={
                                <Row  className="col-h-100" align="middle" type="flex" justify="center">
                                    <a style={{fontSize: "20px"}} onClick={() => this.props.showSearchActionDetailPage(item)}>
								        <div className="card-image-container" style={{ height: 200, width: 250, backgroundImage: `url(${
										        (item.images)
											        ? `${Config.apiDomainName}/v1/public/images/actions/${item.images[0].file}`
											        : ActionCardImages[Math.floor(Math.random() * ActionCardImages.length)]

									        })`
									        }}>
								        </div>
                                    </a>
                                </Row>
							}>
							<List.Item.Meta
							    style={{paddingTop: "2rem"}}
								title={<a style={{fontSize: "20px"}} onClick={() => this.props.showSearchActionDetailPage(item)}>{item.title}</a>}
								description={
									<React.Fragment>
										<Icon className="card-meta-icon" type="environment"/>
                                    {
                                        (item.address_info || item.street) &&
                                        (<span>{ (item.address_info || item.street) } | </span>)
                                    }
										<span>{ item.city }, </span>
										<span>{ item.coutry }</span>
										<div>
											<Icon className="card-meta-icon" type="clock-circle"/>
											<span>{ (moment(item.date).format("LL") || 21/12/2018) } </span>
										</div>
									</React.Fragment>
								}
							/>
							<div style={{marginTop: 20,
							    overflow: "hidden",
							    overflowWrap: "break-word",
							    maxHeight: "90px"}}>
								{item.description}
							</div>
							<div style={{marginTop: 20}}>
								<Row type="flex" justify="start" align="middle" gutter={10}>
									<Col style={{cursor: "pointer"}} className="col-h-100"
								        onClick={ () => {
							                toggleUserDetailModal(item.user_id);
								        }}
									>
										<Avatar icon="user" src={ item.userImage && `${Config.apiDomainName}/v1/public/images/users/${item.userImage[0].src}`} />
										<span style={{margin: "0px 10px"}} className="col-h-100">{`${item.firstname} ${item.lastname}`}</span>
									</Col>
								</Row>
							</div>
							<div style={{marginTop: 20}}>
								<Row type="flex" justify="start" align="middle" gutter={20}>
									<Col className="col-h-100">
										<Icon className="card-meta-star-icon" type="team"/>
										<span className="col-h-100"> {
										(item.laborContributions || []).length
										} / { item.participants || 0 } Participants </span>
									</Col>
									<Col className="col-h-100">
										<span className="col-h-100">After : </span>
										<Icon className="card-meta-star-icon" type={ !item.extra ? "close-square" : "check-square"}/>
									</Col>
								</Row>
							</div>
							<div style={{marginTop: 20}}>
								{getActionStateComponent(item)}
							</div>
						</List.Item>
					)}
		/>
		);
	}
}

export default (props) => {
	return (
		<AppConsumer>
		{
			(store) => <ActionListSection {...props} store={store}/>
		}
		</AppConsumer>
	);
}
