select count(c.cadastro) 
from caj_velis_integracao c  
    inner join clientes  cli on(cli.cod_cliente = c.cliente)  
    inner join CLI_CANAL_VENDA clic on clic.COD_TIP_CARTEIRA = 01 
                                   and(clic.cod_cliente = c.cliente) 
                                   and cli.cod_tip_cli not in ('98', '99') 
                                   and cli.ies_situacao in ('A', 'S') 
 where c.sincronizado = 'N' 
  and c.status is null  
  and (cli.ies_situacao <> 'P'  or cli.ies_situacao is null) 
  and c.cadastro = 'cliente'



  select c.cadastro, s.tipo, c.cliente, c.representante, c.data_inclusao 
from caj_velis_integracao c  
    inner join caj_velis_integracao_sequencia s on(trim(s.tipo) = trim(c.cadastro)) 
    left join clientes  cli on(cli.cod_cliente = c.cliente)  
where c.sincronizado = 'N' 
  and c.status is null  
  and (cli.ies_situacao <> 'P'  or cli.ies_situacao is null) 
  and c.cadastro <> 'cliente' 
order by 
s.ordem, c.data_inclusao asc