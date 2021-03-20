<?php

/* ************************************************************************** */
/*                                                                            */
/*  SearchPubRequest.class.php                                                */
/*                                                                            */
/*   By: elhmn <www.elhmn.com>                                                */
/*             <nleme@live.fr>                                                */
/*                                                                            */
/*   Created: Mon Nov 26 17:41:26 2018                        by elhmn        */
/*   Updated: Sun Apr 14 15:22:42 2019                        by bmbarga      */
/*                                                                            */
/* ************************************************************************** */
	require_once __API_DIR__ . '/IRequestHandler.class.php';

	class		SearchPubRequest implements IRequestHandler
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

			$city = $_GET["city"];
			$country = $_GET["country"];
			$keyword = $_GET["keyword"];

			//This is a basic request and it will be enhanced later
			$baseQuery = ActionRequestUtilities::$baseActionQuery
				. " WHERE "
				. (isset($city) && !empty($city) ? " mix.city='$city' AND " : "")
				. (isset($country) && !empty($country) ? " mix.coutry='$country' AND " : "")
				. (isset($keyword) ? "mix.description LIKE '%$keyword%' AND " : "")
				. "mix.id=mix.id ORDER BY date DESC";

			$query = $baseQuery;
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
