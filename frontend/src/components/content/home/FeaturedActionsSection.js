/* ************************************************************************** */
/*                                                                            */
/*  FeaturedActionsSection.js                                                 */
/*                                                                            */
/*   By: elhmn <www.elhmn.com>                                                */
/*             <nleme@live.fr>                                                */
/*                                                                            */
/*   Created: Thu Jan 01 01:00:00 1970                        by elhmn        */
/*   Updated: Sat Jun 15 22:21:59 2019                        by bmbarga      */
/*                                                                            */
/* ************************************************************************** */

import	React from 'react';
import	{ Row, Col, Button } from 'antd';
import	'antd/dist/antd.css';
import CardMeta from '../../common/CardMeta.js'
import { JsonRequest } from '../../../utilities/DataHandler';
import Config from '../../../config.js'
import { Link } from "react-router-dom";
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

class	FeaturedActionsSection extends React.Component
{
    constructor (props)
    {
        super(props);
        this.state = {
            data: undefined
        };
    }

    GetFeaturedActions()
    {
        const onsuccess = ((response) => {
            this.setState({ data: JSON.parse(response || []) });
        }).bind(this);

        const onerror = ((response) => {
        }).bind(this);

        JsonRequest({
            url: `${Config.apiDomainName}/v1/public/featuredactions`,
            method: 'get',
            onsuccess,
            onerror
        });
    }

    componentDidMount()
    {
        this.GetFeaturedActions();
    }

	render ()
	{
        const   { data = [] } = this.state;

        return (
			<div>
				<Row id="featured-actions-section" type="flex" justify="space-around" align="middle">
                    {
                        data.map(elem =>
                            <Col key={elem.id}>
								<Card elem={elem}/>
                            </Col>
                        )
                    }
                </Row>
				<Row type="flex" justify="space-around" align="middle">
				    <Link to="/search" onClick={() => window.scrollTo(0,0)}>
                        <Button
                            type="primary"
                            icon="plus"
			                size = "large"
                        >
                         Plus d'actions
                        </Button>
                    </Link>
                </Row>
			</div>
		);
	}
};

export default FeaturedActionsSection;
