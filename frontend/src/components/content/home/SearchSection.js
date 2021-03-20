import 'antd/dist/antd.css';
import React from 'react';
import	{ Row, Col, Button } from 'antd';
import { withRouter } from 'react-router-dom'

const SearchInput = withRouter((props) =>
{
	return (
        <Button
            type="primary"
            icon="search"
			id = "home-search-button"
		    onClick={() => {
				    window.scrollTo(0, 0);
				    props.history.push('/search?value=', { search: ''});
			    }}
			size = "large"
			block
        >
        Recherchez des actions
        </Button>
		);
});

class	SearchSection extends React.Component
{
	render ()
	{
		return (
			<Row id="search-section" type="flex" justify="space-around" align="bottom">
				<Col span={24}>
					<p id="search-section-title" className="text-align-center">
					Pour une participation citoyenne
					</p>
					<p id="search-section-detail-1" className="text-align-center">
					Contribuez a de nombreuses actions sociales et solidaires pres de chez vous
					</p>
					<Row type="flex" justify="space-around" align="middle">
						<Col xs={20} sm={20} md={10} lg={10} xl={10}>
							<SearchInput/>
						</Col>
					</Row>
				</Col>
			</Row>
		);
	}
};

export default SearchSection;
