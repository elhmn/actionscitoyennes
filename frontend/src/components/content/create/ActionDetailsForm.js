/* ************************************************************************** */
/*                                                                            */
/*  ActionDetailsForm.js                                                      */
/*                                                                            */
/*   By: elhmn <www.elhmn.com>                                                */
/*             <nleme@live.fr>                                                */
/*                                                                            */
/*   Created: Thu Jan 01 01:00:00 1970                        by elhmn        */
/*   Updated: Fri May 03 13:39:46 2019                        by bmbarga      */
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
	DatePicker,
	InputNumber,
	Divider,
	Icon,
	Select,
	TimePicker,
	AutoComplete
} from 'antd';
import PriceInput from '../../common/PriceInput';
import UploadDrag from '../../common/UploadDrag';
import	Countries from '../../../res/countries';
import { timeFormat } from '../../common/Constants';
import moment from 'moment';

let uuid = 1;

class	BaseActionDetailsForm extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            country: '',
            city: '',
			fileList: [],
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

	handleSubmit(event)
	{
		event.preventDefault();
		this.props.form.validateFields((err, values) =>
		{
			if (!err)
			{
				this.props.setActionData(values);
				this.props.nextCallback();
			}
		});
	}

	//is called when an image is added
	beforeUpload(fileList)
	{
		this.setState({
			fileList,
		}, () => {
			this.props.setActionData({
				fileList: [...this.state.fileList]
			});
		});
	}

	//is called when an image is removed
	onRemove(fileList)
	{
		this.setState({
			fileList,
		}, () => {
			this.props.setActionData({
				fileList: [...this.state.fileList]
			});
		});
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

		const { getFieldDecorator, setFieldsValue } = this.props.form;
		const { actionData } = this.props;
		const DatePickerConfig = {
			rules: [{ type: 'object', required: true, message: 'Rajoutez une date!' }],
			initialValue: actionData.datePicker
		};

		const TimePickerConfig = {
			rules: [{ type: 'object', required: true, message: 'Rajoutez une heure!' }],
			initialValue: actionData.timePicker
		};

		return (
			<React.Fragment >
				<Form layout="horizontal" onSubmit={(event) => this.handleSubmit(event)}>
					<Form.Item>
					<Divider> Proposez une action </Divider>
					</Form.Item>

					<Form.Item {...formItemLayout} label="Titre">
					{
						getFieldDecorator('title', {
							rules: [{ required: true, message: 'Rajoutez un titre !' }],
							initialValue: actionData.title
						})
						(
							<Input size="large" placeholder="Titre"/>
						)
					}
					</Form.Item>

					<Form.Item {...formItemLayout} label="Addresse">
					{
						getFieldDecorator('address_info', {
							rules: [{ required: true, message: 'Rajoutez une addesse!' }],
							initialValue: actionData.address_info
						})
						(
						<Input size="large" placeholder="Addresse"/>
					)
					}
					</Form.Item>

					<Form.Item {...formItemLayout} label="Code postale">
					{
						getFieldDecorator('postalcode', {
							initialValue: actionData.postalcode
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
							initialValue: actionData.country
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
							initialValue: actionData.city
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
					{getFieldDecorator('datePicker', DatePickerConfig)(
						<DatePicker size="large"/>
					)}
					</Form.Item>
					<Form.Item
						{...formItemLayout}
					>
					{getFieldDecorator('timePicker', TimePickerConfig)(
						<TimePicker defaultValue={moment('12:08', timeFormat)} format={timeFormat} />
					)}
					</Form.Item>
					<Form.Item {...formItemLayout} label="Description">
					{
						getFieldDecorator('description', {
							rules: [{ required: true, message: 'Rajoutez une description !' }],
							initialValue: actionData.description
						})
						(
						<Input.TextArea
						rows={6}
						placeholder="Decrivez succinctement votre action, n'oubliez surtout pas d'y ajouter un contact (email ou numero de telephone)!"/>
					)
					}
					</Form.Item>
					<Form.Item>
						<p> Rajouter des images a votre action : </p>
						<UploadDrag
							listType={actionData.images ? 'picture' : 'text'}
							beforeUpload={this.beforeUpload.bind(this)}
							onRemove={this.onRemove.bind(this)}
							fileList={this.props.actionData.fileList || []}
						/>
					</Form.Item>
					<Form.Item>
						{this.props.navButton()}
					</Form.Item>
				</Form>
			</React.Fragment>
			);
	}
};

const   ActionDetailsForm = Form.create()(BaseActionDetailsForm);

export default ActionDetailsForm;
