/* ************************************************************************** */
/*                                                                            */
/*  SearchActionList.js                                                       */
/*                                                                            */
/*   By: elhmn <www.elhmn.com>                                                */
/*             <nleme@live.fr>                                                */
/*                                                                            */
/*   Created:                                                 by elhmn        */
/*   Updated: Sun Jun 23 09:10:53 2019                        by bmbarga      */
/*                                                                            */
/* ************************************************************************** */

import	React from 'react';
import	{ Button, Row, Col, Affix } from 'antd';
import	SearchTopBar from './SearchTopBar';
import	ActionListSection from './ActionListSection';
import { Link } from "react-router-dom";
import { JsonRequest } from '../../../utilities/DataHandler';
import Config from '../../../config.js'

class	SearchActionList extends React.Component
{
    constructor (props)
    {
        super(props);
        this.state = {
            data: null
        };
        this.GetActions = this.GetActions.bind(this);
    }

    GetActions({ keyword = '', city = '', country = '' })
    {
        const onsuccess = ((response) => {
            this.setState({ data: JSON.parse(response) });
        }).bind(this);

        const onerror = ((response) => {
        }).bind(this);

        const onstatus = ((response, status) => {
            if (status === 204) {
                this.setState({ data: [] });
            }
        }).bind(this);


        JsonRequest({
            url: `${Config.apiDomainName}/v1/public/search/?country=${country}&city=${city}&keyword=${keyword}`,
            method: 'get',
            onsuccess,
            onerror,
            onstatus
        });
    }

    componentDidMount()
    {
        this.GetActions({ keyword: this.props.searchValue, city: this.props.searchCity, country: this.props.searchCountry });
    }

	//Putain c'est laid X)
	render ()
	{
		return (
            <div>
				<Affix offsetTop={0} onChange={affixed => {}}>
				<SearchTopBar searchValue={this.props.searchValue}
					seachCountry={this.props.searchCountry}
					searchCity={this.props.searchCity}
					onSubmit={this.GetActions}
				/>
				</Affix>
                <Row id="action-list-section-container" className="col-h-100" type="flex" justify="center">
                    <Col span={10} xs={22} sm={22} md={10}>
                    {(!this.state.data || this.state.data.length === 0 ) && (
                        <React.Fragment>
                            <Row type="flex" justify="center" className="margin-bottom-20">
                                <div> Aucunes actions trouvees  </div>
                            </Row>
                            <Row type="flex" justify="center" className="margin-bottom-20">
								    <Link to="/create">
									    <Button type="primary" size="large" onClick={() => {
									    window.scrollTo(0, 0);
								    }}>
									    Creez une action
									    </Button>
								    </Link>
                            </Row>
                        </React.Fragment>
                    )}
                        <ActionListSection
							actionData={this.state.data}
							showSearchActionDetailPage={this.props.showSearchActionDetailPage} {...this.props}/>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default SearchActionList;
