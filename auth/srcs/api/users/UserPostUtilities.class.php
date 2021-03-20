<?php

/* ************************************************************************** */
/*                                                                            */
/*  UserPostUtilities.class.php                                               */
/*                                                                            */
/*   By: elhmn <www.elhmn.com>                                                */
/*             <nleme@live.fr>                                                */
/*                                                                            */
/*   Created:                                                 by elhmn        */
/*   Updated: Fri Jul 27 14:30:37 2018                        by bmbarga      */
/*                                                                            */
/* ************************************************************************** */

class		UserPostUtilities
{

	public static function		SanitizeData($data)
	{
		if (!$data)
		{
			internal_error("data set to null", __FILE__, __LINE__);
			return(null);
		}

		if (property_exists($data, 'login'))
			$data->login = htmlspecialchars(strip_tags(($data->login)));

		if (property_exists($data, 'firstname'))
			$data->firstname = htmlspecialchars(strip_tags(($data->firstname)));

		if (property_exists($data, 'lastname'))
			$data->lastname = htmlspecialchars(strip_tags(($data->lastname)));

		if (property_exists($data, 'password'))
			$data->password = htmlspecialchars(strip_tags(($data->password)));

		if (property_exists($data, 'email'))
			$data->email = htmlspecialchars(strip_tags(($data->email)));

		if (property_exists($data, 'city'))
			$data->city = htmlspecialchars(strip_tags(($data->city)));

		if (property_exists($data, 'country'))
			$data->country = htmlspecialchars(strip_tags(($data->country)));

		if (property_exists($data, 'bio'))
			$data->bio = htmlspecialchars(strip_tags(($data->bio)));

		if (property_exists($data, 'picture'))
			$data->picture = htmlspecialchars(strip_tags(($data->picture)));

		if (property_exists($data, 'phonenumber'))
			$data->phonenumber = htmlspecialchars(strip_tags(($data->phonenumber)));

		if (property_exists($data, 'signupdate'))
			$data->signupdate = htmlspecialchars(strip_tags(($data->signupdate)));

		if (property_exists($data, 'gender'))
			$data->gender = htmlspecialchars(strip_tags(($data->gender)));

		return ($data);
	}
};

?>
