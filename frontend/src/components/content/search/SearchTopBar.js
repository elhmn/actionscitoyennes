/* ************************************************************************** */
/*                                                                            */
/*  SearchTopBar.js                                                           */
/*                                                                            */
/*   By: elhmn <www.elhmn.com>                                                */
/*             <nleme@live.fr>                                                */
/*                                                                            */
/*   Created: Sat Oct 13 09:46:13 2018                        by elhmn        */
/*   Updated: Tue Apr 09 11:56:51 2019                        by elhmn        */
/*                                                                            */
/* ************************************************************************** */

import	React from 'react';
import	{ Row, Col } from 'antd';
import	{ Input, Select } from 'antd';
import	{ Button } from 'antd';
import	Countries from '../../../res/countries.js';
import  { AutoComplete } from 'antd';

class	SearchTopBar extends React.Component
{

    constructor(props)
    {
        super(props);

        this.state = {
            country: '',
            city: '',
        }

        this.handleCityChange = this.handleCityChange.bind(this);
        this.handleCountryChange = this.handleCountryChange.bind(this);
    }

    handleCityChange(value)
    {
        this.setState({ city: value});
    }

    handleCountryChange(value)
    {
        this.setState({ country: value});
    }

	render ()
	{
		return (
			<div>
				<Row type="flex" justify="space-around" align="middle">
					<Col  span={24}>
						<Row id="search-top-bar" type="flex" justify="space-around" align="middle">
							<Col span={16} xs={22} sm={22} md={16}>
								<Row type="flex" justify="center" gutter={30}>
									<Col className="search-top-bar-element" xs={24} sm={24} md={5}>
										<Select
											autosize={true}
											showSearch
											size="large"
											style={{ width: "100%" }}
											placeholder="Pays"
                                            onChange={(value) => this.handleCountryChange(value)}
											>
											{Object.keys(Countries).map((elem =>
												<Select.Option key={elem} value={elem}>{elem}</Select.Option>
											))}
										</Select>
									</Col>
									<Col className="search-top-bar-element" xs={24} sm={24} md={5}>
									<AutoComplete
										dataSource={this.state.country
											&& Countries[this.state.country]}
										style={{ width: "100%" }}
										size="large"
										filterOption={(inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
										onSelect={(value) => this.handleCityChange(value)}
										onSearch={(value) => this.handleCityChange(value)}
										placeholder="Ville"
									  />
									</Col>
									<Col className="search-top-bar-element" span={10} xs={24} sm={24} md={10}>
										<Input.Search
											id = "search-bar"
											defaultValue={this.props.searchValue}
											placeholder={ "Recherchez des mots cles" }
											onSearch={(value) =>
                                                this.props.onSubmit({
                                                keyword: value,
                                                country: this.state.country,
                                                city: this.state.city })}
											size = "large"
											enterButton
										/>
									</Col>
								</Row>
							</Col>
						</Row>
					</Col>
				</Row>
			</div>
		);
	}
}

export default SearchTopBar;
