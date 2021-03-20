<?php

/* ************************************************************************** */
/*                                                                            */
/*  SignupPubRequest.class.php                                                */
/*                                                                            */
/*   By: elhmn <www.elhmn.com>                                                */
/*             <nleme@live.fr>                                                */
/*                                                                            */
/*   Created:                                                 by elhmn        */
/*   Updated: Tue Nov 27 11:27:30 2018                        by bmbarga      */
/*                                                                            */
/* ************************************************************************** */

	require_once __API_DIR__ . '/IRequestHandler.class.php';

	class		signupPubRequest implements IRequestHandler
	{

		private			$table = "Actions";
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
			http_error(400);
		}

		public function		Post($kwargs)
		{
			if (!($user = new UserRequest()))
			{
				internal_error("user set to null", __FILE__, __LINE__);
				http_error(500);
				return (-1);
			}
			$user->Post($kwargs);
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
