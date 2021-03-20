/* ************************************************************************** */
/*                                                                            */
/*  Home.js                                                                   */
/*                                                                            */
/*   By: elhmn <www.elhmn.com>                                                */
/*             <nleme@live.fr>                                                */
/*                                                                            */
/*   Created:                                                 by elhmn        */
/*   Updated: Sun Jun 23 13:53:39 2019                        by bmbarga      */
/*                                                                            */
/* ************************************************************************** */

import	'antd/dist/antd.css';
import	'../../../css/Home.css';
import	React from 'react';
import	{ Row, Col, Modal } from 'antd';

import	FeaturedActionsSection from './FeaturedActionsSection';
import	DoneActionsSection from './DoneActionsSection';
import  ExplainParticipationSection from './ExplainParticipationSection';
import  ExplainCreateSection from './ExplainCreateSection';
import	SearchSection from './SearchSection';
import	UserDetail from '../profile/UserDetail.js';
import  { AppConsumer } from '../../store/AppContext';

class	Home extends React.Component
{
	render ()
	{
	    const { userDetailModalVisible } = this.props.store;
	    const { toggleUserDetailModal } = this.props.store.actions;

		return (
			<div>
				<Row type="flex" justify="space-around" align="middle">
					<Col span={24}>
						<SearchSection changeContentPage={this.props.changeContentPage}/>
					</Col>
				</Row>
				<Row id="expl-part-container" type="flex" justify="space-around" align="middle">
					<Col span={24}>
						<ExplainParticipationSection />
					</Col>
				</Row>
				<Row id="featured-section-container" type="flex" justify="space-around" align="middle">
					<Col span={16}>
						<FeaturedActionsSection changeContentPage={this.props.changeContentPage}/>
					</Col>
				</Row>
				<Row id="expl-create-container" type="flex" justify="space-around" align="middle">
					<Col span={16}>
						<ExplainCreateSection changeContentPage={this.props.changeContentPage}/>
					</Col>
				</Row>
				{
				    (false) && (
				        <Row id="done-section-container" type="flex" justify="space-around" align="middle">
					        <Col span={16}>
						        <DoneActionsSection changeContentPage={this.props.changeContentPage}/>
					        </Col>
				        </Row>
				    )
				}
                <Modal
                    centered
                    visible={userDetailModalVisible}
                    onOk={toggleUserDetailModal}
                    onCancel={toggleUserDetailModal}
                    >
                    <UserDetail/>
                </Modal>
			</div>
		);
	}
};

export default (props) => {
	return (
		<AppConsumer>
		{
			(store) => <Home {...props} store={store}/>
		}
		</AppConsumer>
	);
}
