SELECT CompanyName, round(delayCnt * 100.0 / cnt, 2) AS task3
FROM (
      SELECT ShipVia, COUNT(*) AS cnt 
      FROM 'Order'
      GROUP BY ShipVia
     ) AS totalCnt
INNER JOIN (
            SELECT ShipVia, COUNT(*) AS delaycnt 
            FROM 'Order'
            WHERE ShippedDate > RequiredDate 
            GROUP BY ShipVia
           ) AS delayCnt
          ON totalCnt.ShipVia = delayCnt.ShipVia
INNER JOIN Shipper on totalCnt.ShipVia = Shipper.Id
ORDER BY task3 DESC;