/* ************************************************************************** */
/*                                                                            */
/*  SigninForm.js                                                             */
/*                                                                            */
/*   By: elhmn <www.elhmn.com>                                                */
/*             <nleme@live.fr>                                                */
/*                                                                            */
/*   Created: Thu Jan 01 01:00:00 1970                        by elhmn        */
/*   Updated: Sun Feb 17 07:16:51 2019                        by elhmn        */
/*                                                                            */
/* ************************************************************************** */

import	React from 'react';
import
{
    Row,
    Col,
    Form,
    Button,
    Input,
	Checkbox,
	Divider,
    Icon,
    message
} from 'antd';

import { JsonRequest } from '../../../utilities/DataHandler';
import { PAGES } from '../../common/Constants';
import Config from '../../../config.js'
import { Link, withRouter } from "react-router-dom";

class      BaseSigninForm extends React.Component
{
    constructor (props)
    {
        super(props);
    }

    PostSignUpRequest(data)
    {
        const onsuccess = (response) => {
            message.success('sign up success');
			this.props.history.push('/login');
        };

        const onerror = (response) => {
            message.error('sign up failed');
        };

        const onstatus = (response, status) => {
            if (status === 409)
            {
                message.error('sign up failed, email already registered');
            }
        };

        if (!data)
        {
            return ;
        }

        JsonRequest({
            url: `${Config.apiDomainName}/v1/public/signup`,
            data,
            method: 'post',
            onsuccess,
            onerror,
            onstatus,
        });
    }

    handleSignUpSubmit(event)
    {
        event.preventDefault();
        this.props.form.validateFields((err, values) =>
        {
            if (!err)
            {
                this.PostSignUpRequest(values);
            }
        });
    }

    handleLogInSubmit(event)
    {
        event.preventDefault();
        this.props.form.validateFields((err, values) =>
        {
            if (!err)
            {
            }
        });
    }

    checkboxAggreementValidator(rule, value, callback)
    {
        if (value === false)
        {
            callback('Please read the aggreement!');
        }
        else
            callback();
    }

    render ()
    {
        const { getFieldDecorator } = this.props.form;
        const emailLogo = <Icon type="mail"/>;
        const passwordLogo = <Icon type="lock"/>;
        const userLogo = <Icon type="user"/>;

        return (
			<React.Fragment>
            <Form layout="horizontal" onSubmit={(event) => this.handleSignUpSubmit(event)}>
                <Form.Item>
					<h2 className="text-align-center">Inscription</h2>
                </Form.Item>
				<Form.Item>
                {
                    getFieldDecorator('firstname', {
						            rules: [{ required: true, message: 'Rentrez votre prenom !' }],
					})
                    (
                        <Input prefix={userLogo} size="large" placeholder="Prenom" />
                    )
                }
                </Form.Item>
				<Form.Item>
                {
                    getFieldDecorator('lastname', {
						            rules: [{ required: true, message: 'Rentrez votre nom !' }],
					})
                    (
                        <Input prefix={userLogo} size="large" placeholder="Nom" />
                    )
                }
                </Form.Item>
                <Form.Item>
                {
                    getFieldDecorator('email', {
						            rules: [{ required: true, message: 'Rentrez votre addresse email !' }],
					})
                    (
                        <Input prefix={emailLogo} size="large" placeholder="email" />
                    )
                }
                </Form.Item>
                <Form.Item>
                {
                    getFieldDecorator('password', {
						            rules: [{ required: true, message: 'Rentrez votre de passe!' }],
					})
                    (
                        <Input prefix={passwordLogo} size="large" placeholder="password" type="password"/>
                    )
                }
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" size="large" block>
                       Inscription
                    </Button>
                </Form.Item>
            </Form>
            <Form layout="horizontal" onSubmit={(event) => this.handleLogInSubmit(event)}>
                <Form.Item>
					<Divider> Vous avez deja un compte ? </Divider>
                </Form.Item>
                <Form.Item>
					<Link to="/login">
						<Button className="btn-black" type="primary" htmlType="submit" onClick={() => {
							window.scrollTo(0, 0);
						}}
						size="large" block>
							Connexion
						</Button>
					</Link>
                </Form.Item>
            </Form>
			</React.Fragment>
        );
    }
}

const   SigninForm = Form.create()(withRouter((props) => <BaseSigninForm {...props} /> ));

export default SigninForm;
