<?php

/* ************************************************************************** */
/*                                                                            */
/*  ImageRequest.class.php                                                    */
/*                                                                            */
/*   By: elhmn <www.elhmn.com>                                                */
/*             <nleme@live.fr>                                                */
/*                                                                            */
/*   Created: Thu Jan 01 01:00:00 1970                        by elhmn        */
/*   Updated: Sun Apr 14 23:17:59 2019                        by bmbarga      */
/*                                                                            */
/* ************************************************************************** */

require_once __API_DIR__ . '/IRequestHandler.class.php';
require_once __API_DIR__ . '/actions/ActionRequestUtilities.class.php';

class		ImageRequest implements IRequestHandler
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
		$id = $kwargs["id"];

		http_error(400);
	}

	public function		Post($kwargs)
	{
		if (!$kwargs
			|| !is_array($kwargs))
		{
			internal_error("kwargs not array or set to null",
				__FILE__, __LINE__);
			return (-1);
		}
		$db = $kwargs["db"];
		$auth = $kwargs["auth"];
		$action_id = $kwargs["action_id"];

		$uri = new Uri(strtolower($_SERVER['REQUEST_URI']),
			strtolower($_SERVER['REQUEST_METHOD']));

		if ($uri->split[4] === 'action_id'
			&& isset($uri->split[5])
			&& is_numeric($uri->split[5]))
		{
			$action_id = $uri->split[5];
		}
		if (isset($action_id) && !is_numeric($action_id))
		{
			http_error(400);
			return (-1);
		}

		if (!isset($_FILES))
		{
			http_error(204, 'no file');
			return (-1);
		}

		// 		si action_id : Checker que l'action lui appartient bien
		if ($auth->postmethod === Auths::OWN
			&& isset($action_id) && !ActionRequestUtilities::IsOwn($db, $action_id, $auth->userid))
		{
			http_error(403);
			return (-1);
		}

		foreach ($_FILES as $key => $file)
		{
			if($key === "document")
				continue ;

			if(isset($file["type"]))
			{
				$validextensions = array("jpeg", "jpg", "png");
				$temporary = explode(".", strtolower($file["name"]));
				$file_extension = end($temporary);

				if ((($file["type"] === "image/png")
					|| ($file["type"] === "image/jpg")
					|| ($file["type"] == "image/jpeg")
					|| ($file["type"] == "image/bmp")
				) && ($file["size"] < 2000000)
				&& in_array($file_extension, $validextensions))
				{
					if ($file["error"] > 0)
					{
						http_error(400, "Return Code: " . $file["error"]);
						return (-1);
					}
					else
					{
						if (file_exists("/imgs" . $file["name"])) {
							http_error(409, $file["name"] . " already exists");
							return (-1);
						}
						else
						{
							if (!$db)
							{
								internal_error("db set to null", __FILE__, __LINE__);
								return (-1);
							}
							$conn = $db->Connect();

							$sourcePath = $file['tmp_name']; // Storing source path of the file in a variable

							//make sure that an action does not contain more than 5 images already
							if (isset($action_id))
							{
								$query = "SELECT COUNT(id) FROM Images WHERE action_id = $action_id";
								try
								{
									$ret = $conn->query($query)->fetchColumn();
									if ($ret >= 5)
									{
										http_error(403, "an action can't contain more than 5 images");
										return (-1);
									}
								}
								catch (Exception $e)
								{
									internal_error("conn->query->fetchColumn : ". $e->getMessage(), __FILE__, __LINE__);
									http_error(400, $e->getMessage());
									return (-1);
								}
							}
							//for user profile images
							else
							{
								$query = "SELECT COUNT(id) FROM Images WHERE user_id = $auth->userid";
								try
								{
									$ret = $conn->query($query)->fetchColumn();
									if ($ret >= 2)
									{
										//Delete l'image la plus recente
										$baseQuery = "SELECT id, file FROM Images WHERE user_id=$auth->userid ORDER BY creation_date DESC LIMIT 1";
										$ret = $conn->query($baseQuery)->fetchAll();
										if ($ret)
										{
											$filename = __APP_DIR__ . "res/images/users/" . $ret[0]['file'];
											unlink($filename);
										}

										$query = "DELETE FROM Images WHERE user_id=$auth->userid ORDER BY creation_date DESC LIMIT 1";
										$stmt = $conn->prepare($query);
										try
										{
											$stmt->bindParam(':user_id', $id);
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
									}
								}
								catch (Exception $e)
								{
									internal_error("conn->query->fetchColumn : ". $e->getMessage(), __FILE__, __LINE__);
									http_error(400, $e->getMessage());
									return (-1);
								}
							}

							$type = isset($action_id) ? 'actions' : 'users';
							$id = isset($action_id) ? $action_id : $auth->userid;
							$fileName = $type . "." . $id . "." . uniqid("", true). "." . $file_extension;
							$targetPath = __APP_DIR__ . "res/images/$type/" . $fileName;
							$query = 'INSERT INTO Images SET '
								. ((isset($fileName)) ? 'file = :file,' : '')
								. ((isset($action_id)) ? 'action_id = :action_id'
								: 'user_id = :user_id');

							$stmt = $conn->prepare($query);

							try
							{
								$stmt->bindParam(":file", $fileName);
								(isset($action_id)) ? $stmt->bindParam(':action_id', $id)
									: $stmt->bindParam(':user_id', $id);
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

							if (!move_uploaded_file($sourcePath,$targetPath))
							{
								http_error(400, "file : ". $file["name"] . " : not created");
								return (-1);
							}
						}
					}
				}
				else
				{
					http_error(400, "Invalid size or type");
					return (-1);
				}
			}
		}
		http_error(201);
	}

	public function		Patch($kwargs)
	{
		http_error(400);
	}

	public function		Delete($kwargs)
	{
		if (!$kwargs
			|| !is_array($kwargs))
		{
			internal_error("kwargs not array or set to null",
				__FILE__, __LINE__);
			return (-1);
		}
		$db = $kwargs["db"];
		$auth = $kwargs["auth"];
		$id = $kwargs["id"];

		if (!is_numeric($id))
		{
			http_error(400);
			return (-1);
		}
		if (!$db)
		{
			internal_error("db set to null", __FILE__, __LINE__);
			return (-1);
		}
		$conn = $db->Connect();

		$query = "SELECT * FROM Images WHERE id = $id";
		try
		{
			$ret = $conn->query($query)->fetchAll();
			if (isset($ret))
			{
				$action_id = $ret[0]["action_id"];
			}
		}
		catch (Exception $e)
		{
			internal_error("conn->query->fetchAll : ". $e->getMessage(), __FILE__, __LINE__);
			http_error(400, $e->getMessage());
			return (-1);
		}

// 		si action_id : Checker que l'action lui appartient bien
		if ($auth->deletemethod === Auths::OWN
			&& !ActionRequestUtilities::IsOwn($db, $action_id, $auth->userid))
		{
			http_error(403);
			return (-1);
		}

		$query = "DELETE FROM Images WHERE id = $id";
		try
		{
			$conn->query($query);
		}
		catch (Exception $e)
		{
			internal_error("conn->query : ". $e->getMessage(), __FILE__, __LINE__);
			http_error(400, $e->getMessage());
			return (-1);
		}

		//delete image from file system
		$entry = $ret[0];
		$type = $entry['action_id'] !== null ? 'actions' : 'users';
		$filename = __APP_DIR__ . "res/images/$type/" . $entry['file'];
		unlink($filename);
		http_error(200);
	}
}
?>
