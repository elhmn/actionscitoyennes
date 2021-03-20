/* ************************************************************************** */
/*                                                                            */
/*  App.js                                                                    */
/*                                                                            */
/*   By: elhmn <www.elhmn.com>                                                */
/*             <nleme@live.fr>                                                */
/*                                                                            */
/*   Created: Sun Sep 16 20:04:48 2018                        by elhmn        */
/*   Updated: Sun Jun 16 09:01:03 2019                        by bmbarga      */
/*                                                                            */
/* ************************************************************************** */

import 'antd/dist/antd.css';
import	'../css/App.css';
import React from 'react';
import	Header from './header/Header';
import	Content from './content/Content';
import	Footer from './footer/Footer';
import  Home from './content/home/Home';
import  Create from './content/create/Create';
import  LogIn from './content/login/LogIn';
import  ResetPassword from './content/login/ResetPassword';
import  SignIn from './content/signin/SignIn';
import  Search from './content/search/Search';
import  Profile from './content/profile/Profile';
import  Activity from './content/activity/Activity';
import  SearchActionDetail from './content/search/SearchActionDetail';
import  { AppProvider, AppConsumer } from './store/AppContext';
import { PAGES } from './common/Constants';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import moment from 'moment';
import	{ message } from 'antd';


const setupMomentToFR = () => {
    moment.locale('fr', {
        months : 'janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre'.split('_'),
        monthsShort : 'janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.'.split('_'),
        monthsParseExact : true,
        weekdays : 'dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi'.split('_'),
        weekdaysShort : 'dim._lun._mar._mer._jeu._ven._sam.'.split('_'),
        weekdaysMin : 'Di_Lu_Ma_Me_Je_Ve_Sa'.split('_'),
        weekdaysParseExact : true,
        longDateFormat : {
            LT : 'HH:mm',
            LTS : 'HH:mm:ss',
            L : 'DD/MM/YYYY',
            LL : 'D MMMM YYYY',
            LLL : 'D MMMM YYYY HH:mm',
            LLLL : 'dddd D MMMM YYYY HH:mm'
        },
        calendar : {
            sameDay : '[Aujourd’hui à] LT',
            nextDay : '[Demain à] LT',
            nextWeek : 'dddd [à] LT',
            lastDay : '[Hier à] LT',
            lastWeek : 'dddd [dernier à] LT',
            sameElse : 'L'
        },
        relativeTime : {
            future : 'dans %s',
            past : 'il y a %s',
            s : 'quelques secondes',
            m : 'une minute',
            mm : '%d minutes',
            h : 'une heure',
            hh : '%d heures',
            d : 'un jour',
            dd : '%d jours',
            M : 'un mois',
            MM : '%d mois',
            y : 'un an',
            yy : '%d ans'
        },
        dayOfMonthOrdinalParse : /\d{1,2}(er|e)/,
        ordinal : function (number) {
            return number + (number === 1 ? 'er' : 'e');
        },
        meridiemParse : /PD|MD/,
        isPM : function (input) {
            return input.charAt(0) === 'M';
        },
        // In case the meridiem units are not separated around 12, then implement
        // this function (look at locale/id.js for an example).
        // meridiemHour : function (hour, meridiem) {
        //     return /* 0-23 hour, given meridiem token and hour 1-12 */ ;
        // },
        meridiem : function (hours, minutes, isLower) {
            return hours < 12 ? 'PD' : 'MD';
        },
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 4  // Used to determine first week of the year.
        }
    });
}

const antMessageConfig = () => message.config({
  maxCount: 3,
});

class	App	extends React.Component
{
	constructor(props)
	{
		super(props);
		setupMomentToFR();
		antMessageConfig();
	}

	render ()
	{
		return (
			<Router>
				<div>
					<Header/>
					<Route exact path="/" render={(props) => <Home {...props}/> }/>
					<Route path="/resetpassword" render={(props) => <ResetPassword {...props}/> }/>
					<Route path="/create" render={(props) => <Create {...props}/> }/>
					{
						!this.props.store.token
						? (
							<React.Fragment>
								<Route path="/login" render={(props) => <LogIn {...props}/> }/>
								<Route path="/signup" render={(props) => <SignIn {...props}/> }/>
							</React.Fragment>
						)
						: (
							<React.Fragment>
								<Route path="/profile" render={(props) => <Profile {...props}/> }/>
								<Route path="/activity" render={(props) => <Activity {...props}/> }/>
							</React.Fragment>
						)
					}
					<Route path="/search" render={(props) => <Search {...props}/> }/>
					<Footer />
				</div>
			</Router>
		);
	}
};

export default () => {
	return (
		<AppProvider>
			<AppConsumer>
				{(store) => <App
						store={store}
				/>}
			</AppConsumer>
		</AppProvider>
	);
}

