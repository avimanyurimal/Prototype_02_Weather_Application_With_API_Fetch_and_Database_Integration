<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "weather_avimanyu";

$cityParam = $_GET['city'];

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$currentDate = strtotime(date('Y-m-d'));

for ($i = 1; $i <= 6; $i++) {
    $targetDate = date('Y-m-d', strtotime("-$i days", $currentDate));

    $sql = "SELECT * FROM avimanyu_weather_data WHERE city = '$cityParam' AND DATE(date) = '$targetDate' ORDER BY date DESC";
    $result = $conn->query($sql);

    echo "<div class='past-weather-box'>
        <div class='past-weather-content'>
            <h2>Past Weather Data for: <br/> $cityParam on <br>$targetDate</h2>";

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            echo "<p>Temperature: {$row['temperature']} °C</p>
                <p>Humidity: {$row['humidity']}%</p>
                <p>Pressure: {$row['pressure']} Pa</p>
                <p>Wind Speed: {$row['wind']} m/s</p>
                <p>Description: {$row['description']}</p>";
        }
    } else {
        echo "<p>Temperature: N/A</p>
            <p>Humidity: N/A</p>
            <p>Pressure: N/A</p>
            <p>Wind Speed: N/A</p>
            <p>Description: N/A</p>";
    }

    echo "</div>
    </div>";
}

$conn->close();
?>
