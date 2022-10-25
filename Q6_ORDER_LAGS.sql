SELECT
     Id , OrderDate, PreDate , ROUND(julianday(OrderDate) - julianday(PreDate), 2)
FROM (
     SELECT Id, OrderDate, LAG(OrderDate, 1, OrderDate) OVER (ORDER BY OrderDate ASC) AS PreDate
     FROM 'Order' 
     WHERE CustomerId = 'BLONP'
     ORDER BY OrderDate ASC
     LIMIT 10
);