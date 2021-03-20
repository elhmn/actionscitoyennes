/* ************************************************************************** */
/*                                                                            */
/*  DoneActionsSection.js                                                     */
/*                                                                            */
/*   By: elhmn <www.elhmn.com>                                                */
/*             <nleme@live.fr>                                                */
/*                                                                            */
/*   Created: Thu Jan 01 01:00:00 1970                        by elhmn        */
/*   Updated: Sat Feb 16 15:12:14 2019                        by elhmn        */
/*                                                                            */
/* ************************************************************************** */

import	React from 'react';
import	{ Row, Col } from 'antd';
import	{ Input } from 'antd';
import	'antd/dist/antd.css';
import CardMeta from '../../common/CardMeta.js'
import { JsonRequest } from '../../../utilities/DataHandler';
import Config from '../../../config.js'
import { PAGES } from '../../common/Constants';
import { withRouter } from "react-router-dom";

const	Card = withRouter((props) => {

	return (
		<div onClick={
			() => {
				window.scrollTo(0, 0);
				props.history.push('search?actionid=' + props.elem.id, {actionData: props.elem});
			}
		}>
			<CardMeta data={props.elem} />
		</div>
	);
});

class	DoneActionsSection extends React.Component
{
    constructor (props)
    {
        super(props);
        this.state = {
            data: null
        };
    }

    GetCompletedActions()
    {
        const onsuccess = ((response) => {
            this.setState({ data: JSON.parse(response) });
        }).bind(this);

        const onerror = ((response) => {
        }).bind(this);

        JsonRequest({
            url: `${Config.apiDomainName}/v1/public/completedactions`,
            method: 'get',
            onsuccess,
            onerror
        });
    }

    componentDidMount()
    {
        this.GetCompletedActions();
    }

	render ()
	{
		return (
			<div id="done-actions-section" >
				<Row type="flex" justify="space-around" align="middle">
					<Col span={24}>
						<p id="explain-create-section-title" className="text-align-center">
						Actions realisees
						</p>
						<p id="explain-create-section-detail-1" className="text-align-center">
						Le citoyen au coeur de l'action sociale et solidaire
						</p>
					</Col>
				</Row>
				<Row type="flex" justify="space-around" align="middle">
                {
                    this.state.data && this.state.data.map(elem =>
                        <Col key={elem.id} >
							<Card elem={elem}/>
                        </Col>
                    )
                }
				</Row>
			</div>
		);
	}
};

export default DoneActionsSection;
