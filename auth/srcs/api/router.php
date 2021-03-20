<?php

/* ************************************************************************** */
/*                                                                            */
/*  router.php                                                                */
/*                                                                            */
/*   By: elhmn <www.elhmn.com>                                                */
/*             <nleme@live.fr>                                                */
/*                                                                            */
/*   Created: Thu Jun 28 14:18:29 2018                        by elhmn        */
/*   Updated: Sat Jul 28 18:47:10 2018                        by bmbarga      */
/*                                                                            */
/* ************************************************************************** */

//plateform toggler
$ac_script = isset($_SERVER['AC_SCRIPT']);

//Check if the uri was properly formatted
function		IsHandledUri($uri)
{
	if (!$uri)
	{
		internal_error("uri set to null",
						__FILE__, __LINE__);
		return (false);
	}

	if (empty($uri->endPoint)
		|| array_search($uri->endPoint,
				Config::GetInstance()->endPoints) === FALSE)
	{
		internal_error("Bad request",
						__FILE__, __LINE__);
		http_error(400);
		return (false);
	}

	if (empty($uri->method)
		|| array_search($uri->method,
				Config::GetInstance()->methods) === FALSE)
	{
		internal_error("Unhandled method : $uri->method",
						__FILE__, __LINE__);
		http_error(405);
		return false;
	}
	return true;
}

function		Run()
{
	if (!$GLOBALS['ac_script'])
	{
		//Check if running plateform
		if (!isset($_SERVER['REQUEST_URI'])
				|| !isset($_SERVER['REQUEST_METHOD']))
		{
			internal_error('$_SERVER : missing fields', __FILE__, __LINE__);
			return (-1);
		}

		//Create a new uri by saving relevant uri data
		$uri = new Uri(strtolower($_SERVER['REQUEST_URI']),
						strtolower($_SERVER['REQUEST_METHOD']));
	}
	else
	{
		//Create a new uri by saving relevant uri data
		$uri = new Uri('/login', 'post');
	}

	//Check if the uri was properly formatted
	if (!IsHandledUri($uri))
	{
		internal_error('Bad uri', __FILE__, __LINE__);
		return (-1);
	}

	//Create Database
	$db = new Database();
	if (!$db)
	{
		internal_error('DataBase set to null', __FILE__, __LINE__);
		return (-1);
	}

	HandleRequest($uri, $db);
}

Run();

?>
