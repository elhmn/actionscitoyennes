<?php

/* ************************************************************************** */
/*                                                                            */
/*  index.php                                                                 */
/*                                                                            */
/*   By: elhmn <www.elhmn.com>                                                */
/*             <nleme@live.fr>                                                */
/*                                                                            */
/*   Created: Thu Jun 28 14:15:31 2018                        by elhmn        */
/*   Updated: Sat Aug 29 14:30:09 2020                        by elhmn        */
/*                                                                            */
/* ************************************************************************** */

if (isset($_SERVER["HTTP_ORIGIN"]) === true)
{
	header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Methods: GET, PATCH, POST, DELETE, OPTIONS, patch, post, delete, options, get");
	header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
	header("Access-Control-Max-Age: 86400");
	if ($_SERVER["REQUEST_METHOD"] === "OPTIONS")
	{
		exit;
	}
}

define('__API_DIR__', dirname(__FILE__) . '/srcs/api');
define('__APP_DIR__', dirname(__FILE__) . '/');

require_once('srcs/errors/HttpError.class.php');
require_once('srcs/errors/error.php');
require_once('srcs/api/Uri.class.php');
require_once('srcs/api/Auths.class.php');
require_once('srcs/api/Database.class.php');
require_once('srcs/api/IRequestHandler.class.php');
require_once('srcs/api/users/UserPostUtilities.class.php');
require_once('srcs/api/users/ResetPasswordUtilities.class.php');
require_once('srcs/api/users/UserRequest.class.php');
require_once('srcs/api/Config.class.php');
require_once('srcs/api/router.php');

?>
