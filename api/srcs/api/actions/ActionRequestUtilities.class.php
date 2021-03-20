<?php

/* ************************************************************************** */
/*                                                                            */
/*  UserPostUtilities.class.php                                               */
/*                                                                            */
/*   By: elhmn <www.elhmn.com>                                                */
/*             <nleme@live.fr>                                                */
/*                                                                            */
/*   Created:                                                 by elhmn        */
/*   Updated: Sun Jun 23 15:36:58 2019                        by bmbarga      */
/*                                                                            */
/* ************************************************************************** */


class		ActionRequestUtilities
{
	public static $baseActionQuery = "SELECT mix.*, usr.lastname, usr.firstname FROM (SELECT * FROM Actions) mix LEFT JOIN Users usr ON usr.id=mix.user_id";

	public static function		buildActionPublicQuery($query)
	{
		//Get Participants
		$query = "(SELECT base.*, labn.id as labneed_id,"
			. "	labn.required as participants "
		   	. " FROM ($query) base JOIN (SELECT * FROM LaborNeeds GROUP BY action_id) labn "
			. " ON labn.action_id=base.id) ORDER BY date DESC";

		return ($query);
	}

	public static function		fetchProfileImages($data, $conn)
	{
		$baseQuery = "SELECT user_id, file AS src, creation_date FROM Images WHERE user_id=${data["user_id"]} ORDER BY creation_date DESC LIMIT 1";
		$query = $baseQuery;

		$stmt = $conn->prepare($query);

		$stmt->execute();
		$ret = $stmt->fetchAll(PDO::FETCH_ASSOC);

		if (!$ret)
		{
			return null;
		}
		return $ret;
	}

	public static function		buildActionPublicJSON($kwargs, $actions)
	{
		$kwargs = array_merge($kwargs,
					array("data" => $data->action));

		//Set authorizations
		$authorizations = (object) [
			"postmethod" => Auths::NONE,
			"getmethod" => Auths::ALL,
			"patchmethod" => Auths::NONE,
			"delmethod" => Auths::NONE,
		];


		$kwargs = array_merge($kwargs,
					array("auth" => $authorizations));
		$kwargs = array_merge($kwargs,
					array("id" => null));

		$db = $kwargs["db"];
		$auth = $kwargs["auth"];

		if (!$db)
		{
			internal_error("db set to null", __FILE__, __LINE__);
			return (-1);
		}
		$conn = $db->Connect();

		for ($i = 0; $i < count($actions); $i++)
		{
			$action = $actions[$i];

			// Get one or all materialNeeds
			$baseQuery = "SELECT mat.*, mix.user_id FROM "
				. "MaterialNeeds"
				. " mat LEFT JOIN "
				. " (SELECT act.id AS action_id, act.user_id "
				. " FROM Actions act) "
				. " mix ON mix.action_id=mat.action_id "
				. " WHERE mix.action_id=${action["id"]}";
			$query = $baseQuery;

			$stmt = $conn->prepare($query);

			$stmt->execute();
			$ret = $stmt->fetchAll(PDO::FETCH_ASSOC);

			if ($ret)
			{
				//Add materialiNeeds
				$actions[$i] = array_merge($actions[$i],
							array("materialNeeds" => $ret));
			}

			// Get one or all materialContributions
			$baseQuery = 'SELECT mat.*, '
				. 'usr.firstname as  userFirstName, '
				. 'usr.lastname as  userLastName '
				. ' FROM '
				. " MaterialContributions "
				. " mat LEFT JOIN Actions act ON mat.action_id = act.id "
				. " JOIN Users usr ON usr.id = mat.user_id "
				. " WHERE mat.action_id=${action["id"]}";

			$query = $baseQuery;

			$stmt = $conn->prepare($query);

			$stmt->execute();
			$ret = $stmt->fetchAll(PDO::FETCH_ASSOC);

			if ($ret)
			{
				for ($j = 0; $j < count($ret); $j++)
				{
					$mat = $ret[$j];
					// Get one or all profile mages
					if ($mat = self::fetchProfileImages($mat, $conn))
					{
						//Add images
						$ret[$j] = array_merge($ret[$j],
									array("userImage" => $mat));
					}
				}

				//Add materialContributions
				$actions[$i] = array_merge($actions[$i],
							array("materialContributions" => $ret));
			}

			// Get one or all laborContributions
			$baseQuery = 'SELECT lab.*, '
				. 'usr.firstname as  userFirstName, '
				. 'usr.lastname as  userLastName '
				. ' FROM '
				. " LaborContributions "
				. " lab LEFT JOIN Actions act ON lab.action_id = act.id "
				. " JOIN Users usr ON usr.id = lab.user_id "
				. " WHERE lab.action_id=${action["id"]}";

			$query = $baseQuery;

			$stmt = $conn->prepare($query);

			$stmt->execute();
			$ret = $stmt->fetchAll(PDO::FETCH_ASSOC);

			if ($ret)
			{
				for ($j = 0; $j < count($ret); $j++)
				{
					$lab = $ret[$j];
					// Get one or all profile mages
					if ($lab = self::fetchProfileImages($lab, $conn))
					{
						//Add images
						$ret[$j] = array_merge($ret[$j],
									array("userImage" => $lab));
					}
				}

				// Add laborContributions
				$actions[$i] = array_merge($actions[$i],
							array("laborContributions" => $ret));
			}

			// Get one or all profile mages
			if ($ret = self::fetchProfileImages($action, $conn))
			{
				//Add images
				$actions[$i] = array_merge($actions[$i],
							array("userImage" => $ret));
			}


			// Get one or all images
			$baseQuery = 'SELECT img.* '
				. ' FROM '
				. " Images "
				. " img LEFT JOIN Actions act ON img.action_id = act.id "
				. " WHERE img.action_id=${action["id"]}";

			$query = $baseQuery;

			$stmt = $conn->prepare($query);

			$stmt->execute();
			$ret = $stmt->fetchAll(PDO::FETCH_ASSOC);

			if ($ret)
			{
				// Add Images
				$actions[$i] = array_merge($actions[$i],
							array("images" => $ret));
			}

			// Get extras
			$baseQuery = "SELECT ext.* FROM "
				. " Extras ext LEFT JOIN Actions "
				. " act ON ext.action_id=act.id "
				. " WHERE act.id=${action["id"]}";
			$query = $baseQuery;

			$stmt = $conn->prepare($query);

			$stmt->execute();
			$extra = $stmt->fetchAll(PDO::FETCH_ASSOC);

			if ($extra)
			{
				$extra = $extra[0];

				// Get one or all materialNeeds
				$baseQuery = "SELECT mat.*, mix.user_id FROM "
					. "MaterialNeeds"
					. " mat LEFT JOIN "
					. " (SELECT ext.id AS extra_id, ext.user_id "
					. " FROM Extras ext) "
					. " mix ON mix.extra_id=mat.extra_id "
					. " WHERE mix.extra_id=${extra["id"]}";
				$query = $baseQuery;

				$stmt = $conn->prepare($query);

				$stmt->execute();
				$ret = $stmt->fetchAll(PDO::FETCH_ASSOC);

				if ($ret)
				{
					//Add materialiNeeds
					$extra = array_merge($extra,
								array("materialNeeds" => $ret));
				}

				// Get one or all materialContributions
				$baseQuery = 'SELECT mat.*, '
					. 'usr.firstname as  userFirstName, '
					. 'usr.lastname as  userLastName '
					. ' FROM '
					. " MaterialContributions "
					. " mat LEFT JOIN Extras ext ON mat.extra_id = ext.id "
					. " JOIN Users usr ON usr.id = mat.user_id "
					. " WHERE mat.extra_id=${extra["id"]}";

				$query = $baseQuery;

				$stmt = $conn->prepare($query);

				$stmt->execute();
				$ret = $stmt->fetchAll(PDO::FETCH_ASSOC);

				if ($ret)
				{
					for ($j = 0; $j < count($ret); $j++)
					{
						$mat = $ret[$j];
						// Get one or all profile mages
						if ($mat = self::fetchProfileImages($mat, $conn))
						{
							//Add images
							$ret[$j] = array_merge($ret[$j],
										array("userImage" => $mat));
						}
					}

					//Add materialContributions
					$extra = array_merge($extra,
								array("materialContributions" => $ret));
				}

				// Get one or all laborContributions
				$baseQuery = 'SELECT lab.*, '
					. 'usr.firstname as  userFirstName, '
					. 'usr.lastname as  userLastName '
					. ' FROM '
					. " LaborContributions "
					. " lab LEFT JOIN Extras ext ON lab.extra_id = ext.id "
					. " JOIN Users usr ON usr.id = lab.user_id "
					. " WHERE lab.extra_id=${extra["id"]}";

				$query = $baseQuery;

				$stmt = $conn->prepare($query);

				$stmt->execute();
				$ret = $stmt->fetchAll(PDO::FETCH_ASSOC);

				if ($ret)
				{
					// Add laborContributions
					$extra = array_merge($extra,
								array("laborContributions" => $ret));
				}

				//Add Extras
				$actions[$i] = array_merge($actions[$i],
							array("extra" => $extra));
			}

		}

		//Get Participants
		return ($actions);
	}

	public static function		SanitizeData($data)
	{
		if (!$data)
		{
			internal_error("data set to null", __FILE__, __LINE__);
			return(null);
		}

		$data->id = (isset($data->id)) ? htmlspecialchars(strip_tags(trim($data->id))) : null ;
		$data->title = (isset($data->title)) ? htmlspecialchars(strip_tags(trim($data->title))) : null ;
		$data->street = (isset($data->street)) ? htmlspecialchars(strip_tags(trim($data->street))) : null ;
		$data->address_info = (isset($data->address_info)) ? htmlspecialchars(strip_tags(trim($data->address_info))) : null ;
		$data->postal_code = (isset($data->postal_code)) ? htmlspecialchars(strip_tags(trim($data->postal_code))) : null ;
		$data->city = (isset($data->city)) ? htmlspecialchars(strip_tags(trim($data->city))) : null ;
		$data->country = (isset($data->country)) ? htmlspecialchars(strip_tags(trim($data->country))) : null ;
		$data->description = (isset($data->description)) ? htmlspecialchars(strip_tags(trim($data->description))) : null ;
		$data->date = (isset($data->date)) ? htmlspecialchars(strip_tags(trim($data->date))) : null ;
		$data->time = (isset($data->time)) ? htmlspecialchars(strip_tags(trim($data->time))) : null ;
		$data->duration = (isset($data->duration)) ? htmlspecialchars(strip_tags(trim($data->duration))) : null ;
		$data->user_id = (isset($data->user_id)) ? intval(htmlspecialchars(strip_tags(trim($data->user_id)))) : null ;

		return ($data);
	}

	public static function IsOwn($db, $id, $userId)
	{

		if (!$db)
		{
			internal_error("db set to null", __FILE__, __LINE__);
			return (false);
		}

		$query = "SELECT * FROM Actions WHERE id = :id AND user_id = :userId";
		$conn = $db->Connect();
		$stmt = $conn->prepare($query);

		try
		{
			$stmt->bindParam(':id', $id, PDO::PARAM_INT);
			$stmt->bindParam(':userId', $userId, PDO::PARAM_INT);
		}
		catch(Exception $e)
		{
			internal_error("stmt->bindParam : " . $e->getMessage(), __FILE__, __LINE__);
			return (false);
		}

		try
		{
			$stmt->execute();
			$ret = $stmt->fetchAll(PDO::FETCH_ASSOC);

			if( count($ret) === 0 )
			{
				return false;
			}
		}
		catch(Exception $e)
		{
			internal_error("stmt->execute : " . $e->getMessage(), __FILE__, __LINE__);
			return (false);
		}

		return (true);

	}

};

?>
