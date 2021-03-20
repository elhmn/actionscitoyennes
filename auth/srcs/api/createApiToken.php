<?php

/* ************************************************************************** */
/*                                                                            */
/*  createApiToken.php                                                        */
/*                                                                            */
/*   By: elhmn <www.elhmn.com>                                                */
/*             <nleme@live.fr>                                                */
/*                                                                            */
/*   Created:                                                 by elhmn        */
/*   Updated: Sat Apr 13 10:47:11 2019                        by elhmn        */
/*                                                                            */
/* ************************************************************************** */

function		DoesTokenExist($conn, $tableName, $token)
{
	//Check if password already exists
	$queryToken = "SELECT token FROM $tableName WHERE token='$token'";
	try
	{
		$stmtToken = $conn->prepare($queryToken);
		$stmtToken->execute();
		$ret = $stmtToken->fetchAll(PDO::FETCH_ASSOC);
		if (count($ret) === 1 && $ret[0]['token'] === $token)
			return true;
	}
	catch(Exception $e)
	{
		$stmtToken->debugDumpParams();
		internal_error("stmtToken : " . $e->getMessage(),
					__FILE__, __LINE__);
		return (false);
	}
	return (false);
}

function		GenerateToken()
{
	$bytes = openssl_random_pseudo_bytes(Config::GetInstance()->tokenLength, $cstrong);
	$hex   = bin2hex($bytes);
	return $hex;
}

function		StoreToken($conn, $tableName, $token, $id, $type)
{
	if (!$conn)
	{
		internal_error("conn set to null", __FILE__, __LINE__);
		return (-1);
	}

	$expiration_delay = 'INTERVAL 5 DAY';
	if ($type === "resetpassword")
	{
		$expiration_delay = 'INTERVAL 15 MINUTE';
		$query = "DELETE FROM $tableName WHERE userid = :id AND tokentype = :type";
		try
		{
			$stmt = $conn->prepare($query);
			$stmt->bindParam(':id', $id);
			$stmt->bindParam(':type', $type);
			$stmt->execute();
		}
		catch(Exception $e)
		{
			internal_error("stmt : " . $e->getMessage(),
						__FILE__, __LINE__);
			return (false);
		}
	}

	//Check if password already exists
	$query = "INSERT INTO $tableName".
		" SET
			token = :token,
			userid = :id,
			tokentype = :type,
			expirationdate = CURRENT_TIMESTAMP + $expiration_delay
		";
	try
	{
		$stmt = $conn->prepare($query);
		$stmt->bindParam(':token', $token);
		$stmt->bindParam(':id', $id);
		$stmt->bindParam(':type', $type);
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

function		SendToken($token, $id)
{
	echo '{"userid": "'.$id.'", "token":"'.$token.'"}';
}

function		CreateApiToken($db, $id, $type = "login")
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

	$token = GenerateToken();
	if (DoesTokenExist($conn, 'tokens', $token))
	{
		return (CreateApiToken($db, $id, $type));
	}
	if (!StoreToken($conn, Config::GetInstance()->tokenTable, $token, $id, $type))
	{
		http_error(400, 'Token generation failed');
		return (false);
	}
	SendToken($token, $id);
	return (true);
}

?>
