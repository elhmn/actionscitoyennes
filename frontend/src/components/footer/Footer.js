/* ************************************************************************** */
/*                                                                            */
/*  Footer.js                                                                 */
/*                                                                            */
/*   By: elhmn <www.elhmn.com>                                                */
/*             <nleme@live.fr>                                                */
/*                                                                            */
/*   Created: Thu Jan 01 01:00:00 1970                        by elhmn        */
/*   Updated: Mon Apr 15 13:27:04 2019                        by bmbarga      */
/*                                                                            */
/* ************************************************************************** */

import 'antd/dist/antd.css';
import React from 'react';
import	{ Row, Col, Icon } from 'antd';
import '../../css/main.css';
import '../../css/Footer.css';

class	Footer extends React.Component
{
	render ()
	{
		return (
			<Row id="footer" type="flex" justify="space-around" align="middle">
				<Col className="col-100 text-align-center">
					Rejoignez la communaute <a target="_blank" href="https://www.facebook.com/Actions-citoyennes-408765399676090"><Icon type="facebook" style={{ fontSize: '30px'}}/></a>
				</Col>
				<Col className="col-100 text-align-center">
					Copyright © 2019 <a target="_blank" href="http://www.elhmn.com">Boris Mbarga</a> - All rights reserved
				</Col>
			</Row>
		);
	}
};

export default Footer;
