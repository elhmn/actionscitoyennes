/* ************************************************************************** */
/*                                                                            */
/*  Content.js                                                                */
/*                                                                            */
/*   By: elhmn <www.elhmn.com>                                                */
/*             <nleme@live.fr>                                                */
/*                                                                            */
/*   Created: Thu Jan 01 01:00:00 1970                        by elhmn        */
/*   Updated: Wed Jan 30 11:15:13 2019                        by elhmn        */
/*                                                                            */
/* ************************************************************************** */

import	'antd/dist/antd.css';
import	'../../css/Content.css';
import	'../../css/main.css';
import	React from 'react';
import	{ Row, Col } from 'antd';
import	{ Input } from 'antd';
import	{ Button } from 'antd';
import  Home from './home/Home';
import  Create from './create/Create';
import  LogIn from './login/LogIn';
import  SignIn from './signin/SignIn';
import  Search from './search/Search';
import  SearchActionDetail from './search/SearchActionDetail';
import { PAGES } from '../common/Constants';

class	Content extends React.Component
{
    getPages()
    {
        let   pages = {};
        pages[PAGES.home] = <Home {...this.props}/>;
        pages[PAGES.create] = <Create {...this.props}/>;
        pages[PAGES.login] = <LogIn {...this.props}/>;
        pages[PAGES.signin] = <SignIn {...this.props}/>;
        pages[PAGES.search] = <Search {...this.props}/>;
        pages[PAGES.searchActionDetail] = <SearchActionDetail {...this.props}/>;
        return (pages);
    }

    renderContentPage()
    {
        return (this.getPages()[this.props.contentPage]);
    }

	render ()
	{
		return (
            <div>
                {this.renderContentPage()}
            </div>
		);
	}
};

export default Content;
