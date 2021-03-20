/* ************************************************************************** */
/*                                                                            */
/*  ExplainCreateSection.js                                                   */
/*                                                                            */
/*   By: elhmn <www.elhmn.com>                                                */
/*             <nleme@live.fr>                                                */
/*                                                                            */
/*   Created: Thu Jan 01 01:00:00 1970                        by elhmn        */
/*   Updated: Sat Feb 16 10:09:22 2019                        by elhmn        */
/*                                                                            */
/* ************************************************************************** */

import	React from 'react';
import	{ Row, Col, Card, Icon , Button} from 'antd';
import	'antd/dist/antd.css';
import { PAGES } from '../../common/Constants';
import { Link } from "react-router-dom";

class	ExplainCreateSection extends React.Component
{
	render ()
	{
		return (
			<Row id="explain-create-section" type="flex" justify="space-around" align="top">
				<Col span={24}>
					<p id="explain-create-section-title" className="text-align-center">
					Creez des actions
					</p>
					<p id="explain-create-section-detail-1" className="text-align-center">
						Vous observez une situation anormale dans votre localite ?
					</p>
					<p id="explain-create-section-detail-1" className="text-align-center">
						Creez une action et contribuez au bien etre de votre communaute
					</p>

					<Row type="flex" justify="space-around" align="middle">
						<Col span={18}>
							<Row className="explain-create-container" type="flex" justify="space-around" align="middle" glutter={5}>
								<Link to="/create">
									<Button type="primary" size="large" onClick={() => {
									window.scrollTo(0, 0);
								}}>
									Je cree une action
									</Button>
								</Link>
							</Row>
						</Col>
					</Row>
				</Col>
			</Row>
		);
	}
};

export default ExplainCreateSection;
