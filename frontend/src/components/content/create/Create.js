/* ************************************************************************** */
/*                                                                            */
/*  Create.js                                                                 */
/*                                                                            */
/*   By: elhmn <www.elhmn.com>                                                */
/*             <nleme@live.fr>                                                */
/*                                                                            */
/*   Created:                                                 by elhmn        */
/*   Updated: Sun Jun 16 08:57:32 2019                        by bmbarga      */
/*                                                                            */
/* ************************************************************************** */

import	'antd/dist/antd.css';
import	'../../../css/Create.css';
import	{ message } from 'antd';
import	React from 'react';
import  LoginForm from '../login/LoginForm';
import { PAGES } from '../../common/Constants';
import	ActionMenu from './ActionMenu'
import	ActionForm from './ActionForm'
import	ActionCreationStep from './ActionCreationStep'
import	ActionDetailsForm from './ActionDetailsForm'
import	ActionNeedsForm from './ActionNeedsForm'
import	AfterDetailsForm from './AfterDetailsForm'
import	AfterNeedsForm from './AfterNeedsForm'
import	CreationFinalisation from './CreationFinalisation'
import { withRouter } from "react-router-dom";

import
{
    Row,
    Col,
    Button,
    Input,
    Divider,
    Modal,
} from 'antd';

const getSteps = (props) =>
[
	{
		title: "Detail de l'action",
		description: 'Decrivez votre action',
		content: <ActionDetailsForm {...props}/>,
	},
	{
		title: 'Specifiez vos besoins',
		description: 'Faites connaitre vos besoins a la communaute',
		content: <ActionNeedsForm {...props}/>,
	},
	{
		title: "Detail de l'after",
		description: 'Proposez un after',
		content: <AfterDetailsForm {...props}/>,
	},
	{
		title: 'Finalisation',
		description: "Finalisez la creation de l'action",
		content: <CreationFinalisation {...props}/>,
	},
];

class	Create extends React.Component
{
   constructor(props)
    {
        super(props);
        this.state = {
            modalVisible: false,
        };
    }

    toggleModal()
    {
        if (!this.state.modalVisible) {
            message.warning('Vous devez vous connecter ou vous inscrire pour continuer.');
        }
        this.setState({
            modalVisible: !this.state.modalVisible
        });
    }

    onLoginSuccess()
    {
        this.toggleModal();
    }

    componentDidMount()
    {
        const token = localStorage.getItem('token');
        if (!token)
        {
            this.toggleModal();
        }
    }

	render ()
	{
		return (
			<React.Fragment>
			<div  id="create-content-page">
				<Row type="flex" justify="space-around">
					<Col span={16} xs={22} sm={22} md={16}>
						{ !this.props.action && (
							<Row type="flex" justify="space-around" align="top" className="margin-top-100">
								<Col span={16}>
									<h2 className="text-align-center">Creez une action</h2>
								</Col>
							</Row>
						)}
						<Row id="create-action-container" type="flex" justify="space-between" align="top">
							<Col span={24}>
								<ActionCreationStep steps={getSteps(this.props)} action={this.props.action}/>
							</Col>
						</Row>
					</Col>
				</Row>
			</div>
            <Modal
                centered
                visible={this.state.modalVisible}
                onCancel={() => this.props.history.push('/') }
                onOk={() => this.props.history.push('/') }
                >
                <LoginForm
                    onsuccess = {() => {this.onLoginSuccess()}}
                    nextpage = {PAGES.create}
                    changeContentPage = {this.props.changeContentPage}
                />
            </Modal>
			</React.Fragment>
		);
	}
};

export default withRouter(Create);
