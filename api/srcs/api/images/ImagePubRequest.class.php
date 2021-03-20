<?php

/* ************************************************************************** */
/*                                                                            */
/*  ImagePubRequest.class.php                                                 */
/*                                                                            */
/*   By: elhmn <www.elhmn.com>                                                */
/*             <nleme@live.fr>                                                */
/*                                                                            */
/*   Created: Thu Jan 01 01:00:00 1970                        by elhmn        */
/*   Updated: Thu Feb 21 11:24:32 2019                        by elhmn        */
/*                                                                            */
/* ************************************************************************** */

require_once __API_DIR__ . '/IRequestHandler.class.php';
require_once __API_DIR__ . '/actions/ActionRequestUtilities.class.php';

class		ImagePubRequest implements IRequestHandler
{
	public static	$verbose = false;

	// 		contructor
	public function __construct()
	{
		if (self::$verbose)
		{
			echo __CLASS__. " constructor called !" . PHP_EOL;
		}
	}

	// 		destructor
	public function __destruct()
	{
		if (self::$verbose)
		{
			echo __CLASS__. " destructor called !" . PHP_EOL;
		}
	}

	//IRequestHandler function override
	public function		Get($kwargs)
	{
		if (!$kwargs
			|| !is_array($kwargs))
		{
			internal_error("kwargs not array or set to null",
				__FILE__, __LINE__);
			return (-1);
		}
		$uri = new Uri(strtolower($_SERVER['REQUEST_URI']),
		strtolower($_SERVER['REQUEST_METHOD']));

		if ($uri->split[3] === 'actions')
		{
			$type = 'actions';
			$file = $uri->split[4];
		}
		else if ($uri->split[3] === 'users')
		{
			$type = 'users';
			$file = $uri->split[4];
		}

		$path_info = pathinfo($file);
		header("Content-type: image/$path_info");
		readfile("res/images/$type/$file");
	}

	public function		Post($kwargs)
	{
		http_error(400);
	}

	public function		Patch($kwargs)
	{
		http_error(400);
	}

	public function		Delete($kwargs)
	{
		http_error(400);
	}

}
?>
