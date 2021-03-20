/* ************************************************************************** */
/*                                                                            */
/*  PasswordRecoverForm.js                                                    */
/*                                                                            */
/*   By: elhmn <www.elhmn.com>                                                */
/*             <nleme@live.fr>                                                */
/*                                                                            */
/*   Created: Thu Jan 01 01:00:00 1970                        by elhmn        */
/*   Updated: Sun Apr 14 08:53:05 2019                        by bmbarga      */
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
import { JsonRequest } from '../../../utilities/DataHandler';
import { Link, withRouter } from "react-router-dom";
import Config from '../../../config.js'
import  { AppConsumer } from '../../store/AppContext';

class      BasePasswordRecoverForm extends React.Component
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
                this.PostPasswordRecover(values);
            }
        });
    }


    PostPasswordRecover(data)
    {
        const user = JSON.parse(localStorage.getItem('user'));

        const onsuccess = (response) => {
            const data =  JSON.parse(response) || [];
			this.props.onsuccess && this.props.onsuccess();
			this.setState({
			    errorVisibility: 'visible',
			    errorMessage: 'Un lien de recuperation vous a ete envoye',
			    messageColor: 'green',
			});
        };

        const onerror = (response) => {
			this.setState({
			    errorVisibility: 'visible',
			    errorMessage: 'Recuperation du mot de passe a echoue, verifiez votre addresse email',
			    messageColor: 'red',
			});
        };

        if (!data)
        {
            return ;
        }

        JsonRequest({
            url: `${Config.apiDomainName}/v1/public/resetpassword`,
            data,
            method: 'post',
            onsuccess,
            onerror
        });
    }

    render ()
    {
        const { getFieldDecorator } = this.props.form;
        const emailLogo = <Icon type="mail"/>;

        return (
			<React.Fragment>
				<Form layout="horizontal" onSubmit={(event) => this.handleSubmit(event)}>
					<Form.Item>
						<h2 className="text-align-center">Recuperer mon mot de passe</h2>
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
					</Form>
					<Form layout="horizontal" onSubmit={(event) => this.handleSubmit(event)}>
						<Form.Item>
							<Button type="primary" htmlType="submit"
								size="large" block>
								Envoyer
							</Button>
						</Form.Item>
						<div style={{ textAlign: "center", visibility: this.state.errorVisibility, color: this.state.messageColor}} >
							{this.state.errorMessage}
						</div>
				</Form>
			</React.Fragment>
        );
    }
}

const   PasswordRecoverForm = Form.create()(withRouter((props) => <BasePasswordRecoverForm {...props} /> ));

export default (props) => {
	return (
		<AppConsumer>
		{
			(store) => <PasswordRecoverForm {...props} store={store}/>
		}
		</AppConsumer>
	);
}
