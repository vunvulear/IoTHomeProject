WITH avgdata AS (
SELECT 
    deviceId as deviceId,
    System.TimeStamp as timeslot,
    AVG(sensorInf.temp) as avgtemp,
    AVG(sensorInf.humidity) as avghumidity,
    AVG(sensorInf.distance) as avgdistance,
    AVG(sensorInf.light) as avglight
FROM
    inputDeviceData TIMESTAMP BY EventEnqueuedUtcTime
WHERE
    msgType = 'sensorData'
GROUP BY
    deviceId,
    TumblingWindow(second, 60)
)

SELECT
    deviceId as deviceId,
    sensorInf.temp as temp,
    sensorInf.humidity as humidity,
    sensorInf.distance as distance,
    sensorInf.light as light,
    EventEnqueuedUtcTime as receivedTime
INTO
    outputSensorDataBlobStorage
FROM
    inputDeviceData TIMESTAMP BY EventEnqueuedUtcTime
WHERE
    msgType = 'sensorData'


SELECT 
    *
INTO 
    outputSensorDataConsolidatedTableStorage
FROM
	avgdata
    
SELECT 
    *
INTO 
    outputSensorDataTopic
FROM
    avgdata

SELECT 
    *
INTO 
    outputPowerBIDataConsolidated
FROM
    avgdata