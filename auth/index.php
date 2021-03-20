<?php

/* ************************************************************************** */
/*                                                                            */
/*  index.php                                                                 */
/*                                                                            */
/*   By: elhmn <www.elhmn.com>                                                */
/*             <nleme@live.fr>                                                */
/*                                                                            */
/*   Created: Thu Jun 28 14:15:31 2018                        by elhmn        */
/*   Updated: Wed Aug 26 23:50:57 2020                        by elhmn        */
/*                                                                            */
/* ************************************************************************** */

header("Access-Control-Allow-Origin: *");

require_once('srcs/errors/error.php');
require_once('srcs/errors/HttpError.class.php');
require_once('srcs/api/Uri.class.php');
require_once('srcs/api/Database.class.php');
require_once('srcs/api/Config.class.php');
require_once('srcs/api/checkCredentials.php');
require_once('srcs/api/removeApiToken.php');
require_once('srcs/api/createApiToken.php');
require_once('srcs/api/handlerequest.php');
require_once('srcs/api/users/UserPostUtilities.class.php');
require_once('srcs/api/router.php');
?>
