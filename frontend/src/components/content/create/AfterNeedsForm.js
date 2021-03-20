/* ************************************************************************** */
/*                                                                            */
/*  AfterNeedsForm.js                                                         */
/*                                                                            */
/*   By: elhmn <www.elhmn.com>                                                */
/*             <nleme@live.fr>                                                */
/*                                                                            */
/*   Created: Thu Jan 01 01:00:00 1970                        by elhmn        */
/*   Updated: Mon Dec 24 18:50:48 2018                        by elhmn        */
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
	Icon,
	AutoComplete
} from 'antd';
import PriceInput from '../../common/PriceInput'
import { MaterialUnits } from '../../common/Constants'


let uuid = 1;

class	BaseAfterNeedsForm extends React.Component
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

	remove = (k) => {
		const { form } = this.props;
	// 		can use data-binding to get
		const keys = form.getFieldValue('matKeys');
		// We need at least one passenger
		if (keys.length === 1) {
			return;
		}

		const matKeys = keys.filter(key => key !== k);

		// can use data-binding to set
		form.setFieldsValue({
			matKeys: matKeys,
		});

		this.afterData = {...this.afterData, matKeys};
	}

	add = () => {
		const { form } = this.props;
		// can use data-binding to get
		const keys = form.getFieldValue('matKeys');
		const nextKeys = keys.concat(uuid);
		uuid++;

		const matKeys = nextKeys;
		// can use data-binding to set
		// important! notify form to detect changes
		form.setFieldsValue({
			matKeys: matKeys,
		});

		this.afterData = {...this.afterData, matKeys};
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
	this.afterData = this.props.afterData;

	getFieldDecorator('matKeys', { initialValue: [0] });
	const keys = getFieldValue('matKeys');
	const formItems = keys.map((k, index) => {
		return (
			<Form.Item
				{...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
				label={index === 0 ? 'Materiels' : ''}
				required={false}
				key={k}
				>
				{
					getFieldDecorator(`materials[${k}]`, {
						initialValue: this.afterData.materials
						&& this.afterData.materials[k]
					})
					(
						<Input suffix={removeLogo(k)} size="large" placeholder="Add material need" style={{width: '60%'}}/>
					)
				}
				{
					getFieldDecorator(`materialsCount[${k}]`, {
						initialValue: (this.afterData.materialsCount
						&& this.afterData.materialsCount[k]) || 1
					})
					(
						<InputNumber
							size="large"
							initialValue={1}
							min={1}
							max={100}
							formatter={value => `${value}`}
							parser={value => value.replace('%', '')}
							onChange={onChange}
							style={{ marginLeft: 10}}
						/>
					)
				}
				{
					getFieldDecorator(`materialsUnit[${k}]`, {
						initialValue: (this.afterData.materialsUnit
						&& this.afterData.materialsUnit[k]) || ''
					})
					(
						<AutoComplete
							dataSource={MaterialUnits}
							style={{ minWidth: 150 }}
							size="large"
							filterOption={(inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
							placeholder="unit"
							style={{ marginLeft: 10, width: '20%'}}
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
				<Form.Item>
				<Divider> Besoins pour l'after </Divider>
				</Form.Item>

				{formItems}

				<Form.Item {...formItemLayoutWithOutLabel}>
					<Button size="large" type="dashed" onClick={this.add} block>
						<Icon type="plus" /> Rajoutez un besoin materiel
					</Button>
				</Form.Item>

		</React.Fragment>
		);
	}
};

export default BaseAfterNeedsForm;
