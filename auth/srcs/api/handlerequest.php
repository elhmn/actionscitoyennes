<?php

/* ************************************************************************** */
/*                                                                            */
/*  handlerequest.php                                                         */
/*                                                                            */
/*   By: elhmn <www.elhmn.com>                                                */
/*             <nleme@live.fr>                                                */
/*                                                                            */
/*   Created:                                                 by elhmn        */
/*   Updated: Sat Apr 13 10:22:54 2019                        by elhmn        */
/*                                                                            */
/* ************************************************************************** */

function	HandleRequest($uri, $db)
{
	if (!($tokenDB = new DataBase()))
	{
		internal_error("tokenDB set to null", __FILE__, __LINE__);
		return (false);
	}

	$tokenDB->host = Config::Getinstance()->authDBHost;
	$tokenDB->dbName = Config::GetInstance()->authDBName;
	$tokenDB->dbUserName = Config::GetInstance()->authDBUserName;
	$tokenDB->dbPassword = Config::GetInstance()->authDBPassword;

	if (!$uri)
	{
		internal_error("uri set to null",
						__FILE__, __LINE__);
		return (false);
	}

	if ($uri->endPoint === "login")
	{
		if (($id = IsGoodCredentials($db, Config::GetInstance()->userTable)) < 0)
			return ;
		CreateApiToken($tokenDB, $id);
		return (true);
	}
	else if ($uri->endPoint === "logout")
	{
		if (RemoveApiToken($tokenDB))
			return (true);
		http_error(400, "Log out failed!");
		return (false);
	}
	else if ($uri->endPoint === "resetpassword")
	{
		if (($id = IsLegitEmailAddress($db, Config::GetInstance()->userTable)) < 0)
			return ;
		if (CreateApiToken($tokenDB, $id, "resetpassword"))
			return (true);
		http_error(400, "reset password failed!");
		return (false);
	}
	http_error(400, "Wrong endPpoint !");
}

?>
