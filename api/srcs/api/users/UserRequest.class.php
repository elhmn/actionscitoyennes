<?php

/* ************************************************************************** */
/*                                                                            */
/*  UserRequest.class.php                                                     */
/*                                                                            */
/*   By: elhmn <www.elhmn.com>                                                */
/*             <nleme@live.fr>                                                */
/*                                                                            */
/*   Created:                                                 by elhmn        */
/*   Updated: Sun Jun 23 10:08:49 2019                        by bmbarga      */
/*                                                                            */
/* ************************************************************************** */

	class		UserRequest implements IRequestHandler
	{
		private			$table = "Users";
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

	public static function	AddImagesToUsers($kwargs, $users)
	{
		$db = $kwargs["db"];

		if (!$db)
		{
			internal_error("db set to null", __FILE__, __LINE__);
			return (-1);
		}
		$conn = $db->Connect();

		for ($i = 0; $i < count($users); $i++)
		{
			$user = $users[$i];

			// Get one or all Images
			$baseQuery = "SELECT user_id, file AS src, creation_date FROM Images WHERE user_id=${user["id"]} ORDER BY creation_date DESC LIMIT 1";
			$query = $baseQuery;

			$stmt = $conn->prepare($query);

			$stmt->execute();
			$ret = $stmt->fetchAll(PDO::FETCH_ASSOC);

			if ($ret)
			{
				//Add images
				$users[$i] = array_merge($users[$i],
							array("image" => $ret));
			}
		}
		return ($users);
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
			$id = $kwargs["id"];
			$db = $kwargs["db"];
			$auth = $kwargs["auth"];

			if ($auth->getmethod === Auths::NONE)
			{
				http_error(403);
				return (-1);
			}
			if ($auth->getmethod === Auths::OWN
				&& $auth->userid !== $id)
			{
				http_error(403);
				return (-1);
			}
			if (!$db)
			{
				internal_error("db set to null", __FILE__, __LINE__);
				return (-1);
			}
			$column = "id, firstname, lastname, email, country, signup_date, bio";
			$query = (!$id) ? "SELECT $column FROM " . $this->table
									: "SELECT $column FROM " . $this->table
										. " WHERE id = $id";
			$conn = $db->Connect();
			$stmt = $conn->prepare($query);
			$stmt->execute();
			$ret = $stmt->fetchAll(PDO::FETCH_ASSOC);
			if (!$ret)
			{
				echo '{"response" : "nothing found"}';
				return (0);
			}
			echo json_encode($this->AddImagesToUsers($kwargs, $ret));
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
										"firstname" : "Boris",
										"password" : "password",
										"email" : "elfo@email.com"
									}');
			}
			$data = UserPostUtilities::SanitizeData($data);

			if (isset($data->password))
			{
				//check credentials
				if (empty($data->password))
				{
					http_error(400, "Empty password");
					return (-1);
				}

				//hash the user password
				$data->password = password_hash($data->password, PASSWORD_DEFAULT, ['cost'=>12]);
			}

			//Check if email is well formatted
			if (!UserPostUtilities::IsEmailValid($data->email))
			{
				http_error(400, "Invalid Email Address");
				return (-1);
			}

			if (!UserPostUtilities::CanBePosted($data, $db, $this->table))
			{
				http_error(409); //Resource exists
				return (-1);
			}

			if (!property_exists($data, "firstname")
				|| !property_exists($data, "lastname")
				|| !property_exists($data, "email")
				|| !property_exists($data, "password"))
			{
				http_error(400,
					"Request body must at least contain a firstname,"
				   . " lastname, email and a password");
				return (-1);
			}

			$query = 'INSERT INTO ' . $this->table
					. ' SET
						firstname = :firstname,
						lastname = :lastname,
						password = :password,
						email = :email,'
					.	((!property_exists($data, "login")) ? "" : "login = :login,")
					.	((!property_exists($data, "city")) ? "" : "city = :city,")
					.	((!property_exists($data, "country")) ? "" : "country = :country,")
					.	((!property_exists($data, "bio")) ? "" : "bio = :bio,")
					.	((!property_exists($data, "picture")) ? "" : "picture = :picture,")
					.	((!property_exists($data, "phonenumber"))
							? "" : "phonenumber = :phonenumber,")
					.	((!property_exists($data, "gender")) ? "" : "gender = :gender,");

			//Putain c'est degueux
			$len = strlen($query);
			$query[$len - 1] = " ";

			$conn = $db->Connect();
			$stmt = $conn->prepare($query);
			try
			{
				$stmt->bindParam(':firstname', $data->firstname);
				$stmt->bindParam(':lastname', $data->lastname);
				$stmt->bindParam(':password', $data->password);
				$stmt->bindParam(':email', $data->email);
				(!property_exists($data, "login")) ? : $stmt->bindParam(":login", $data->login);
				(!property_exists($data, "city")) ? : $stmt->bindParam(":city", $data->city);
				(!property_exists($data, "country")) ? : $stmt->bindParam(":country", $data->country);
				(!property_exists($data, "bio")) ? : $stmt->bindParam(":bio", $data->bio);
				(!property_exists($data, "picture")) ? : $stmt->bindParam(":picture", $data->picture);
				(!property_exists($data, "phonenumber")) ? : $stmt->bindParam(":phonenumber", $data->phonenumber);
				(!property_exists($data, "gender")) ? : $stmt->bindParam(":gender", $data->gender);
			}
			catch (Exception $e)
			{
				internal_error("stmt->bindParam : " . $e->getMessage(),
							__FILE__, __LINE__);
				return (-1);
			}
			if (!$stmt->execute())
			{
				internal_error("stmt->execute : ", __FILE__, __LINE__);
				return (-1);
			}
			http_error(201);
		}

		public function		Patch($kwargs)
		{
			if (!$kwargs
					|| !is_array($kwargs))
			{
				internal_error('kwargs not array or set to null',
								__FILE__, __LINE__);
				return (-1);
			}
			if (!isset($kwargs['id']))
			{
				internal_error("Wrong id", __FILE__, __LINE__);
				http_error(400);
				return (-1);
			}

			$id = $kwargs['id'];
			$db = $kwargs['db'];
			$auth = $kwargs["auth"];

			if ($auth->patchmethod === Auths::NONE)
			{
				http_error(403);
				return (-1);
			}
			if ($auth->getmethod === Auths::OWN
				&& $auth->userid !== $id)
			{
				http_error(403);
				return (-1);
			}
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
										"login" : "user1",
										"firstname" : "Marcel",
										"lastname" : "<h></h>",
										"password" : "password"
									}');
			}
			$data = UserPostUtilities::SanitizeData($data);

			if (isset($data->password))
			{
				//check credentials
				if (empty($data->password))
				{
					http_error(400, "Empty password");
					return (-1);
				}

				//hash the user password
				$data->password = password_hash($data->password, PASSWORD_DEFAULT, ['cost'=>12]);
			}

			//Check if email is well formatted
			if (isset($data->email) && !UserPostUtilities::IsEmailValid($data->email))
			{
				http_error(400, "Invalid Email Address");
				return (-1);
			}

			//Check if email is already exists and if login already exists
			if (!UserPostUtilities::CanBePosted($data, $db, $this->table))
			{
				http_error(409); //Resource exists
				return (-1);
			}

			$query = "UPDATE " . $this->table
					. " SET "
					.	((!property_exists($data, "login")) ? "" : "login = :login,")
					.	((!property_exists($data, "firstname")) ? "" : "firstname = :firstname,")
					.	((!property_exists($data, "lastname")) ? "" : "lastname = :lastname,")
					.	((!property_exists($data, "password")) ? "" : "password = :password,")
					.	((!property_exists($data, "city")) ? "" : "city = :city,")
					.	((!property_exists($data, "country")) ? "" : "country = :country,")
					.	((!property_exists($data, "bio")) ? "" : "bio = :bio,")
					.	((!property_exists($data, "picture")) ? "" : "picture = :picture,")
					.	((!property_exists($data, "phonenumber"))
							? "" : "phonenumber = :phonenumber,")
					.	((!property_exists($data, "gender")) ? "" : "gender = :gender,");

			//Putain c'est degueux
			$len = strlen($query);
			$query[$len - 1] = " ";
			$query .= " WHERE id=:id";

			$conn = $db->Connect();
			$stmt = $conn->prepare($query);
			try
			{
				(!property_exists($data, "login")) ? : $stmt->bindParam(":login", $data->login);
				(!property_exists($data, "firstname")) ? : $stmt->bindParam(":firstname", $data->firstname);
				(!property_exists($data, "lastname")) ? : $stmt->bindParam(":lastname", $data->lastname);
				(!property_exists($data, "password")) ? : $stmt->bindParam(":password", $data->password);
				(!property_exists($data, "city")) ? : $stmt->bindParam(":city", $data->city);
				(!property_exists($data, "country")) ? : $stmt->bindParam(":country", $data->country);
				(!property_exists($data, "bio")) ? : $stmt->bindParam(":bio", $data->bio);
				(!property_exists($data, "picture")) ? : $stmt->bindParam(":picture", $data->picture);
				(!property_exists($data, "phonenumber")) ? : $stmt->bindParam(":phonenumber", $data->phonenumber);
				(!property_exists($data, "gender")) ? : $stmt->bindParam(":gender", $data->gender);
				$stmt->bindParam(":id", $id, PDO::PARAM_INT);

				if (!$stmt->execute())
				{
					internal_error("stmt->execute : ", __FILE__, __LINE__);
					return (-1);
				}
			}
			catch (Exception $e)
			{
				internal_error("stmt->bindParam : " . $e->getMessage(),
							__FILE__, __LINE__);
				return (-1);
			}
			http_error(200);
		}


		// The API cant allow to delete any user from users request
		public function		Delete($kwargs)
		{
			/*if (!$kwargs)
			{
				internal_error("db set to null", __FILE__, __LINE__);
				return (-1);
			}
			if (!isset($kwargs['id']))
			{
				internal_error("Wrong id", __FILE__, __LINE__);
				http_error(400);
				return (-1);
			}

			$id = $kwargs['id'];
			$db = $kwargs['db'];
			$auth = $kwargs["auth"];

			if ($auth->delmethod === Auths::NONE)
			{
				http_error(403);
				return (-1);
			}

			if ($auth->delmethod === Auths::OWN
				&& $auth->userid !== $id)
			{
				http_error(403);
				return (-1);
			}

			if (!$db)
			{
				internal_error("db set to null", __FILE__, __LINE__);
				return (-1);
			}

			$query = "DELETE FROM " . $this->table . " WHERE id = :id";

			$conn = $db->Connect();
			$stmt = $conn->prepare($query);
			try
			{
				$stmt->bindParam(":id", $id, PDO::PARAM_INT);

				if (!$stmt->execute())
				{
					internal_error("stmt->execute : ", __FILE__, __LINE__);
					return (-1);
				}
			}
			catch (Exception $e)
			{
				internal_error("stmt->bindParam : " . $e->getMessage(),
							__FILE__, __LINE__);
				return (-1);
			}
			*/

			http_error(405);
		}
	}
?>
