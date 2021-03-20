
/*  CardMeta.js                                                               */
/*                                                                            */
/*   By: elhmn <www.elhmn.com>                                                */
/*             <nleme@live.fr>                                                */
/*                                                                            */
/*   Created: Thu Jan 01 01:00:00 1970                        by elhmn        */
/*   Updated: Sun Jun 23 11:00:02 2019                        by bmbarga      */
/*                                                                            */
/* ************************************************************************** */

import	React from 'react';
import	{ Row, Col, Card, Icon, Avatar, Tooltip } from 'antd';
import	'antd/dist/antd.css';
import { ActionCardImages } from '../common/Constants';
import Config from '../../config.js'
import moment from 'moment';
import { getActionStateComponent } from '../../helpers/actions'
import  { AppConsumer } from '../store/AppContext';

class	CardMeta extends React.Component
{
	render ()
	{
        const { data } = this.props;
	    const { toggleUserDetailModal } = this.props.store.actions;

		return (
			<Card
				hoverable
				style={{ width: 320 , margin: 20}}
				bodyStyle={{padding:0, margin: 0}}
				>
				<Card.Meta
					style={{margin:20}}
					title= { data && data.title }
					description={
						<React.Fragment>
							<Icon className="card-meta-icon" type="environment"/>
                            {
                                (data.address_info || data.street) &&
                                        (<span>{ (data.address_info || data.street) } | </span>)
                            }
							<span>{data && data.city}, </span>
							<span>{data && data.coutry}</span>
							<div>
								<Icon className="card-meta-icon" type="clock-circle"/>
								<span> {data && (moment(data.date).format("LL") || 21/12/2018)} </span>
							</div>
						</React.Fragment>
					}
				/>
				<div className="card-image-container" style={{ backgroundImage: `url(${
					(data.images)
						? `${Config.apiDomainName}/v1/public/images/actions/${data.images[0].file}`
						: ActionCardImages[Math.floor(Math.random() * ActionCardImages.length)]

				})`
				}}>
				</div>
				<React.Fragment>
					<div style={{margin:20}}>
						<Row type="flex" justify="space-between" align="bottom">
							<Col onClick={(event) => {
							        event.stopPropagation();
							        toggleUserDetailModal(data.user_id);
							    }
							}>
								<Row type="flex" justify="space-between" align="bottom">
									<Avatar icon="user" src={ data.userImage && `${Config.apiDomainName}/v1/public/images/users/${data.userImage[0].src}`} />
									<span style={{margin: "0px 10px"}}>{`${data && data.firstname} ${data && data.lastname}`}</span>
								</Row>
							</Col>
							<Col>
                                {getActionStateComponent(data)}
							</Col>
                            {
                                data && data.extra &&
                                (<Col>
                                    <Tooltip title="Cette action propose un after">
                                        <Icon className="card-meta-star-icon" theme="twoTone" twoToneColor="blue" type="gift"/>
                                    </Tooltip>
                                </Col>)
                            }
                        </Row>
					</div>
				</React.Fragment>
			</Card>
		);
	}
};

export default (props) => {
	return (
		<AppConsumer>
		{
			(store) => <CardMeta {...props} store={store}/>
		}
		</AppConsumer>
	);
}
