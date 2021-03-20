/* ************************************************************************** */
/*                                                                            */
/*  LogIn.js                                                                  */
/*                                                                            */
/*   By: elhmn <www.elhmn.com>                                                */
/*             <nleme@live.fr>                                                */
/*                                                                            */
/*   Created:                                                 by elhmn        */
/*   Updated: Wed Apr 10 10:04:11 2019                        by elhmn        */
/*                                                                            */
/* ************************************************************************** */

import	'antd/dist/antd.css';
import	'../../../css/Login.css';
import	React from 'react';
import LoginForm from './LoginForm'
import
{
    Row,
    Col,
} from 'antd';

class	LogIn extends React.Component
{
	render ()
	{
		return (
            <Row id="login-form" type="flex" justify="space-around" align="middle">
					<Col span={6} xs={22} sm={22} md={10} lg={6}>
                        <LoginForm
                            changeContentPage={this.props.changeContentPage}
                        />
					</Col>
            </Row>
		);
	}
};

export default LogIn;
