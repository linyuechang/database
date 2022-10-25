with rel1 as (
      select Product.Id, Product.ProductName as all_id
      from Product
            inner join OrderDetail on Product.id = OrderDetail.ProductId
            inner join 'Order' on 'Order'.Id = OrderDetail.OrderId
            inner join Customer on CustomerId = Customer.Id
      where DATE(OrderDate) = '2014-12-25' and CompanyName = 'Queen Cozinha'
      group by Product.id
),
rel2 as (
      select row_number() over (order by rel1.id asc) as seqnum, rel1.all_id as all_id
      from rel1
),
rel3 as (
      select seqnum, all_id as all_id
      from rel2
      where seqnum = 1
      union all
      select rel2.seqnum, f.all_id || ', ' || rel2.all_id
      from rel2 join
            rel3 f
            on rel2.seqnum = f.seqnum + 1
)
select all_id from rel3
order by seqnum desc limit 1;
