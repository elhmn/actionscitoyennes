/* ************************************************************************** */
/*                                                                            */
/*  AfterDetailsForm.js                                                       */
/*                                                                            */
/*   By: elhmn <www.elhmn.com>                                                */
/*             <nleme@live.fr>                                                */
/*                                                                            */
/*   Created: Thu Jan 01 01:00:00 1970                        by elhmn        */
/*   Updated: Mon Apr 15 14:13:26 2019                        by bmbarga      */
/*                                                                            */
/* ************************************************************************** */

import	React from 'react';
import	Fragment from 'react';

import
{
	Row,
	Col,
	Form,
	Button,
	Input,
	InputNumber,
	Divider,
	Icon,
	Select,
	AutoComplete,
	TimePicker
} from 'antd';
import PriceInput from '../../common/PriceInput'
import BaseAfterNeedsForm from './AfterNeedsForm'
import	Countries from '../../../res/countries';
import { timeFormat } from '../../common/Constants';
import moment from 'moment';

let uuid = 1;

class	AfterDetailsContent extends React.Component
{
	constructor(props)
    {
        super(props);

        this.state = {
            country: props.afterData.country || '',
            city: props.afterData.city || '',
        }

        this.handleCityChange = this.handleCityChange.bind(this);
        this.handleCountryChange = this.handleCountryChange.bind(this);
    }

    handleCityChange(value)
    {
        this.setState({ city: value});
    }

    handleCountryChange(value)
    {
        this.setState({ country: value});
    }

	render ()
	{
		function onChange (value) {
		}

		const formItemLayout = {
			labelCol: {
			},
			wrapperCol: {
			},
		};

		const formItemLayoutWithOutLabel = {
			wrapperCol: {
			},
		};

		const { getFieldDecorator } = this.props.form;
		const { afterData } = this.props;

		const TimePickerConfig = {
			rules: [{ type: 'object', required: true, message: 'Rajoutez une heure!' }],
			initialValue: afterData.timePicker
		};

		return (
			<React.Fragment >
				<Form.Item>
					<Divider> Proposez un after </Divider>
				</Form.Item>
				<Form.Item {...formItemLayout} label="Titre">
				{
					getFieldDecorator('title', {
						rules: [{ required: true, message: 'Rajoutez un titre !' }],
						initialValue: afterData.title
					})
					(
					<Input size="large" placeholder="Titre" />
				)
				}
				</Form.Item>

				<Form.Item {...formItemLayout} label="Addresse">
				{
					getFieldDecorator('address_info', {
						rules: [{ required: true, message: 'Rajoutez une addesse!' }],
						initialValue: afterData.address_info
					})
					(
					<Input size="large" placeholder="Addresse"/>
				)
				}
				</Form.Item>

				<Form.Item {...formItemLayout} label="Code postale">
				{
					getFieldDecorator('postalcode', {
						initialValue: afterData.postalcode
					})
					(
					<Input size="large" placeholder="Code postale" />
				)
				}
				</Form.Item>

				<Form.Item {...formItemLayout} label="Pays">
				{
					getFieldDecorator('country', {
						rules: [{ required: true, message: 'Rajoutez un pays !' }],
						initialValue: afterData.country
					})
					(
						<Select
							showSearch
							size="large"
							style={{minWidth: 150}}
							placeholder="Pays"
							onChange={(value) => this.handleCountryChange(value)}
							>
							{Object.keys(Countries).sort().map((elem =>
								<Select.Option key={elem} value={elem}>{elem}</Select.Option>
							))}
						</Select>
					)
				}
				</Form.Item>

				<Form.Item {...formItemLayout} label="Ville">
				{
					getFieldDecorator('city', {
						rules: [{ required: true, message: 'Rajoutez une ville !' }],
						initialValue: afterData.city
					})
					(
						<AutoComplete
							dataSource={this.state.country
								&& Countries[this.state.country].sort()}
							style={{ minWidth: 150 }}
							size="large"
							filterOption={(inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
							onSelect={(value) => this.handleCityChange(value)}
							onSearch={(value) => this.handleCityChange(value)}
							placeholder="Ville"
						  />
					)
				}
				</Form.Item>

				<Form.Item
					{...formItemLayout}
					label="Quand"
				>
				{getFieldDecorator('timePicker', TimePickerConfig)(
					<TimePicker defaultValue={moment('12:08', timeFormat)} format={timeFormat} />
				)}
				</Form.Item>

				<Form.Item {...formItemLayout} label="Description">
				{
					getFieldDecorator('description', {
						rules: [{ required: true, message: 'Rajoutez une description !' }],
						initialValue: afterData.description
					})
					(
					<Input.TextArea rows={6} placeholder="Enter a short description"/>
				)
				}
				</Form.Item>
			</React.Fragment>
		);
	}
};

class	BaseAfterDetailsForm extends React.Component
{
	handleSubmit(event)
	{
		event.preventDefault();
		this.props.form.validateFields((err, values) =>
		{
			if (!err)
			{
				this.props.setAfterData(values);
				this.props.nextCallback();
			}
		});
	}

	prefillAfterData()
	{
		const	{ actionData, afterData } = this.props;
		let		data = {...this.props.afterData};

		if (Object.keys(this.props.afterData).length <= 0)
		{
			data = {
				country: actionData.country,
				city: actionData.city,
				time: actionData.time,
				date: actionData.date,
				...data,
			};
		}
		return (data);
	}

	componentDidMount()
	{
		this.props.afterData
			&& Object.keys(this.props.afterData).length !== 0
			&& this.props.setWithAfter(true);
	}

render ()
{
	function onChange (value) {
	}

	const formItemLayout = {
		labelCol: {
		},
		wrapperCol: {
		},
	};

	const formItemLayoutWithOutLabel = {
		wrapperCol: {
		},
	};

	const { getFieldDecorator } = this.props.form;

	return (
		<React.Fragment >
			<Form layout="horizontal" onSubmit={(event) => this.handleSubmit(event)}>
			{ !this.props.withAfter ?
					<Form.Item {...formItemLayoutWithOutLabel}>
						<Button size="large" className="toggle-after-button" type="dashed" onClick={() => this.props.setWithAfter(true)} block>
							<Icon type="plus" /> Rajoutez un after
						</Button>
					</Form.Item>
				:
				<React.Fragment>
					<AfterDetailsContent {...this.props} afterData={this.prefillAfterData()}/>
					<BaseAfterNeedsForm {...this.props} afterData={this.prefillAfterData()}/>
					<Form.Item {...formItemLayoutWithOutLabel}>
						<Button size="large" className="toggle-after-button" type="dashed" onClick={() => this.props.setWithAfter(false)} block>
							<Icon type="minus" /> Retirez l'after
						</Button>
					</Form.Item>
				</React.Fragment>
			}
				<Form.Item>
					{this.props.navButton()}
				</Form.Item>
			</Form>
		</React.Fragment>
		);
	}
};

const   AfterDetailsForm = Form.create()(BaseAfterDetailsForm);

export default AfterDetailsForm;
