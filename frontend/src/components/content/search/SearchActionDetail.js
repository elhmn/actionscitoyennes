/* ************************************************************************** */
/*                                                                            */
/*  SearchActionDetail.js                                                     */
/*                                                                            */
/*   By: elhmn <www.elhmn.com>                                                */
/*             <nleme@live.fr>                                                */
/*                                                                            */
/*   Created: Sat Oct 20 18:26:07 2018                        by elhmn        */
/*   Updated: Sun Jun 23 14:57:42 2019                        by bmbarga      */
/*                                                                            */
/* ************************************************************************** */

import	React from 'react';
import	{ Row, Col, Affix, Modal } from 'antd';
import	{ Button } from 'antd';
import	{ Breadcrumb } from 'antd';
import	{ message } from 'antd';
import	ActionDetail from './ActionDetail';
import	'../../../css/SearchActionDetail.css'
import { JsonRequest } from '../../../utilities/DataHandler';
import Config from '../../../config.js'
import LoginForm from '../login/LoginForm';
import { PAGES } from '../../common/Constants';
import { getActionState } from '../../../helpers/actions'


class	SearchActionDetail extends React.Component
{
	constructor(props)
	{
		super(props);

		this.state = {
			isContribute: false,
			alreadyContributed: false,
			modalVisible: false,
			contribs: [],
			contribSuccessCount: 0,
			data: [{}],
		};

		this.actionDetailRef = null;

		this.setActionDetailRef = element => {
			 this.actionDetailRef = element;
		 };
	}

    toggleModal()
    {
        if (!this.state.modalVisible) {
            message.warning('Vous devez vous connecter ou vous inscrire pour continuer.', 5);
        }
        this.setState({
            modalVisible: !this.state.modalVisible
        });
    }

    onLoginSuccess()
    {
        this.toggleModal();
    }


	onClickDone(data)
    {
        const token = localStorage.getItem('token');
        if (!token)
        {
            this.toggleModal();
        }
        else
        {
            this.PostActionRequest(data);
        }
    }

	SendContribution(data)
    {
        const token = localStorage.getItem('token');
		let additional = '';
		let endpoint;

        if (!data)
        {
            return ;
        }
		if (!data.method)
		{
			return ;
		}

		if (data.materialNeed_id)
		{
			endpoint = "materialcontributions";
		}
		else if (data.laborNeed_id)
		{
			endpoint = "laborcontributions";
		}

		if (data.method === "DELETE"
			|| data.method === "PATCH")
		{
			if (data.laborContribution_id === undefined
				&& data.materialContribution_id === undefined)
			{
				return ;
			}
			additional = `/${data.laborContribution_id || data.materialContribution_id}`
		}

        const onsuccess = (response) => {
 			this.actionDetailRef && this.actionDetailRef.forceUpdate(); // Debug
			this.setState({ contribSuccessCount: this.state.contribSuccessCount + 1}, () => {
				if (this.state.contribSuccessCount === this.state.contribs.length)
				{
					message.success("contribution success");
					this.setState({
						contribs: [],
						contribSuccessCount: 0
					});
				}
			});
        };

        const onerror = (response) => {
			message.error(`${endpoint} failed`);
        };


        JsonRequest({
            url: `${Config.apiDomainName}/v1/private/${token}/${endpoint}${additional}`,
            data,
            method: data.method,
            onsuccess,
            onerror
        });
    }

	handleContributions = () => {
		const		contribs = this.state.contribs;


		contribs.map((elem) => { this.SendContribution(elem); });
	}

	onContributionButtonClick = () => {
		if (!localStorage.getItem('userid'))
		{
			this.toggleModal();
			return ;
		}
		this.toggleContributionButton();
	}

	toggleContributionButton = () =>
	{
		if (this.state.isContribute)
		{
			this.handleContributions();
		}
		else
		{
		    document.getElementById('action-detail-needs').scrollIntoView();
		    window.scrollBy(0, -150);
		}
		this.setState({ isContribute: !this.state.isContribute});
	}

	addContributions = (contrib) => {

		if (contrib.laborNeed_id
			&& this.state.contribs.filter((c) => c.laborNeed_id === contrib.laborNeed_id).length > 0)
		{
			let contribs = this.state.contribs;

			contribs = contribs.map((c) => {
				if (c.laborNeed_id ===  contrib.laborNeed_id)
				{
					c = {
							...c,
							method: contrib.method,
							laborContribution_id: contrib.laborContribution_id,
					};
				}
				return (c);
			});

			this.setState({
				contribs: [...contribs]
			}, () => {
			});
			return ;
		}

		if (contrib.materialNeed_id
			&& this.state.contribs.filter((c) => c.materialNeed_id === contrib.materialNeed_id).length > 0)
		{
			let contribs = this.state.contribs;

			contribs = contribs.map((c) => {
				if (c.materialNeed_id ===  contrib.materialNeed_id)
				{
					c = {
							...c,
							amount: contrib.amount,
							method: contrib.method,
					};
				}
				return (c);
			});

			this.setState({
				contribs: [...contribs]
			}, () => {
			});
			return ;
		}

		this.setState({contribs: [contrib, ...this.state.contribs]}, () => {
		});
	};

	toggleAlreadyContributed = () => {
		this.setState({
			alreadyContributed: !this.state.alreadyContributed,
		});
	}

    GetActions(id)
    {
        const onsuccess = ((response) => {
            this.setState({ data: JSON.parse(response) });
        }).bind(this);

        const onerror = ((response) => {
        }).bind(this);

        const onstatus = ((response, status) => {
            if (status === 204) {
                this.setState({ data: [] });
            }
        }).bind(this);

        JsonRequest({
            url: `${Config.apiDomainName}/v1/public/actions/${id}`,
            method: 'get',
            onsuccess,
            onerror,
            onstatus
        });
    }

   componentDidMount()
    {
		if (!Object.keys(this.props.actionData).length)
		{
			this.GetActions(this.props.actionId);
		}
	}

	render ()
	{
		const	actionData = Object.keys(this.props.actionData).length ? this.props.actionData : this.state.data[0];

		return (
			<React.Fragment>
				<Row type="flex" justify="space-around" align="bottom">
					<Col span={24}>
						<Affix offsetTop={0} onChange={affixed => {}}>
							<Row style={{height: 100, backgroundColor: "#EEEEEE"}}
								type="flex"
								justify="space-around"
								align="middle"
								>
								<Col span={16}>
									<Row
										className=""
										type="flex"
										justify="space-around"
										align="middle"
										>
										<Col span={10}>
											<Breadcrumb>
												<Breadcrumb.Item><a onClick={() => this.props.showSearchPage()}>Search</a></Breadcrumb.Item>
												<Breadcrumb.Item>Action</Breadcrumb.Item>
											</Breadcrumb>
										</Col>
										<Col span={6}>
										{(getActionState(actionData) !== "finish") &&
											<Button
												size="large"
												type="primary"
												onClick={() => {
													this.onContributionButtonClick();
												}}>
												{(this.state.isContribute)
													?
													"Sauvegarder"
													: (this.state.alreadyContributed) ? "Modifier" : "Contribuer"
												}
											</Button>
										}
										</Col>
									</Row>
								</Col>
							</Row>
						</Affix>
						<ActionDetail
							ref={this.setActionDetailRef}
							actionId={actionData.id}
							actionData={actionData}
							isContribute={this.state.isContribute}
							alreadyContributed={this.state.alreadyContributed}
							addContributions={(contrib) => { this.addContributions(contrib); }}
							toggleAlreadyContributed={() => {this.toggleAlreadyContributed(); }}
							toggleModal={() => this.toggleModal()}
						/>
					</Col>
				</Row>
				<Modal
					centered
					visible={this.state.modalVisible}
					onCancel={() => {this.toggleModal()}}
					onOk={() => {this.toggleModal()}}
					>
					<LoginForm
						onsuccess = {() => {this.onLoginSuccess()}}
						nextpage={PAGES.search}
						changeContentPageOptions={actionData}
						changeContentPage={this.props.changeContentPage}
					/>
				</Modal>
			</React.Fragment>
		);
	}
}

export default SearchActionDetail;
