SELECT 
    a.cod_empresa,  
    a.remetente,  
    a.cep_remetente,  
    a.num_om,  
    a.dat_emis, 
    a.num_pedido,  
    sum( a.qtd_reservada ) as qtd_reservada,  
    sum( a.peso ) as peso, 
    sum( a.cubagem ) as cubagem,  
    sum( a.qtd_volume_om ) as volume,  
    sum( a.valor ) as valor, 
    a.cod_cliente,  
    a.destinatario,  
    a.cep_destinatario, 
    a.cod_transpor, 
    ped.ies_frete, 
    nat.cod_cliente as cod_conta_ordem, 
    substr(replace(replace(replace(clic.num_cgc_cpf,'.',''),'/',''),'-',''),2,15)  as conta_ordem, 
    cad.consignatario as cod_consig, 
    substr(replace(replace(replace(clir.num_cgc_cpf,'.',''),'/',''),'-',''),2,15)  as consignatario 
FROM kbt_v_om a  
    inner join pedidos ped on (ped.cod_empresa = a.cod_empresa)
     and (ped.num_pedido = a.num_pedido)
    left join ped_item_nat nat on ( ped.cod_empresa = nat.cod_empresa
     and ped.num_pedido = nat.num_pedido
     and nat.num_sequencia = 0 )
    left join clientes clic on (clic.cod_cliente = nat.cod_cliente)
    left join ped_consg_adic cad on (cad.Empresa = ped.cod_Empresa
     and cad.pedido = ped.num_pedido)
    left join clientes clir on (clir.cod_cliente = cad.consignatario)
WHERE a.cod_empresa = '01'  
    and ( a.cod_transpor = '0' OR a.cod_transpor = '' OR a.cod_transpor IS NULL ) 
    and not exists (select 1 from kbt_t_om where cod_Empresa = a.cod_Empresa and num_om = a.num_om) 
    and ped.ies_frete in (1,2,4,5) 
group by  
    a.cod_empresa,  
    a.remetente,  
    a.cep_remetente,  
    a.num_om,  
    a.dat_emis, 
    a.num_pedido,  
    a.cod_cliente,  
    a.destinatario,  
    a.cep_destinatario, 
    a.cod_transpor, 
    ped.ies_frete, 
    nat.cod_cliente, 
    clic.num_cgc_cpf, 
    cad.consignatario, 
    clir.num_cgc_cpf