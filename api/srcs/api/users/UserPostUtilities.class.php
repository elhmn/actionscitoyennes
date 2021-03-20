<?php

/* ************************************************************************** */
/*                                                                            */
/*  UserPostUtilities.class.php                                               */
/*                                                                            */
/*   By: elhmn <www.elhmn.com>                                                */
/*             <nleme@live.fr>                                                */
/*                                                                            */
/*   Created:                                                 by elhmn        */
/*   Updated: Sat Apr 13 08:05:16 2019                        by elhmn        */
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

		if (property_exists($data, 'gender'))
			$data->gender = htmlspecialchars(strip_tags(($data->gender)));

		return ($data);
	}

	public static function		CanBePosted($data, $db, $tableName)
	{
		if (!$data)
		{
			internal_error("data set to null", __FILE__, __LINE__);
			return(false);
		}
		if (!$db)
		{
			internal_error("db set to null", __FILE__, __LINE__);
			return(false);
		}

		if (!($conn = $db->Connect()))
		{
			internal_error("conn set to null", __FILE__, __LINE__);
			return (false);
		}

		//Check if email already exists
		if(isset($data->email))
		{
			$queryEmail = "SELECT email FROM $tableName WHERE email=:email";
			try
			{
				$stmtEmail = $conn->prepare($queryEmail);
				$stmtEmail->bindParam(':email', $data->email);
				$stmtEmail->execute();
				$ret = $stmtEmail->fetchAll(PDO::FETCH_ASSOC);
				if ($ret)
				{
					internal_error("email already exists", __FILE__, __LINE__);
					return false;
				}
			}
			catch(Exception $e)
			{
				internal_error("stmtEmail : " . $e->getMessage(),
							__FILE__, __LINE__);
				return (false);
			}
		}
		return (true);
	}

	public static function	IsEmailValid($email)
	{
		return filter_var($email, FILTER_VALIDATE_EMAIL);
	}

};

?>
