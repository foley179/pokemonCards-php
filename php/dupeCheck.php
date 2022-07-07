<?php
	// function get_result(\mysqli_stmt $statement) {
	// 	// having to use this function in production as webHost does not use mysqlnd
	// 	$result = array();
	// 	$statement->store_result();
	// 	for ($i = 0; $i < $statement->num_rows; $i++) {
	// 		$metadata = $statement->result_metadata();
	// 		$params = array();
	// 		while ($field = $metadata->fetch_field())	{
	// 			$params[] = &$result[$i][$field->name];
	// 		}
	// 		call_user_func_array(array($statement, 'bind_result'), $params);
	// 		$statement->fetch();
	// 	}
	// 	return $result;
	// }

	// remove next two lines for production
	
	ini_set("display_errors", "On");
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);
	
	// this includes the login details
	
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

	// SQL statement accepts parameters and so is prepared to avoid SQL injection.
	// $_REQUEST used for development / debugging. Remember to change to $_POST for production

	$query = $conn->prepare("SELECT id FROM users WHERE username = ?"); 

	$query->bind_param("s", $_REQUEST["text"]);

	$query->execute();
	
	if (false === $query) {

		$output["status"]["code"] = "400";
		$output["status"]["name"] = "executed";
		$output["status"]["description"] = "query failed";	
		$output["data"] = [];

		mysqli_close($conn);

		echo json_encode($output); 

		exit;

	}

  // $result = get_result($query); // used in production
  $result = $query->get_result();

  $data = [];

	// while ($row = array_shift($result)) { // used in production
	while ($row = mysqli_fetch_assoc($result)) {

		array_push($data, $row);
		// row = 

	}

	$output["status"]["code"] = "200";
	$output["status"]["name"] = "ok";
	$output["status"]["description"] = "success";
	$output["status"]["returnedIn"] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output["data"] = $data;
	
	mysqli_close($conn);

	echo json_encode($output); 

?>