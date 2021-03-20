/* ************************************************************************** */
/*                                                                            */
/*  UserDetail.js                                                             */
/*                                                                            */
/*   By: elhmn <www.elhmn.com>                                                */
/*             <nleme@live.fr>                                                */
/*                                                                            */
/*   Created: Sun Jun 23 09:38:56 2019                        by elhmn        */
/*   Updated: Sun Jun 23 15:13:11 2019                        by bmbarga      */
/*                                                                            */
/* ************************************************************************** */

import	'../../../css/Profile.css';
import	React from 'react';
import	{ Row, Col } from 'antd';
import	{ Input } from 'antd';
import	{ Avatar, message } from 'antd';
import { JsonRequest } from '../../../utilities/DataHandler';
import Config from '../../../config.js'
import  { AppConsumer } from '../../store/AppContext';

const Field = (props) => {
    const { field } = props;

	return (
		<Row type="flex" justify="start" align="middle" style={{ marginTop: 10}} gutter={10}>
			<Col span={6}>
				<span> { field.label } : </span>
			</Col>
		    <Col>
				<span>{ field.value }</span>
			</Col>
		</Row>
	);
};

class	UserDetail extends React.Component
{
    constructor(props)
	{
		super(props);
	    const { userDetailId: userId } = this.props.store;

		this.state = {
		    user: null,
		}
	}

    GetUserDetail()
    {
	    const { userDetailId: userId } = this.props.store;

        const onsuccess = ((response) => {
            this.setState({ user: JSON.parse(response)[0] });
        });

        const onerror = ((response) => {
            message.error("Unable to get user detail");
        });

        const onstatus = ((response, status) => {
            if (status === 204) {
                this.setState({ user: [] });
            }
        });

        JsonRequest({
            url: `${Config.apiDomainName}/v1/public/users/${userId}`,
            method: 'get',
            onsuccess,
            onerror,
            onstatus
        });
    }


    componentDidMount()
    {
        this.GetUserDetail();
    }

    componentDidUpdate(prevProps)
    {
	    const { userDetailId: userId } = this.props.store;

        if (userId !== prevProps.store.userDetailId) {
            this.GetUserDetail();
        }
    }

	render ()
	{
	    const { user } = this.state;

		return (
            <Row id="user-detail-container" type="flex" justify="space-around" align="middle">
				<Col span={22} xs={22} sm={22} md={22}>
					<Row type="flex" justify="space-around" align="middle">
						<Avatar icon="user" src={ user && user.image && `${Config.apiDomainName}/v1/public/images/users/${user.image[0].src}`} size={150}/>
					</Row>
					<Field
						field={{value: user && user.lastname,
								label: 'Nom',
								type: 'lastname'}}
						onChange={this.onChange}/>

					<Field
						field={{value: user && user.firstname,
								label: 'Prenom',
								type: 'firstname'}}
						onChange={this.onChange}/>
					<Field
						field={{value: (user && user.bio) || 'about me',
								label: 'Bio',
								type: 'bio'}}
						fieldComponent={Input.TextArea}
						onChange={this.onChange}/>
				</Col>
            </Row>
		);
	}
};

export default (props) => {
	return (
		<AppConsumer>
		{
			(store) => <UserDetail {...props} store={store}/>
		}
		</AppConsumer>
	);
}
