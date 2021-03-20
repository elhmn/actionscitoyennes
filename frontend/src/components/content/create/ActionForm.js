/* ************************************************************************** */
/*                                                                            */
/*  ActionForm.js                                                             */
/*                                                                            */
/*   By: elhmn <www.elhmn.com>                                                */
/*             <nleme@live.fr>                                                */
/*                                                                            */
/*   Created: Thu Jan 01 01:00:00 1970                        by elhmn        */
/*   Updated: Thu Sep 27 11:15:44 2018                        by elhmn        */
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
	InputNumber,
	Divider,
	Icon
} from 'antd';
import PriceInput from '../../common/PriceInput'


let uuid = 1;

class	BaseActionForm extends React.Component
{
	handleSubmit(event)
	{
		event.preventDefault();
		this.props.form.validateFields((err, values) =>
		{
			if (!err)
			{
			}
		});
	}

	remove = (k) => {
		const { form } = this.props;
	// 		can use data-binding to get
		const keys = form.getFieldValue('matKeys');
		// We need at least one passenger
		if (keys.length === 1) {
			return;
		}

		// can use data-binding to set
		form.setFieldsValue({
			matKeys: keys.filter(key => key !== k),
		});
	}

	add = () => {
		const { form } = this.props;
		// can use data-binding to get
		const keys = form.getFieldValue('matKeys');
		const nextKeys = keys.concat(uuid);
		uuid++;
		// can use data-binding to set
		// important! notify form to detect changes
		form.setFieldsValue({
			matKeys: nextKeys,
		});
	}

	checkPrice = (rule, value, callback) => {
// 		if (value.number > 0) {
// 			callback();
// 			return;
// 		}
// 		callback('Price must greater than zero!');
		callback();
		return;
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

	const removeLogo = (k) => {
		return (
			keys.length > 1
			? (
				<Icon
					className="dynamic-delete-button"
					type="minus-circle-o"
					disabled={keys.length === 1}
					onClick={() => this.remove(k)}
				/>
			)
			: ''
		);
	};

	const { getFieldDecorator, getFieldValue } = this.props.form;
	getFieldDecorator('matKeys', { initialValue: [0] });
	const keys = getFieldValue('matKeys');
	const formItems = keys.map((k, index) => {
		return (
			<Form.Item
				{...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
				label={index === 0 ? 'Material' : ''}
				required={false}
				key={k}
				>
				{
					getFieldDecorator(`materials[${k}]`)
					(
						<Input suffix={removeLogo(k)} size="large" placeholder="Add material need" style={{width: '80%'}}/>
					)
				}
				{
					getFieldDecorator(`materialsCount[${k}]`)
					(
						<InputNumber
							size="large"
							initialValue={1}
							min={0}
							max={100}
							formatter={value => `${value}`}
							parser={value => value.replace('%', '')}
							onChange={onChange}
							style={{ marginLeft: 10}}
						/>
					)
				}
			</Form.Item>
		);
	});

	const emailLogo = <Icon type="mail"/>;
	const passwordLogo = <Icon type="lock"/>;
	return (
		<React.Fragment >
			<Form layout="horizontal" onSubmit={(event) => this.handleSubmit(event)}>
				<Form.Item {...formItemLayout} label="Title">
				{
					getFieldDecorator('title', {
						rules: [{ required: true, message: 'Please input a title !' }],
					})
					(
					<Input size="large" placeholder="Title" />
				)
				}
				</Form.Item>

				<Form.Item {...formItemLayout} label="Address">
				{
					getFieldDecorator('address_info', {
						rules: [{ required: true, message: 'Please input an address!' }],
					})
					(
					<Input size="large" placeholder="Address"/>
				)
				}
				</Form.Item>

				<Form.Item {...formItemLayout} label="Postal code">
				{
					getFieldDecorator('postalcode', {
						rules: [{ required: true, message: 'Please input a postal code !' }],
					})
					(
					<Input size="large" placeholder="Postal code" />
				)
				}
				</Form.Item>

				<Form.Item {...formItemLayout} label="City">
				{
					getFieldDecorator('city', {
						rules: [{ required: true, message: 'Please input a city !' }],
					})
					(
					<Input size="large" placeholder="City" />
				)
				}
				</Form.Item>

				<Form.Item {...formItemLayout} label="Country">
				{
					getFieldDecorator('country', {
						rules: [{ required: true, message: 'Please input a country !' }],
					})
					(
					<Input size="large" placeholder="Country" />
				)
				}
				</Form.Item>

				<Form.Item {...formItemLayout} label="Description">
				{
					getFieldDecorator('description', {
						rules: [{ required: true, message: 'Please input a description !' }],
					})
					(
					<Input.TextArea rows={6} placeholder="Enter a short description"/>
				)
				}
				</Form.Item>

				<Form.Item>
				<Divider> Needs </Divider>
				</Form.Item>

				<Form.Item {...formItemLayout} label="People">
				{
					getFieldDecorator('people')
					(
						<InputNumber
							size="large"
							initialValue={1}
							min={0}
							max={100}
							formatter={value => `${value}`}
							parser={value => value.replace('%', '')}
							onChange={onChange}
						/>
					)
				}
				</Form.Item>

				{formItems}

				<Form.Item {...formItemLayoutWithOutLabel}>
					<Button size="large" type="dashed" onClick={this.add} block>
						<Icon type="plus" /> Add field
					</Button>
				</Form.Item>

				<Form.Item label="Financial">
				{
					getFieldDecorator('financial', {
						initialValue: { number: 0, currency: 'rmb' },
						rules: [{ validator: this.checkPrice }],
					})(<PriceInput size="large"/>)
				}
				</Form.Item>

				<Form.Item>
				<Divider> After </Divider>
				</Form.Item>

				<Form.Item>
					<a className="forgot-password" href="">Mot de passe oublie ?</a>
				</Form.Item>
				<Form.Item>
					<Button type="primary" htmlType="submit" size="large" block>
						Log in
					</Button>
				</Form.Item>
			</Form>
		</React.Fragment>
		);
	}
};

const   ActionForm = Form.create()(BaseActionForm);

export default ActionForm;
