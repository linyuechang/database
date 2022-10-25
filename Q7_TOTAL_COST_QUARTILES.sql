WITH expenditures AS (
    SELECT
        IFNULL(c.CompanyName, 'MISSING_NAME') AS CompanyName,o.CustomerId,ROUND(SUM(od.Quantity * od.UnitPrice), 2) AS TotalCost
    FROM 'Order' AS o
    INNER JOIN OrderDetail od on od.OrderId = o.Id
    LEFT JOIN Customer c on c.Id = o.CustomerId
    GROUP BY o.CustomerId
),
quartiles AS (
    SELECT *, NTILE(4) OVER (ORDER BY TotalCost ASC) AS ExpenditureQuartile
    FROM expenditures
)
SELECT CompanyName, CustomerId, TotalCost
FROM quartiles
WHERE ExpenditureQuartile = 1
ORDER BY TotalCost ASC
