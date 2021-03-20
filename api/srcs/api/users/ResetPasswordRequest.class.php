<?php

/* ************************************************************************** */
/*                                                                            */
/*  ResetPasswordRequest.class.php                                            */
/*                                                                            */
/*   By: elhmn <www.elhmn.com>                                                */
/*             <nleme@live.fr>                                                */
/*                                                                            */
/*   Created: Thu Jan 01 01:00:00 1970                        by elhmn        */
/*   Updated: Sat Apr 13 23:20:33 2019                        by bmbarga      */
/*                                                                            */
/* ************************************************************************** */
	class		ResetPasswordRequest implements IRequestHandler
	{
		private			$table = "passwordToken";
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
			http_error(403);
		}

		public function		Post($kwargs)
		{
			if (!$kwargs
					|| !is_array($kwargs))
			{
				internal_error('kwargs not array or set to null',
								__FILE__, __LINE__);
				return (-1);
			}

			$db = $kwargs['db'];

			if (!$db)
			{
				internal_error("db set to null", __FILE__, __LINE__);
				return (-1);
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
				$data = json_decode('{
										"email" : "elfo@email.com"
									}');
			}
			$data = ResetPasswordUtilities::SanitizeData($data);

			if (!property_exists($data, "email"))
			{
				http_error(400,
					"Request body must at least contain an email");
				return (-1);
			}

			//Check if email is well formatted
			if (!ResetPasswordUtilities::IsEmailValid($data->email))
			{
				http_error(400, "Invalid Email Address");
				return (-1);
			}

			//If email does not exist in the DB
			if (UserPostUtilities::CanBePosted($data, $db, "Users"))
			{
				http_error(400, "Unknown email address"); //Resource exists
				return (-1);
			}
			$url = "https://" . Config::GetInstance()->authHostName . "/resetpassword";
			$response = ResetPasswordUtilities::postData($url, $data);
			if (!$response)
			{
				http_error(400, "reset password failed");
				return (0);
			}
			ResetPasswordUtilities::sendPasswordRecoveryEmail($data->email, json_decode($response));
			http_error(200);
		}

		public function		Patch($kwargs)
		{
			http_error(400);
		}


		// The API cant allow to delete any user from users request
		public function		Delete($kwargs)
		{
			http_error(404);
		}
	}
?>
