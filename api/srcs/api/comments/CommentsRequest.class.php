<?php

/* ************************************************************************** */
/*                                                                            */
/*  CommentsRequest.class.php                                                 */
/*                                                                            */
/*   By: elhmn <www.elhmn.com>                                                */
/*             <nleme@live.fr>                                                */
/*                                                                            */
/*   Created: Sun Jun 16 12:10:43 2019                        by elhmn        */
/*   Updated: Sun Jun 16 17:13:55 2019                        by elhmn        */
/*                                                                            */
/* ************************************************************************** */

	require_once __API_DIR__ . '/IRequestHandler.class.php';
	require_once __API_DIR__ . '/comments/CommentsRequestUtilities.class.php';

	class		CommentsRequest implements IRequestHandler
	{
		private			$table = "Comments";
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

		public static function	AddImagesToFields($kwargs, $fields)
		{
			$db = $kwargs["db"];

			if (!$db)
			{
				internal_error("db set to null", __FILE__, __LINE__);
				return (-1);
			}
			$conn = $db->Connect();

			for ($i = 0; $i < count($fields); $i++)
			{
				$field = $fields[$i];

				// Get one or all Images
				$baseQuery = "SELECT user_id, file AS src, creation_date FROM Images WHERE user_id=${field["user_id"]} ORDER BY creation_date DESC LIMIT 1";
				$query = $baseQuery;

				$stmt = $conn->prepare($query);

				$stmt->execute();
				$ret = $stmt->fetchAll(PDO::FETCH_ASSOC);

				if ($ret)
				{
					//Add images
					$fields[$i] = array_merge($fields[$i],
								array("image" => $ret));
				}
			}
			return ($fields);
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
			$db = $kwargs["db"];
			$actionid = $_GET["actionid"];

			// Get all comments
			$query = "SELECT firstname, lastname, cmt.* FROM Comments cmt JOIN Users usr ON usr.id=cmt.user_id WHERE action_id=$actionid GROUP BY id ORDER BY creation_date DESC;";

			$conn = $db->Connect();
			$stmt = $conn->prepare($query);

			$stmt->execute();
			$ret = $stmt->fetchAll(PDO::FETCH_ASSOC);

			if (!$ret)
			{
				http_error(204, '{"response" : "nothing found"}');
				return (-1);
			}

			echo json_encode($this->AddImagesToFields($kwargs, $ret));
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
			$data = $kwargs["data"];

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

			CommentsRequestUtilities::SanitizeData($data);

			// Create comments

			$query = 'INSERT INTO ' . $this->table . ' SET
			content = :content,
			action_id = :action_id,
			user_id = :user_id;';

			$conn = $db->Connect();
			$stmt = $conn->prepare($query);

			try
			{
				$stmt->bindParam(':content', $data->content);
				$stmt->bindParam(':user_id', $data->user_id);
				$stmt->bindParam(':action_id', $data->action_id);

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
