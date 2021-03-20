<?php

/* ************************************************************************** */
/*                                                                            */
/*  UserRequest.class.php                                                     */
/*                                                                            */
/*   By: elhmn <www.elhmn.com>                                                */
/*             <nleme@live.fr>                                                */
/*                                                                            */
/*   Created:                                                 by elhmn        */
/*   Updated: Sun Aug 05 10:19:39 2018                        by bmbarga      */
/*                                                                            */
/* ************************************************************************** */

	require_once __API_DIR__ . '/IRequestHandler.class.php';
	require_once __API_DIR__ . '/actions/ActionRequestUtilities.class.php';
	require_once __API_DIR__ . '/extras/ExtraRequestUtilities.class.php';
	require_once __API_DIR__ . '/laborcontribs/LaborContributionRequestUtilities.class.php';

	class		LaborContributionRequest implements IRequestHandler
	{
		private			$table = "LaborContributions";
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
			
			// Get one or all laborcontribs
			$query = (!$id)			
				? 'SELECT lab.* FROM ' . $this->table . " lab LEFT JOIN Actions act ON lab.action_id = act.id LEFT JOIN Extras ext ON lab.extra_id = ext.id  WHERE lab.user_id = $auth->userid"
				
				: "SELECT lab.* FROM " . $this->table . " lab LEFT JOIN Actions act ON lab.action_id = act.id LEFT JOIN Extras ext ON lab.extra_id = ext.id WHERE (lab.id = $id AND lab.user_id = $auth->userid)";

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
			
			// Create laborcontrib

			LaborContributionRequestUtilities::SanitizeData($data);

			if ( isset($data->action_id) && isset($data->extra_id) )
			{
				$data->extra_id = null;
			}

			$query = 'INSERT INTO ' . $this->table . ' SET
			laborNeed_id = :laborNeedId, '
			. 'user_id = :userId '
			. (isset($data->action_id) ? ',action_id = :actionId' : '')
			. (isset($data->extra_id) ?  ',extra_id = :extraId' : '')
			. ';';

			$conn = $db->Connect();
			$stmt = $conn->prepare($query);

			try
			{
				$stmt->bindParam(':userId', $auth->userid);
				$stmt->bindParam(':laborNeedId', $data->laborNeed_id);
				isset($data->action_id) ? $stmt->bindParam(':actionId', $data->action_id) : false;
				isset($data->extra_id) ? $stmt->bindParam(':extraId', $data->extra_id) : false;

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
				&& !LaborContributionRequestUtilities::IsOwn($db, $id, $auth->userid))
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
			
			// Put update laborcontrib here
			// TO DO
			
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
				&& !LaborContributionRequestUtilities::IsOwn($db, $id, $auth->userid))
			{
				http_error(403);
				return (-1);
			}
			
			if (!$db)
			{
				internal_error("db set to null", __FILE__, __LINE__);
				return (-1);
			}
			
			// Delete laborcontrib
			
			$query = "DELETE FROM " . $this->table . " WHERE id = :id";

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
