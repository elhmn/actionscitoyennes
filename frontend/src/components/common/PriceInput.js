/* ************************************************************************** */
/*                                                                            */
/*  PriceInput.js                                                             */
/*                                                                            */
/*   By: elhmn <www.elhmn.com>                                                */
/*             <nleme@live.fr>                                                */
/*                                                                            */
/*   Created: Thu Jan 01 01:00:00 1970                        by elhmn        */
/*   Updated: Thu Sep 27 11:11:31 2018                        by elhmn        */
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
	Select
} from 'antd';

const Option = Select.Option;

class PriceInput extends React.Component {
	constructor(props) {
		super(props);

		const value = props.value || {};
		this.state = {
			number: value.number || 0,
			currency: value.currency || 'rmb',
		};
	}

	componentWillReceiveProps(nextProps) {
// 		Should be a controlled component.
			if ('value' in nextProps) {
				const value = nextProps.value;
				this.setState(value);
			}
	}

	handleNumberChange = (e) => {
		const number = parseInt(e.target.value || 0, 10);
		if (isNaN(number)) {
			return;
		}
		if (!('value' in this.props)) {
			this.setState({ number });
		}
		this.triggerChange({ number });
	}

	handleCurrencyChange = (currency) => {
		if (!('value' in this.props)) {
			this.setState({ currency });
		}
		this.triggerChange({ currency });
	}

	triggerChange = (changedValue) => {
		// Should provide an event to pass value to Form.
		const onChange = this.props.onChange;
		if (onChange) {
			onChange(Object.assign({}, this.state, changedValue));
		}
	}

	render() {
		const { size } = this.props;
		const state = this.state;
		return (
			<span>
				<Input
					type="text"
					size={size}
					value={state.number}
					onChange={this.handleNumberChange}
					style={{ width: '65%', marginRight: '3%' }}
				/>
				<Select
					value={state.currency}
					size={size}
					style={{ width: '32%' }}
					onChange={this.handleCurrencyChange}
				>
					<Option value="rmb">RMB</Option>
					<Option value="dollar">Dollar</Option>
				</Select>
			</span>
		);
	}
}

export default PriceInput;
