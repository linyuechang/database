SELECT CategoryName, COUNT(*) AS CategoryCount , ROUND(AVG(UnitPrice), 2) AS AvgUnitPrice, MIN(UnitPrice) AS MinUnitPrice
     , MAX(UnitPrice) AS MaxUnitPrice
     , SUM(UnitsOnOrder) AS TotalUnitsOnOrder
FROM Product INNER JOIN Category on CategoryId = Category.Id
GROUP BY CategoryId
HAVING CategoryCount > 10
ORDER BY CategoryId;