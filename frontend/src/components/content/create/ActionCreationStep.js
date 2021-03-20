/* ************************************************************************** */
/*                                                                            */
/*  ActionCreationStep.js                                                     */
/*                                                                            */
/*   By: elhmn <www.elhmn.com>                                                */
/*             <nleme@live.fr>                                                */
/*                                                                            */
/*   Created: Thu Jan 01 01:00:00 1970                        by elhmn        */
/*   Updated: Fri Feb 22 05:28:47 2019                        by elhmn        */
/*                                                                            */
/* ************************************************************************** */

import	React from 'react';
import	'../../../css/ActionCreationStep.css';
import
{
    Row,
    Col,
    Button,
    Input,
	Steps,
	message,
} from 'antd';

import moment from 'moment';
import { PAGES, timeFormat, dateFormat } from '../../common/Constants';
import Config from '../../../config.js'

const Step = Steps.Step;

const buildMaterials = (data) =>
{
    let     ret = [];

    if (!data || !data.matKeys)
        return (ret);
    for (let i = 0; i < data.matKeys.length; i++)
    {
        if (data.materials[i])
        {
            ret.push({
                title: data.materials[i] || '',
                required: data.materialsCount[i] || '',
                unit: data.materialsUnit[i] || 'unit'});
        }
    }
    return (ret);
}

const materialsFromMaterialNeeds = (data) =>
{
	let materials = [];
	let materialsCount = [];
	let materialsUnit = [];
	let materialsIds = [];
	let matKeys = [];

    if (!data || !data.materialNeeds)
        return {};

    for (let i = 0; i < data.materialNeeds.length; i++)
    {
        if (data.materialNeeds[i])
        {
            materials.push(data.materialNeeds[i].title || '');
            materialsCount.push(data.materialNeeds[i].required || '');
            materialsUnit.push(data.materialNeeds[i].unit || 'unit');
            materialsIds.push({
				id: data.materialNeeds[i].id,
				action_id: data.materialNeeds[i].action_id,
				extra_id: data.materialNeeds[i].extra_id,
				user_id: data.materialNeeds[i].user_id,
			});
            matKeys.push(i);
        }
    }
    return ({
		materials,
		materialsCount,
		materialsUnit,
		materialsIds,
		matKeys
	});
}

class ActionCreationStep extends React.Component {

	constructor(props) {
		super(props);

		const	mustBePatched = !!this.props.action;
		const	extraMustBePatched =  this.props.action && !!this.props.action.extra;
		const	data = this.props.action && this.apiToFormData(this.props.action);

		this.state = {
			mustBePatched,
			extraMustBePatched,
			current: 0,
			withAfter: false,
			actionData: data && data.action || {},
			afterData: data && data.after || {},
		};
	}

	apiToFormAction(action)
	{
		const formData = action && {
			...action,
			country: action.coutry,
			postalcode: action.postal_code,
			datePicker: moment(action.date, dateFormat),
			timePicker: moment(action.time, timeFormat),
			...materialsFromMaterialNeeds(action),
			fileList: action.images
						&& action.images.map((img) => ({
							name: img.file,
							uid: img.file,
							url: `${Config.apiDomainName}/v1/public/images/actions/${img.file}`,
						})),
		};
		return (formData);
	}

	apiToFormExtra(extra)
	{
		const formData = extra && {
			...extra,
			country: extra.coutry,
			postalcode: extra.postal_code,
			datePicker: moment(extra.date, dateFormat),
			timePicker: moment(extra.time, timeFormat),
			...materialsFromMaterialNeeds(extra)
		};
		return (formData);
	}

	apiToFormData(apiData)
	{
		const after = {
			...this.apiToFormExtra(apiData.extra)
		};

		const action = {
			...this.apiToFormAction(apiData)
		}

		return ({
			action,
			after,
		});
	}

	next() {
		const current = this.state.current + 1;
		this.setState({ current });
	}

	setActionData(values) {
		this.setState({ actionData:{...this.state.actionData, ...values} }, () => {
		});
	}

	setAfterData(values) {
		this.setState({ afterData:{...this.state.afterData, ...values} });
	}

	prev() {
		const current = this.state.current - 1;
		this.setState({ current });

	}

	setWithAfter(withAfter)
	{
		this.setState({withAfter});
	}

	render() {
		const { current } = this.state;
		const { steps } = this.props;

		const NavButton = (props) => {
			return (
				<Row type="flex" justify="space-around">
					<div className="steps-action">
					{
						current > 0
						&&
						(
							<Button size="large" style={{ marginRight: 8 }} onClick={() => this.prev()}>
								Precedent
							</Button>
						)
					}
					{
						current < steps.length - 1
						&& <Button size="large" htmlType="submit" type="primary">Suivant</Button>
					}
					{
						current === steps.length - 1
						&&
						<Button size="large" type="primary" onClick={props.onClickDone}>Termine</Button>
					}
					</div>
				</Row>
			);
		}

		return (
			<Row type="flex" justify="space-around">
				<Col span={24}>
					{
						!this.state.mustBePatched &&
						(
							<Row type="flex" justify="space-around">
								<Col span={24}>
									<Steps size={this.props.action ? "small" : "large"} current={current}>
										{steps.map(item => <Step key={item.title} {...item}/>)}
									</Steps>
								</Col>
							</Row>
						)
					}
					<Row type="flex" justify="space-around">
						<Col span={16} xs={22} sm={22} md={16}>
							<div className="steps-content">{React.cloneElement(steps[current].content,
								{
									navButton: NavButton,
									nextCallback: () =>  this.next(),
									actionData: this.state.actionData,
									afterData: this.state.afterData,
									mustBePatched: this.state.mustBePatched,
									extraMustBePatched: this.state.extraMustBePatched,
									setActionData: (values) => this.setActionData(values),
									setAfterData: (values) => this.setAfterData(values),
									setWithAfter: (value) => this.setWithAfter(value),
									...this.state
								}
							)}
							</div>
						</Col>
					</Row>

				</Col>
			</Row>
		);
	}
}

export default ActionCreationStep;
