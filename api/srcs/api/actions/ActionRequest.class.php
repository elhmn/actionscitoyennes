<?php

/* ************************************************************************** */
/*                                                                            */
/*  UserRequest.class.php                                                     */
/*                                                                            */
/*   By: elhmn <www.elhmn.com>                                                */
/*             <nleme@live.fr>                                                */
/*                                                                            */
/*   Created:                                                 by elhmn        */
/*   Updated: Mon Feb 18 10:53:32 2019                        by elhmn        */
/*                                                                            */
/* ************************************************************************** */

	require_once __API_DIR__ . '/IRequestHandler.class.php';
	require_once __API_DIR__ . '/actions/ActionRequestUtilities.class.php';

	class		ActionRequest implements IRequestHandler
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

			if (!$db)
			{
				internal_error("db set to null", __FILE__, __LINE__);
				return (-1);
			}

			if ($auth->getmethod === Auths::ALL)
			{
				// Get all actions
				$query = (!$id) ? 'SELECT * FROM ' . $this->table
									: "SELECT * FROM " . $this->table . " WHERE id = $id";
			}
			else
			{
				// Get one or all actions
				$query = (!$id) ? 'SELECT * FROM ' . $this->table . " WHERE user_id = $auth->userid"
									: "SELECT * FROM " . $this->table . " WHERE id = $id";
			}


			$conn = $db->Connect();
			$stmt = $conn->prepare($query);

			$stmt->execute();
			$ret = $stmt->fetchAll(PDO::FETCH_ASSOC);

			if (!$ret)
			{
				echo '{"response" : "nothing found"}';
				return (0);
			}

			echo json_encode($ret);
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

			$db = $kwargs["db"];
			$auth = $kwargs["auth"];
			$data = $kwargs["data"];

			if ($auth->postmethod === Auths::NONE)
			{
				http_error(403);
				return (-1);
			}

			if (!$db)
			{
				internal_error("db set to null", __FILE__, __LINE__);
				return (-1);
			}

			if (!$data && !$GLOBALS['ac_script'])
			{
				$data = json_decode(file_get_contents("php://input"));
				if (!$data)
				{
					internal_error("data set to null", __FILE__, __LINE__);
					http_error(204); //No Content
					return (-1);
				}
			}

			ActionRequestUtilities::SanitizeData($data);

			// Create action

			$query = 'INSERT INTO ' . $this->table . ' SET
			title = :title,
			street = :street,
			address_info = :addressInfo,
			postal_code = :codePostal,
			city = :city,
			coutry = :country,
			description = :description,
			date = :date,
			time = :time,
			duration = :duration,
			user_id = :userId;';

			$conn = $db->Connect();
			$stmt = $conn->prepare($query);

			try
			{
				$stmt->bindParam(':title', $data->title);
				$stmt->bindParam(':street', $data->street);
				$stmt->bindParam(':addressInfo', $data->address_info);
				$stmt->bindParam(':codePostal', $data->postal_code);
				$stmt->bindParam(':city', $data->city);
				$stmt->bindParam(':country', $data->country);
				$stmt->bindParam(':description', $data->description);
				$stmt->bindParam(':date', $data->date);
				$stmt->bindParam(':time', $data->time);
				$stmt->bindParam(':duration', $data->duration);
				$stmt->bindParam(':userId', $auth->userid);

			}
			catch (Exception $e)
			{
				internal_error("stmt->bindParam : " . $e->getMessage(),
								__FILE__, __LINE__);
				return (-1);
			}
			try
			{
				$stmt->execute();
			}
			catch (Exception $e)
			{
				internal_error("stmt->execute : ". $e->getMessage(), __FILE__, __LINE__);
				http_error(400, $e->getMessage());
				return (-1);
			}
			http_error(201);
			return ($conn->lastInsertId());
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
			$db = $kwargs["db"];
			$auth = $kwargs["auth"];

			if ($auth->patchmethod === Auths::NONE)
			{
				http_error(403);
				return (-1);
			}

			if ($auth->patchmethod === Auths::OWN
				&& !ActionRequestUtilities::IsOwn($db, $id, $auth->userid))
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

			// Put update action here

			ActionRequestUtilities::SanitizeData($data);

			$query = 'UPDATE ' . $this->table . ' SET '
			. ((isset($data->title)) ? 'title = :title,' : '')
			. ((isset($data->street)) ? 'street = :street,' : '')
			. ((isset($data->address_info)) ? 'address_info = :addressInfo,' : '')
			. ((isset($data->postal_code)) ? 'postal_code = :codePostal,' : '')
			. ((isset($data->city)) ? 'city = :city,' : '')
			. ((isset($data->country)) ? 'coutry = :country,' : '')
			. ((isset($data->description)) ? 'description = :description,' : '')
			. ((isset($data->date)) ? 'date = :date,' : '')
			. ((isset($data->time)) ? 'time = :time,' : '')
			. ((isset($data->duration)) ? 'duration = :duration,' : '')
			. 'id = id'
			. ' WHERE id = :id';

			$conn = $db->Connect();
			$stmt = $conn->prepare($query);

			try
			{
				$stmt->bindParam(":id", $id, PDO::PARAM_INT);
				(isset($data->title)) ? $stmt->bindParam(':title', $data->title) : false;
				(isset($data->street)) ? $stmt->bindParam(':street', $data->street) : false;
				(isset($data->address_info)) ? $stmt->bindParam(':addressInfo', $data->address_info) : false;
				(isset($data->postal_code)) ? $stmt->bindParam(':codePostal', $data->postal_code) : false;
				(isset($data->city)) ? $stmt->bindParam(':city', $data->city) : false;
				(isset($data->country)) ? $stmt->bindParam(':country', $data->country) : false;
				(isset($data->description)) ? $stmt->bindParam(':description', $data->description) : false;
				(isset($data->date)) ? $stmt->bindParam(':date', $data->date) : false;
				(isset($data->time)) ? $stmt->bindParam(':time', $data->time) : false;
				(isset($data->duration)) ? $stmt->bindParam(':duration', $data->duration) : false;
			}
			catch (Exception $e)
			{
				internal_error("stmt->bindParam : " . $e->getMessage(),
								__FILE__, __LINE__);
				return (-1);
			}

			try
			{
				$stmt->execute();
			}
			catch (Exception $e)
			{
				internal_error("stmt->execute : ". $e->getMessage(), __FILE__, __LINE__);
				http_error(400, $e->getMessage());
				return (-1);
			}

			http_error(200);
		}

		public function		Delete($kwargs)
		{
			if (!$kwargs)
			{
				internal_error("kwargs not array or set to null", __FILE__, __LINE__);
				return (-1);
			}
			if (!isset($kwargs['id']))
			{
				internal_error("Wrong id", __FILE__, __LINE__);
				http_error(400);
				return (-1);
			}

			$id = $kwargs['id'];
			$db = $kwargs["db"];
			$auth = $kwargs["auth"];


			if ($auth->delmethod === Auths::NONE)
			{
				http_error(403);
				return (-1);
			}

			if ($auth->delmethod === Auths::OWN
				&& !ActionRequestUtilities::IsOwn($db, $id, $auth->userid))
			{
				http_error(403);
				return (-1);
			}


			if (!$db)
			{
				internal_error("db set to null", __FILE__, __LINE__);
				return (-1);
			}

			// Delete action

			$query = "SET FOREIGN_KEY_CHECKS=0;
						DELETE FROM " . $this->table . " WHERE id = :id;
					SET FOREIGN_KEY_CHECKS=1;";

			$conn = $db->Connect();
			$stmt = $conn->prepare($query);

			try
			{
				$stmt->bindParam(":id", $id, PDO::PARAM_INT);
			}
			catch (Exception $e)
			{
				internal_error("stmt->bindParam : " . $e->getMessage(),
							__FILE__, __LINE__);
				return (-1);
			}

			try
			{
				$stmt->execute();
			}
			catch (Exception $e)
			{
				internal_error("stmt->execute : " . $e->getMessage(), __FILE__, __LINE__);
				http_error(400, $e->getMessage());
				return (-1);
			}

			http_error(200);

		}
	}
?>
