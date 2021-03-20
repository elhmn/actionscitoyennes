/* ************************************************************************** */
/*                                                                            */
/*  Header.js                                                                 */
/*                                                                            */
/*   By: elhmn <www.elhmn.com>                                                */
/*             <nleme@live.fr>                                                */
/*                                                                            */
/*   Created: Thu Jan 01 01:00:00 1970                        by elhmn        */
/*   Updated: Mon Jun 17 10:10:28 2019                        by bmbarga      */
/*                                                                            */
/* ************************************************************************** */

import 'antd/dist/antd.css';
import React from 'react';
import	{ Row, Col, message, Icon } from 'antd';
import	{ Menu } from 'antd';
import '../../css/Header.css';
import '../../css/main.css';
import { PAGES } from '../common/Constants';
import { JsonRequest } from '../../utilities/DataHandler';
import Config from '../../config.js'
import { BrowserRouter as Router, Route, Link, withRouter } from "react-router-dom";
import  { AppConsumer } from '../store/AppContext';
import LogoImage from '../../imgs/ac-logo-with-text.png';

class	ListItems extends React.Component
{
	constructor(props)
	{
		super(props);
	}

    logout()
    {
        const data = {
            token: localStorage.getItem('token'),
        }

        const onsuccess = (response) => {
            const data =  response && JSON.parse(response) || [];
            localStorage.removeItem('token');
            localStorage.removeItem('userid');
            localStorage.removeItem('user');
            message.success('logout success');
			this.props.store.actions.updateToken();
        };

        const onerror = (response) => {
            localStorage.removeItem('token');
            localStorage.removeItem('userid');
            message.error('logout failed');
			this.props.store.actions.updateToken();
        };

        if (!data)
        {
            return ;
        }

        JsonRequest({
            url: `${Config.authDomainName}/logout`,
            data,
            method: 'post',
            onsuccess,
            onerror
        });
    }

	changePage(currentPage)
	{
		this.props.setCurrentPage(currentPage);
	        this.props.toggleMenuList();
	}

    render()
	{
        const token = localStorage.getItem('token');
        const user = this.props.store.user;

		return (
			<Row id="header-menu" type="flex" justify="end" align="bottom">
				<Col span={24} xs={24} sm={24} md={4}>
					<Link to="/" className="header-link">
						<span className={`placement-vr ${(this.props.currentPage === PAGES.home) &&
								'menu-item-highlight'
							}`}
							key={PAGES.home}
							onClick={() => {this.changePage(PAGES.home)}}>
							Acceuil
						</span>
					</Link>
				</Col>

				<Col span={24} xs={24} sm={24} md={4}>
					<Link to="/create" className="header-link">
						<span className={`placement-vr ${(this.props.currentPage === PAGES.create) &&
								'menu-item-highlight'
							}`}
							key={PAGES.create}
							onClick={() => {this.changePage(PAGES.create)}}>
							Creer
						</span>
					</Link>
				</Col>

				{!token && (
					<Col span={24} xs={24} sm={24} md={4}>
						<Link to="/login" className={"header-link"}>
							<span className={`placement-vr ${(this.props.currentPage === PAGES.login) &&
									'menu-item-highlight'
								}`}
								key={PAGES.login}
								onClick={() => {this.changePage(PAGES.login)}}>
								Connexion
							</span>
						</Link>
					</Col>
				)}

				{!token && (
					<Col span={24} xs={24} sm={24} md={4}>
						<Link to="/signup" className="header-link">
							<span className={`placement-vr ${(this.props.currentPage === PAGES.signup) &&
									'menu-item-highlight'
								}`}
								key={PAGES.signup}
								onClick={() => {this.changePage(PAGES.signup)}}>
									Inscription
							</span>
						</Link>
					</Col>
				)}

				{token && (
					<Col span={24} xs={24} sm={24} md={4}>
						<Link to="/activity" className="header-link">
							<span className={`placement-vr ${(this.props.currentPage === PAGES.activity) &&
									'menu-item-highlight'
								}`}
								key={PAGES.activity} onClick={() => {this.changePage(PAGES.activity)}}>
								Activite
							</span>
						</Link>
					</Col>
				)}

				{token && (
					<Col span={24} xs={24} sm={24} md={4}>
						<Link to="/profile" className="header-link">
							<span className={`placement-vr ${(this.props.currentPage === PAGES.profile) &&
									'menu-item-highlight'
								}`}
								key={PAGES.profile} onClick={() => {this.changePage(PAGES.profile)}}>
									{user && user.firstname}
							</span>
						</Link>
					</Col>
				)}

				{token && (
					<Col span={24} xs={24} sm={24} md={4}>
						<Link to="/" className="header-link">
							<span className='placement-vr'
								key={PAGES.logout} onClick={() => this.logout()}>
									Logout
							</span>
						</Link>
					</Col>
				)}
			</Row>
		);
	}
}

class	Header extends React.Component
{
	constructor(props)
	{
		super(props);
        const currentPage = this.props.location.pathname.split("/")[1] || PAGES.home;
		this.state = {
			headerLogoJustify: 'space-between',
			showMenuList: false,
			currentPage,
		};
	}

	setHeaderLogoJustify(media) {
		if (media.matches) {
			this.setState({ headerLogoJustify: 'start'});
			this.setState({ showMenuList: false });
		}
		else {
			this.setState({ headerLogoJustify: 'space-between'});
			this.setState({ showMenuList: true });
		}
	}

    toggleMenuList() {
        if (this.media.matches) {
            this.setState({ showMenuList: !this.state.showMenuList });
        }
    }

    setCurrentPage(currentPage) {
        this.setState({ currentPage });
    }

	componentDidMount() {
		this.media = window.matchMedia('only screen and (max-width:600px)');
		this.setHeaderLogoJustify(this.media);
		this.media.addListener(this.setHeaderLogoJustify.bind(this));
	}

	render ()
	{
		return (
			<React.Fragment>
				<Row id="header" type="flex" justify="space-between" align="bottom">
					<Col md={12} xs={12} sm={12}>
					    <Link to="/" className="header-link">
							<Row  id="header-logo" type="flex" justify={this.state.headerLogoJustify} align="middle">
								<Col>
								    <img id="home-ac-logo-image" src={LogoImage} alt="ac logo image"/>
								</Col>
							</Row>
					    </Link>
					</Col>
					<Col id="header-menu-burger-container" md={12} xs={12} sm={12}>
							<Row  id="header-menu-burger" type="flex" justify='end' align="middle">
								<Col>
						            <Icon onClick={() => this.toggleMenuList()} style={{fontSize: '40px', color: '#1890ff'}} type="menu"/>
								</Col>
							</Row>
					</Col>
					{(this.state.showMenuList) &&
					    <Col md={12} xs={24} sm={24} id="menu-items-large">
						    <ListItems
						        toggleMenuList={() => this.toggleMenuList()}
						        setCurrentPage={(currentPage) => this.setCurrentPage(currentPage)}
						        currentPage={this.state.currentPage}
							    changeContentPage={this.props.changeContentPage}
							    token={this.props.token}
							    store={this.props.store}
						    />
					    </Col>
					}
				</Row>
			</React.Fragment>
		);
	}
};

export default withRouter((props) => {
	return (
		<AppConsumer>
		{
			(store) => <Header {...props} store={store}/>
		}
		</AppConsumer>
	);
})
