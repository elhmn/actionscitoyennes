<?php

/* ************************************************************************** */
/*                                                                            */
/*  Uri.class.php                                                             */
/*                                                                            */
/*   By: elhmn <www.elhmn.com>                                                */
/*             <nleme@live.fr>                                                */
/*                                                                            */
/*   Created:                                                 by elhmn        */
/*   Updated: Wed Feb 20 19:03:14 2019                        by elhmn        */
/*                                                                            */
/* ************************************************************************** */

	class		Uri
	{
		public static		$verbose = false;

		public	$id;
		public	$apiVersion;
		public	$apiKey;
		public	$apiType;
		public	$method;
		public	$endPoint;
		public	$split;

		//constructor
		public function		__construct($uri, $method)
		{
			if (self::$verbose)
			{
				echo __CLASS__. " constructor called !" . PHP_EOL;
			}

			if (!is_string($uri))
			{
				internal_error('uri', __FILE__, __LINE__);
				return null;
			}
			$this->ExtractUrlData($uri);
			$this->method = $method;
		}

		//destructor
		public function		__destruct()
		{
			if (self::$verbose)
			{
				echo __CLASS__. " desctructor called !" . PHP_EOL;
			}
		}

		public function		ExtractUrlData($uri)
		{
			$data_arr = null;

			if (!is_string($uri))
			{
				internal_error('uri', __FILE__, __LINE__);
				return (0);
			}
			$data_arr = explode('/', $uri);
			$data_arr = array_filter($data_arr);
			$data_arr = array_values($data_arr);
			$this->split = $data_arr;

			$i = 0;
 			$this->apiVersion = (isset($data_arr[$i])) ? $data_arr[$i++] : null;
 			$this->apiType = (isset($data_arr[$i])) ? $data_arr[$i++] : null;
			if ($this->apiType === "private")
			{
				$this->apiKey = (isset($data_arr[$i])) ? $data_arr[$i++] : null;
			}
 			$this->endPoint = (isset($data_arr[$i])) ? $data_arr[$i++] : null;
 			$this->id = (isset($data_arr[$i])) ? $data_arr[$i++] : null;
		}

		public function		__toString()
		{
			return (__CLASS__ ." : \n{"
				. "\n\tmethod = [$this->method], "
				. "\n\tapiVersion = [$this->apiVersion], "
				. "\n\tapiType = [$this->apiType], "
				. "\n\tapiKey = [$this->apiKey], "
				. "\n\tendPoint = [$this->endPoint], "
				. "\n\tid = [$this->id]"
				."\n}\n"
			);
		}
	};

?>
