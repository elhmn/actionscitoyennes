/* ************************************************************************** */
/*                                                                            */
/*  SignIn.js                                                                 */
/*                                                                            */
/*   By: elhmn <www.elhmn.com>                                                */
/*             <nleme@live.fr>                                                */
/*                                                                            */
/*   Created:                                                 by elhmn        */
/*   Updated: Wed Apr 10 10:05:17 2019                        by elhmn        */
/*                                                                            */
/* ************************************************************************** */

import	'antd/dist/antd.css';
import	'../../../css/SignIn.css';
import	React from 'react';
import SigninForm from './SigninForm.js'
import
{
    Row,
    Col,
} from 'antd';

class	SignIn extends React.Component
{
	render ()
	{
		return (
            <Row id="signin-form" type="flex" justify="space-around" align="middle">
					<Col span={6} xs={22} sm={22} md={10} lg={6}>
                        <SigninForm changeContentPage={this.props.changeContentPage}/>
					</Col>
            </Row>

		);
	}
};

export default SignIn;
