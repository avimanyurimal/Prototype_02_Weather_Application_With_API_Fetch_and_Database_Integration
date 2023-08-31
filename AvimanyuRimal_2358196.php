<?php
$servername = "localhost";
$username = "root";
$password = ""; 
$dbname = "weather_avimanyu"; 

$data = json_decode(file_get_contents("php://input"));

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$city = $data->city;
$temperature = $data->data->main->temp;
$humidity = $data->data->main->humidity;
$pressure = $data->data->main->pressure;
$wind = $data->data->wind->speed;
$description = $data->data->weather[0]->description;

// Checking if data for the same city exists on the current date
$sql = "SELECT * FROM avimanyu_weather_data WHERE city = '$city' AND DATE(date) = CURDATE()";

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    // Data for the same city exists on the current date
    echo "Data for the same city already exists today";
} else {
    // Insert the data into the database
    $sql = "INSERT INTO avimanyu_weather_data (city, date, temperature, humidity, pressure, wind, description)
            VALUES ('$city', NOW(), '$temperature', '$humidity', '$pressure', '$wind', '$description')";

    if ($conn->query($sql) === TRUE) {
        echo "Data saved successfully";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}

$conn->close();
