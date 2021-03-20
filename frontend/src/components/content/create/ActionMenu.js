/* ************************************************************************** */
/*                                                                            */
/*  ActionMenu.js                                                             */
/*                                                                            */
/*   By: elhmn <www.elhmn.com>                                                */
/*             <nleme@live.fr>                                                */
/*                                                                            */
/*   Created: Thu Jan 01 01:00:00 1970                        by elhmn        */
/*   Updated: Wed Sep 26 18:49:32 2018                        by elhmn        */
/*                                                                            */
/* ************************************************************************** */

import	React from 'react';
import
{
    Row,
    Col,
    Form,
    Button,
    Input,
    Divider,
	Menu,
    Icon
} from 'antd';

class	ActionMenu extends React.Component
{
	render ()
	{
		return (
			<Menu mode="horizontal">
				<Menu.Item>
					Detail
				</Menu.Item>
				<Menu.Item>
					Needs
				</Menu.Item>
				<Menu.Item>
					After
				</Menu.Item>
			</Menu>
		);
	}
};

export default ActionMenu;
