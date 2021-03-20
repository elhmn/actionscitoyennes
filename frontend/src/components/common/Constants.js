/* ************************************************************************** */
/*                                                                            */
/*  Constants.js                                                              */
/*                                                                            */
/*   By: elhmn <www.elhmn.com>                                                */
/*             <nleme@live.fr>                                                */
/*                                                                            */
/*   Created:                                                 by elhmn        */
/*   Updated: Thu Feb 21 17:08:50 2019                        by elhmn        */
/*                                                                            */
/* ************************************************************************** */

export const   PAGES = {
    home: "home",
    login: "login",
    create: "create",
    signup: "signup",
    search: "search",
    profile: "profile",
    activity: "activity",
	searchActionDetail: "searchActionDetail"
};

export const   MaterialUnits = [
	'kg',
	'g',
	'litre',
	'm',
	'cm',
];

export const	ActionCardImages = [
// 	require('../../imgs/cuddle.jpg'),
// 	require('../../imgs/extra.jpg'),
	require('../../imgs/stock/home_banner_2.jpeg'),
];

export const timeFormat = "HH:mm"
export const dateFormat = "YYYY-MM-DD"

export default {
    PAGES,
	ActionCardImages,
	MaterialUnits,
	timeFormat,
	dateFormat
};
