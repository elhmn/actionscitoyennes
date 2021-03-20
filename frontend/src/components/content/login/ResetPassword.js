/* ************************************************************************** */
/*                                                                            */
/*  ResetPassword.js                                                          */
/*                                                                            */
/*   By: elhmn <www.elhmn.com>                                                */
/*             <nleme@live.fr>                                                */
/*                                                                            */
/*   Created:                                                 by elhmn        */
/*   Updated: Sun Apr 14 10:42:41 2019                        by bmbarga      */
/*                                                                            */
/* ************************************************************************** */

import 'antd/dist/antd.css';
import React from 'react';
import { PAGES } from '../../common/Constants';
import { JsonRequest } from '../../../utilities/DataHandler';
import Config from '../../../config.js'
import	'../../../css/ResetPassword.css';
import { BrowserRouter as Router, Route, Link, withRouter } from "react-router-dom";
import  { AppConsumer } from '../../store/AppContext';
import
{
    Row,
    Col,
    Form,
    Button,
    Input,
    Divider,
    message,
    Icon,
	Modal
} from 'antd';

class      ResetPasswordForm extends React.Component
{
    constructor (props)
    {
        super(props);
		this.state = {
			errorVisibility: 'hidden',
			errorMessage: 'Error',
			messageColor: 'green',
		};
    }

    handleSubmit(event)
    {
        event.preventDefault();
        this.props.form.validateFields((err, values) =>
        {
            if (!err)
            {
                if (values['password'] !== values['confirmPassword'])
                {
                     this.setState({
			            errorVisibility: 'visible',
			            errorMessage: 'Vos mot de passes ne matchent pas',
			            messageColor: 'red',
			        });
                }
                else
                {
                    this.PostResetPassword(values);
                }
            }
            else
            {
                this.setState({
			        errorVisibility: 'visible',
			        errorMessage: 'Un lien de recuperation vous a ete envoye',
			        messageColor: 'red',
			    });
            }
        });
    }


    PostResetPassword(data)
    {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = this.props.location.pathname.split("/")[2];
        const userid = this.props.location.pathname.split("/")[3];

        const onsuccess = (response) => {
            const data =  JSON.parse(response) || [];
			this.props.onsuccess && this.props.onsuccess();
            message.success('password reset success');
			this.props.history.push('/login');
        };

        const onerror = (response) => {
            message.error('failed to reset password');
        };

        if (!data)
        {
            return ;
        }

        JsonRequest({
            url: `${Config.apiDomainName}/v1/private/${token}/users/${userid}`,
            data,
            method: 'patch',
            onsuccess,
            onerror
        });
    }

    render ()
    {
        const { getFieldDecorator } = this.props.form;
        const passwordLogo = <Icon type="lock"/>;

        return (
			<React.Fragment>
				<Form layout="horizontal" onSubmit={(event) => this.handleSubmit(event)}>
					<Form.Item>
						<h2 className="text-align-center">Modifier votre mot de passe</h2>
					</Form.Item>
                  <Form.Item>
                    {
                        getFieldDecorator('password', {
						                rules: [{ required: true, message: 'Rentrez votre mot de passe!' }],
					    })
                        (
                            <Input prefix={passwordLogo} size="large" placeholder="Inserez votre nouveau mot de passe" type="password"/>
                        )
                    }
                  </Form.Item>
                  <Form.Item>
                    {
                        getFieldDecorator('confirmPassword', {
						                rules: [{ required: true, message: 'Rentrez votre mot de passe!' }],
					    })
                        (
                            <Input prefix={passwordLogo} size="large" placeholder="Inserez de nouveau votre mot de passe" type="password"/>
                        )
                    }
                  </Form.Item>
				</Form>
					<Form layout="horizontal" onSubmit={(event) => this.handleSubmit(event)}>
						<Form.Item>
							<Button type="primary" htmlType="submit"
								size="large" block>
								Envoyer
							</Button>
						</Form.Item>
				</Form>
				<div style={{ textAlign: "center", visibility: this.state.errorVisibility, color: this.state.messageColor}} >
					{this.state.errorMessage}
				</div>
			</React.Fragment>
        );
    }
}

const   ResetPassword = Form.create()(withRouter((props) => <ResetPasswordForm {...props} /> ));

export default (props) => {
	return (
        <Row id="resetpassword-form" type="flex" justify="space-around" align="middle">
		        <Col span={6} xs={22} sm={22} md={10} lg={6}>
		            <AppConsumer>
		            {
			            (store) => <ResetPassword {...props} store={store}/>
		            }
		            </AppConsumer>
		        </Col>
        </Row>
	);
}
