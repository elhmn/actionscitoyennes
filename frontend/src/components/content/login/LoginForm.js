/* ************************************************************************** */
/*                                                                            */
/*  LoginForm.js                                                              */
/*                                                                            */
/*   By: elhmn <www.elhmn.com>                                                */
/*             <nleme@live.fr>                                                */
/*                                                                            */
/*   Created:                                                 by elhmn        */
/*   Updated: Sun Apr 14 10:39:24 2019                        by bmbarga      */
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
    Divider,
    message,
    Icon,
	Modal
} from 'antd';

import { PAGES } from '../../common/Constants';
import PasswordRecoverForm from './PasswordRecoverForm';
import { JsonRequest } from '../../../utilities/DataHandler';
import { Link, withRouter } from "react-router-dom";
import Config from '../../../config.js'
import  { AppConsumer } from '../../store/AppContext';

class      BaseLoginForm extends React.Component
{
    constructor (props)
    {
        super(props);
		this.state = {
			modalVisible: false,
		};
    }

	onFetchUserDataSucess() {
		this.props.history.push('/' + (this.props.nextpage || ''));
	}

	FetchUserData()
	{
		const { fetchUserData } = this.props.store.actions;

		fetchUserData(() => this.onFetchUserDataSucess());
	}

    PostLoginRequest(data)
    {
        const onsuccess = (response) => {
            const data =  JSON.parse(response) || [];
            localStorage.setItem('token', data && data.token);
            localStorage.setItem('userid', data && data.userid);
			this.props.onsuccess && this.props.onsuccess();
			this.FetchUserData();
			this.props.store.actions.updateToken();
            message.success('login success');
        };

        const onerror = (response) => {
            message.error('login failed');
        };

        if (!data)
        {
            return ;
        }

        JsonRequest({
            url: `${Config.authDomainName}/login`,
            data,
            method: 'post',
            onsuccess,
            onerror
        });
    }

    PostActionRequest()
    {
        const data = {
            token: localStorage.getItem('token'),
        }

        const onsuccess = (response) => {
            const data =  response && JSON.parse(response) || [];
            message.success('action created');
            this.props.changeContentPage(PAGES.home);
        };

        const onerror = (response) => {
            message.error('action creation failed');
        };

        if (!data)
        {
            return ;
        }

        JsonRequest({
            url: `${Config.authDomainName}/logout`,
            data,
            method: 'post',
            onsuccess,
            onerror
        });
    }

    handleSubmit(event)
    {
        event.preventDefault();
        this.props.form.validateFields((err, values) =>
        {
            if (!err)
            {
                this.PostLoginRequest(values);
            }
        });
    }

	toggleModal()
    {
        this.setState({
            modalVisible: !this.state.modalVisible
        });
    }

    render ()
    {
        const { getFieldDecorator } = this.props.form;
        const emailLogo = <Icon type="mail"/>;
        const passwordLogo = <Icon type="lock"/>;


        return (
			<React.Fragment>
            <Form layout="horizontal" onSubmit={(event) => this.handleSubmit(event)}>
                <Form.Item>
					<h2 className="text-align-center">Connexion</h2>
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
						            rules: [{ required: true, message: 'Rentrez votre mot de passe!' }],
					})
                    (
                        <Input prefix={passwordLogo} size="large" placeholder="mot de passe" type="password"/>
                    )
                }
                </Form.Item>
                <Form.Item>
					<a className="forgot-password" onClick={() => this.toggleModal()}>Mot de passe oublie ?</a>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" size="large" block>
                        Connexion
                    </Button>
                </Form.Item>
            </Form>
            <Form layout="horizontal" onSubmit={(event) => this.handleSubmit(event)}>
                <Form.Item>
					<Divider> Pas encore de compte ? </Divider>
                </Form.Item>
                <Form.Item>
					<Link to="/signup">
						<Button className="btn-black" type="primary" htmlType="submit" onClick={() => {
							window.scrollTo(0, 0);
						}}
						size="large" block>
							Inscription
						</Button>
					</Link>
                </Form.Item>
            </Form>
            <Modal
                centered
                visible={this.state.modalVisible}
                onCancel={() => {this.toggleModal()}}
                onOk={() => {this.toggleModal()}}
                >
                <PasswordRecoverForm
                    changeContentPage = {this.props.changeContentPage}
                />
            </Modal>
			</React.Fragment>
        );
    }
}

const   LoginForm = Form.create()(withRouter((props) => <BaseLoginForm {...props} /> ));

export default (props) => {
	return (
		<AppConsumer>
		{
			(store) => <LoginForm {...props} store={store}/>
		}
		</AppConsumer>
	);
}
