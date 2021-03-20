<?php

/* ************************************************************************** */
/*                                                                            */
/*  UserPubRequest.class.php                                                  */
/*                                                                            */
/*   By: elhmn <www.elhmn.com>                                                */
/*             <nleme@live.fr>                                                */
/*                                                                            */
/*   Created: Sun Jun 23 10:05:23 2019                        by elhmn        */
/*   Updated: Sun Jun 23 10:10:10 2019                        by bmbarga      */
/*                                                                            */
/* ************************************************************************** */

	class		UserPubRequest implements IRequestHandler
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

			if (!$db)
			{
				internal_error("db set to null", __FILE__, __LINE__);
				return (-1);
			}
			$column = "id, firstname, lastname, country, bio";
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
			echo json_encode(UserRequest::AddImagesToUsers($kwargs, $ret));
		}

		public function		Post($kwargs)
		{
			http_error(404);
		}

		public function		Patch($kwargs)
		{
			http_error(404);
		}


		public function		Delete($kwargs)
		{
			http_error(404);
		}
	}

?>
