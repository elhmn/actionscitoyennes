/* ************************************************************************** */
/*                                                                            */
/*  MaterialNeedContribution.js                                               */
/*                                                                            */
/*   By: elhmn <www.elhmn.com>                                                */
/*             <nleme@live.fr>                                                */
/*                                                                            */
/*   Created: Thu Jan 01 01:00:00 1970                        by elhmn        */
/*   Updated: Sun Jun 16 02:10:41 2019                        by bmbarga      */
/*                                                                            */
/* ************************************************************************** */

import	React from 'react';
import	{ Row, Col } from 'antd';
import	{ InputNumber } from 'antd';

export const	MaterialNeedContribution = (props) => {
	const	{ need, onChange, contrib } = props;

	return (
		<React.Fragment>
			<Col className="action-contributions" span={8} xs={22} sm={22} md={8}>
				<Row type="flex" justify="middle" align="center">
				    <h4 style={{marginRight: "5px"}}>Fournissez</h4>
				    <InputNumber min={0} max={parseFloat(need.required || 0)}
					    defaultValue={(contrib && contrib.amount) || 0} onChange={onChange} />
				    <h4 style={{marginLeft: "5px"}}>{' '} {(need.unit || 'unit') }</h4>
				</Row>
			</Col>
		</React.Fragment>
	);
};

export default MaterialNeedContribution;
