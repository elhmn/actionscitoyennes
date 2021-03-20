<?php

/* ************************************************************************** */
/*                                                                            */
/*  checkCredentials.php                                                      */
/*                                                                            */
/*   By: elhmn <www.elhmn.com>                                                */
/*             <nleme@live.fr>                                                */
/*                                                                            */
/*   Created:                                                 by elhmn        */
/*   Updated: Sat Apr 13 09:58:30 2019                        by elhmn        */
/*                                                                            */
/* ************************************************************************** */

function		GetCredentialsUserId($conn, $tableName, $data)
{
	if (!$conn)
	{
		internal_error("conn set to null", __FILE__, __LINE__);
		return (-1);
	}
	//Check if email already exists
	$query = "SELECT id, email, password FROM $tableName WHERE email=:email";
	try
	{
		$stmt = $conn->prepare($query);
		$stmt->bindParam(':email', $data->email);
	}
	catch(Exception $e)
	{
		internal_error("stmt->bindParam : " . $e->getMessage(),
					__FILE__, __LINE__);
		return (-1);
	}

	try
	{
		$stmt->execute();
		$ret = $stmt->fetchAll(PDO::FETCH_ASSOC);
		if (count($ret) === 1 && password_verify($data->password, $ret[0]['password']))
		{
			return ($ret[0]['id']);
		}
	}
	catch(Exception $e)
	{
		internal_error("stmt->execute : " . $e->getMessage(),
					__FILE__, __LINE__);
		return (-1);
	}

	return (-1);
}

function		GetUserId($conn, $tableName, $data)
{
	if (!$conn)
	{
		internal_error("conn set to null", __FILE__, __LINE__);
		return (-1);
	}
	//Check if email already exists
	$query = "SELECT id, email FROM $tableName WHERE email=:email";
	try
	{
		$stmt = $conn->prepare($query);
		$stmt->bindParam(':email', $data->email);
	}
	catch(Exception $e)
	{
		internal_error("stmt->bindParam : " . $e->getMessage(),
					__FILE__, __LINE__);
		return (-1);
	}

	try
	{
		$stmt->execute();
		$ret = $stmt->fetchAll(PDO::FETCH_ASSOC);
		if (count($ret) === 1)
		{
			return ($ret[0]['id']);
		}
	}
	catch(Exception $e)
	{
		internal_error("stmt->execute : " . $e->getMessage(),
					__FILE__, __LINE__);
		return (-1);
	}

	return (-1);
}


function		IsGoodCredentials($db, $tableName)
{
	if (!$GLOBALS['ac_script'])
	{
		$data = json_decode(file_get_contents("php://input"));
		if (!$data)
		{
			internal_error("data set to null", __FILE__, __LINE__);
			http_error(204); //No Content
			return (-1);
		}
	}
	else
	{
		$data = json_decode('{
								"email" : "elhmn@email.com",
								"password" : "password"
							}');
	}

	if (!$data)
	{
		internal_error("data set to null", __FILE__, __LINE__);
		return(-1);
	}
	$data = UserPostUtilities::SanitizeData($data);

	if (!($conn = $db->Connect()))
	{
		internal_error("conn set to null", __FILE__, __LINE__);
		return (-1);
	}

	if (($id = GetCredentialsUserId($conn, $tableName, $data)) < 0)
	{
		http_error(400, 'Wrong credentials');
		return (-1);
	}
	return ($id);
}

function		IsLegitEmailAddress($db, $tableName)
{
	if (!$GLOBALS['ac_script'])
	{
		$data = json_decode(file_get_contents("php://input"));
		if (!$data)
		{
			internal_error("data set to null", __FILE__, __LINE__);
			http_error(204); //No Content
			return (-1);
		}
	}
	else
	{
		$data = json_decode('{
								"email" : "elhmn@email.com",
							}');
	}

	if (!$data)
	{
		internal_error("data set to null", __FILE__, __LINE__);
		return(-1);
	}
	$data = UserPostUtilities::SanitizeData($data);

	if (!($conn = $db->Connect()))
	{
		internal_error("conn set to null", __FILE__, __LINE__);
		return (-1);
	}

	if (($id = GetUserId($conn, $tableName, $data)) < 0)
	{
		http_error(400, 'Unknown email address');
		return (-1);
	}
	return ($id);
}

?>
