<?php

/* ************************************************************************** */
/*                                                                            */
/*  removeApiToken.php                                                        */
/*                                                                            */
/*   By: elhmn <www.elhmn.com>                                                */
/*             <nleme@live.fr>                                                */
/*                                                                            */
/*   Created:                                                 by elhmn        */
/*   Updated: Sun Sep 16 00:37:36 2018                        by elhmn        */
/*                                                                            */
/* ************************************************************************** */

function FetchTokenFromDB($conn, $tableName, $token)
{
	$query = "SELECT token FROM $tableName WHERE token='$token'";

	try
	{
		$stmt = $conn->prepare($query);
		$stmt->execute();
		$ret = $stmt->fetchAll(PDO::FETCH_ASSOC);
		if (count($ret) === 1)
			return ($ret[0]['token']);
	}
	catch(Exception $e)
	{
		internal_error("stmt : " . $e->getMessage(),
					__FILE__, __LINE__);
		return (false);
	}
	return (false);

}

function RemoveTokenFromDB($conn, $tableName, $token)
{
	$query = "DELETE FROM $tableName WHERE token='$token'";

	try
	{
		$stmt = $conn->prepare($query);
		$stmt->execute();
	}
	catch(Exception $e)
	{
		internal_error("stmt : " . $e->getMessage(),
					__FILE__, __LINE__);
		return (false);
	}
	return (true);
}

function RemoveApiToken($db)
{
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
		$data = json_decode('{"token":"1f3958b8357deaac420a2961cfa04d69d10201f3"}');
	}

	if (!$data)
	{
		internal_error("data set to null", __FILE__, __LINE__);
		return(-1);
	}
	$data->token = htmlspecialchars(strip_tags(($data->token)));
	if (!FetchTokenFromDB($conn, 'tokens', $data->token))
		return false;
	RemoveTokenFromDB($conn, 'tokens', $data->token);
	return (true);
}

?>
