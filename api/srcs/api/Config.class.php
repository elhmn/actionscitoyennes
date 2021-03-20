<?php

/* ************************************************************************** */
/*                                                                            */
/*  Config.class.php                                                          */
/*                                                                            */
/*   By: elhmn <www.elhmn.com>                                                */
/*             <nleme@live.fr>                                                */
/*                                                                            */
/*   Created:                                                 by elhmn        */
/*   Updated: Fri Aug 28 10:05:40 2020                        by elhmn        */
/*                                                                            */
/* ************************************************************************** */

	class		Config
	{
		public static		$verbose = false;

		public 		$authDBHost = 'localhost'; // Default
		public 		$apiDBHost = 'localhost'; // Default
		public 		$apiDBHostPort = null; // Default
		public 		$apiDBUserName = 'root'; // Default
		public 		$apiDBPassword = 'test'; // Default
		public 		$authDBUserName = 'root'; // Default
		public 		$authDBPassword = 'test'; // Default
		public 		$apiDBName = 'actions_citoyennes'; // Default
		public 		$authDBName = 'ac_authentication'; // Default
		public 		$testApiKey = 'test'; // Default
		public 		$emailAddress = 'noreply@actions-citoyennes.com'; // Default
		public 		$authHostName = 'localhost'; // Default
		public 		$frontendHostName = 'localhost:3000'; // Default

		public 		$apiVersions = [
			'v1'
		];

		public 		$apiTypes = [
			'public',
			'private'
		];

		public 		$methods = [
			'get',
			'post',
			'patch',
 			'delete'
		];

		public 		$endPoints = [
			'users',
			'resetpassword',
			'signup',
			'actions',
			'images',
			'comments',
			'featuredactions',
			'createaction',
			'completedactions',
			'extras',
			'search',
			'laborcontributions',
			'materialcontributions',
			'moneycontributions',
			'laborneeds',
			'materialneeds',
			'moneyneeds',
			'actionscontributed',
		];

		private static 	$instance = null;

		public 			$errorLogFileName = "./logs/error.log";
		public 			$configFileName = "./config.json";

		private function		initConfigData()
		{
			$data = json_decode(file_get_contents($this->configFileName));
			$this->authDBHost = $data->authDBHost;
			$this->apiDBHost = $data->apiDBHost;
			$this->apiDBHostPort = $data->apiDBHostPort;
			$this->apiDBUserName = $data->apiDBUserName;
			$this->apiDBPassword = $data->apiDBPassword;
			$this->authDBUserName = $data->authDBUserName;
			$this->authDBPassword = $data->authDBPassword;
			$this->apiDBName = $data->apiDBName;
			$this->authDBName = $data->authDBName;
			$this->testApiKey = $data->testApiKey;
			$this->emailAddress = $data->emailAddress;
			$this->frontendHostName = $data->frontendHostName;
			$this->authHostName = $data->authHostName;
		}

		//constructor
		private function		__construct()
		{
			if (self::$verbose)
			{
				echo __CLASS__. " constructor called !" . PHP_EOL;
			}
			$this->initConfigData();
		}

		public static function			GetInstance()
		{
			if (Config::$instance === null)
			{
				if (!(Config::$instance = new Config()))
				{
					internal_error("Config::instance construction failed !",
						__FILE__, __LINE__);
					return (null);
				}
			}
			return (Config::$instance);
		}

		//destructor
		public function		__destruct()
		{
			if (self::$verbose)
			{
				echo __CLASS__. " desctructor called !" . PHP_EOL;
			}
		}

		public static function		LogClass()
		{
			return (__CLASS__ . " : \n{"
				. "\n\tapiVersions = [$this->apiVersions], "
				."\n}\n"
			);
		}
	};

?>
