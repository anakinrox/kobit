select kbt.id, kbt.idproposta, kbt.seq_proposta as seqProposta, CONCAT(pr.nr_proposta, '-', pr.nr_versao) as proposta, kbt.nom_responsavel, kbt.num_telefone 
from kbt_t_instalacoes kbt 
    inner join kbt_t_instalacoes_status kbtS on (kbtS.id = kbt.id_status)   
    inner join pon_proposta pr on(pr.id = kbt.idproposta)  
where kbtS.indsinc = 'S' 
  and kbt.ind_sync is null 
  and kbt.id_status <> 11 
go
select * from kbt_t_instalacoes_status order by ordem
go
insert into kbt_t_instalacoes_status (id, descricao, indsinc, ordem, corfundo, cortexto,ativo, interacao) values
                                     (14, 'Recusado Aceite','N',4,'#00CED1','black',true,'M')
go 
update kbt_t_instalacoes_status set interacao ='A' where id = 14
go
select * from kbt_t_instalacoes where idproposta = 379279
go
update kbt_t_instalacoes set id_status = 7 where id = 11070
go
select * from kbt_t_instalacoes_itens where idinstalacao = 11070
go
