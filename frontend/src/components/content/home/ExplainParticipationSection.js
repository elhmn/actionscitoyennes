/* ************************************************************************** */
/*                                                                            */
/*  ExplainParticipationSection.js                                            */
/*                                                                            */
/*   By: elhmn <www.elhmn.com>                                                */
/*             <nleme@live.fr>                                                */
/*                                                                            */
/*   Created: Thu Jan 01 01:00:00 1970                        by elhmn        */
/*   Updated: Sat Jun 15 22:10:52 2019                        by bmbarga      */
/*                                                                            */
/* ************************************************************************** */

import	React from 'react';
import	{ Row, Col } from 'antd';
import { ReactComponent as  Step1 } from '../../../imgs/s_3.svg';
import { ReactComponent as  Step2 } from '../../../imgs/s_2.svg';
import { ReactComponent as  Step3 } from '../../../imgs/s_1.svg';
import { Link } from "react-router-dom";
import	'antd/dist/antd.css';

class	ExplainParticipationSection extends React.Component
{
	render ()
	{
		return (
			<Row id="explain-participation-section" type="flex" justify="space-around" align="middle">
				<Col className="explain-participation-element">
				    <Link to="/search" onClick={() => window.scrollTo(0,0)}>
				        <Row type="flex" justify="space-around" align="middle">
					            <Step1 className="explain-participation-icon"/>
					    </Row>
				        <Row type="flex" justify="space-around" align="middle">
						    <div className="explain-participation-text">Je choisis une action</div>
					    </Row>
					</Link>
				</Col>
				<Col className="explain-participation-element">
				    <Link to="/search" onClick={() => window.scrollTo(0,0)}>
				        <Row type="flex" justify="space-around" align="middle">
					        <Step2 className="explain-participation-icon"/>
					    </Row>
				        <Row type="flex" justify="space-around" align="middle">
						    <div className="explain-participation-text">J'y participe</div>
					    </Row>
					</Link>
				</Col>
				<Col className="explain-participation-element">
				    <Link to="/create" onClick={() => window.scrollTo(0,0)}>
				        <Row type="flex" justify="space-around" align="middle">
					        <Step3 className="explain-participation-icon" />
					    </Row>
				        <Row type="flex" justify="space-around" align="middle">

						    <div className="explain-participation-text">J'ameliore notre quotidien</div>
					    </Row>
					</Link>
				</Col>
			</Row>
		);
	}
};

export default ExplainParticipationSection;
