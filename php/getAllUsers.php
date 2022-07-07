<?php

	// example use from browser
	// http://localhost/companydirectory/libs/php/getAll.php

	// remove next two lines for production
	
	ini_set("display_errors", "On");
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

	include("config.php");

	header("Content-Type: application/json; charset=UTF-8");

	$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

	if (mysqli_connect_errno()) {
		
		$output["status"]["code"] = "300";
		$output["status"]["name"] = "failure";
		$output["status"]["description"] = "database unavailable";
		$output["status"]["returnedIn"] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output["data"] = [];

		mysqli_close($conn);

		echo json_encode($output);

		exit;

	}	

	// SQL does not accept parameters and so is not prepared

	$query = "SELECT id, username FROM users ORDER BY username";

	$result = $conn->query($query);
	
	if (!$result) {

		$output["status"]["code"] = "400";
		$output["status"]["name"] = "executed";
		$output["status"]["description"] = "query failed";	
		$output["data"] = [];

		mysqli_close($conn);

		echo json_encode($output); 

		exit;

	}
   
	$data = [];

	while ($row = mysqli_fetch_assoc($result)) {

		array_push($data, $row);
		// row = {"id":"23","lastName":"Ace","firstName":"Tamarra","jobTitle":"","email":"tacem@vinaora.com","department":"Support","departmentId":"9","location":"Munich","locationId":"4"},

	}

	$output["status"]["code"] = "200";
	$output["status"]["name"] = "ok";
	$output["status"]["description"] = "success";
	$output["status"]["returnedIn"] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output["data"] = $data;
	
	mysqli_close($conn);

	echo json_encode($output); 

?>