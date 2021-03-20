<?php

/* ************************************************************************** */
/*                                                                            */
/*  ActionsContributedRequest.class.php                                       */
/*                                                                            */
/*   By: elhmn <www.elhmn.com>                                                */
/*             <nleme@live.fr>                                                */
/*                                                                            */
/*   Created: Tue Feb 19 17:40:58 2019                        by elhmn        */
/*   Updated: Fri Apr 12 15:10:40 2019                        by elhmn        */
/*                                                                            */
/* ************************************************************************** */

	require_once __API_DIR__ . '/IRequestHandler.class.php';
	require_once __API_DIR__ . '/actions/ActionRequestUtilities.class.php';

	class		ActionsContributedRequest implements IRequestHandler
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

			else
			{
				// Get actions the user contributed to
				$query = "SELECT action.*, user.firstname AS firstname, user.lastname AS lastname FROM "
						." (SELECT * FROM Actions uniq,"
							. " (SELECT action_id, COUNT(action_id) FROM "
								. " (SELECT * FROM "
									. " (SELECT act.id as action_id, cont.id AS cont_id, cont.lab_uid AS lab_user_id, cont.mat_uid AS mat_user_id FROM Actions act JOIN "
										. " (SELECT lab.action_id AS id, lab.user_id AS lab_uid, mat.user_id AS mat_uid,  mat.action_id AS mat_act_id, lab.id AS lab_id, mat.id AS mat_id FROM LaborContributions lab, MaterialContributions mat) "
									. " cont ON act.id = cont.id) "
								. " comp WHERE lab_user_id=$auth->userid OR mat_user_id=$auth->userid) "
							. " grp GROUP BY action_id HAVING COUNT(action_id))"
							. " actcont WHERE uniq.id=actcont.action_id) "
							. " action JOIN Users user ON user.id=action.user_id ";
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
			http_error(403);
		}

		public function		Patch($kwargs)
		{
			http_error(403);
		}

		public function		Delete($kwargs)
		{
			http_error(403);
		}
	}
?>
