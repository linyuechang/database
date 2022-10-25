SELECT DISTINCT ShipName, substr(ShipName, 0, instr(ShipName, '-')) as task1
FROM 'Order'
WHERE ShipName LIKE '%-%'
ORDER BY ShipName ASC;