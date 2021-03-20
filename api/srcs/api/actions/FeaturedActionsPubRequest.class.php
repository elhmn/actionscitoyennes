<?php

/* ************************************************************************** */
/*                                                                            */
/*  FeaturedActionsPubRequest.class.php                                       */
/*                                                                            */
/*   By: elhmn <www.elhmn.com>                                                */
/*             <nleme@live.fr>                                                */
/*                                                                            */
/*   Created:                                                 by elhmn        */
/*   Updated: Sun Apr 14 15:25:19 2019                        by bmbarga      */
/*                                                                            */
/* ************************************************************************** */
	require_once __API_DIR__ . '/IRequestHandler.class.php';
	require_once __API_DIR__ . '/actions/ActionRequestUtilities.class.php';

	class		FeaturedActionsPubRequest implements IRequestHandler
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
			$db = $kwargs["db"];

			//This is a basic request and it will be enhanced later
			// Get all actions
			$baseQuery = ActionRequestUtilities::$baseActionQuery;
			$query = " $baseQuery ORDER BY date DESC LIMIT 3 ";
			$query = ActionRequestUtilities::buildActionPublicQuery($query);

			$conn = $db->Connect();
			$stmt = $conn->prepare($query);

			$stmt->execute();
			$ret = $stmt->fetchAll(PDO::FETCH_ASSOC);

			if (!$ret)
			{
				http_error(204, '{"response" : "nothing found"}');
				return (-1);
			}

			echo json_encode(ActionRequestUtilities::buildActionPublicJSON($kwargs, $ret));
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
