select * from usuarios where codusuario = 1;
select * from usuarios where nomUsuario like 'Elizabeth%';
select * from eventos;
select * from leadEventos;
select * from usuarioEventos;

update leadEventos set indSync = null;


select * from rotas where documentoID = 503819;

-- insert into usuarioEventos (codEvento, codUsuario, datInicio, datFim) values
(select codUsuario from usuarios where codEmpresa = 1 and (login = 'sr5.2' or numCPF = '21950581888'));

select codEvento from eventos where codEmpresa = 1 and documentID = 88488;

select * from cidades where codCidade = 'SC023';
  
select
	e.codEvento,
    e.idFluig,
    e.documentID,
    e.nomEvento,
    e.datInicio,
    e.datFim,
    e.codCidade,
    c.cidade,
    c.uf,
    e.nomEndereco,
    e.nomBairro,
    e.latitude,
    e.longitude,
    e.indSituacao
from eventos e 
	inner join cidades c on (c.codCidade = e.codCidade)
where e.codEmpresa = 1
  and not exists (select 1 from usuarioEventos ue where ue.codEvento = e.codEvento)
  and (e.datInicio <= current_date() and e.datFim >= current_date())  
union all
select 	
	e.codEvento,
    e.idFluig,
    e.documentID,
    e.nomEvento,
    e.datInicio,
    e.datFim,
    e.codCidade,
    c.cidade,
    c.uf,
    e.nomEndereco,
    e.nomBairro,
    e.latitude,
    e.longitude,
    e.indSituacao 
from eventos e 
	inner join cidades c on (c.codCidade = e.codCidade)
	inner join usuarioEventos eu on (eu.codEvento = e.codEvento)
								and (eu.codUsuario = 1)
                                and (eu.datInicio <= current_date() and eu.datFim >= current_date())
where e.codEmpresa = 1
  and (e.datInicio <= current_date() and e.datFim >= current_date());
  
  
select 
    l.indSync,
    l.codEvento,
    l.numLead,
    e.documentID,
    e.codOrigem,
    l.nomLead,
    l.email,
    l.numTelefone,
    l.codCidade,
    c.cidade,
    c.UF
    l.nomEndereco,
    l.nomBairro,
    l.codProfissao,     
	pr.profissao,
	pr.idFunil,
    pr.funil,
    l.idGestor, 
    case 
		when pr.idDestinatario is not null then
			pr.idDestinatario
		else
			g.idFunil
	end as idPipe,
    g.nomGestor,
    l.indAmostra,
    l.obsLead,
    l.latitude,
    l.longitude,
    u.nomUsuario as motirista,
    u.numCPF as cpf    
from leadEventos l 
	inner join eventos e on (e.codEvento = l.codEvento)
    inner join cidades c on (c.codCidade = l.codCidade)
	left join usuarios u on (u.codUsuario = l.codusuario)
    left join profissoes pr on (pr.id = l.codProfissao)
    left join gestorFunil g on (g.codProfissao = l.codProfissao)
						   and (g.id = l.idGestor)    
where l.indSync is not null;
  
select p.id,
    p.indSync,
    p.codvisita,
    v.local,
    p.documentoID,
    p.idFluig,
    p.contato,
    DATE_FORMAT( p.data, '%d/%m/%Y' ) as data,
    p.hora,
    p.empresa,
    p.telefone,
    p.uf,
    p.cidade,
    c.idCidade,
    c.codUf,
    c.codPais,
    p.idProfissao,
    case
		when p.idProfissao is null then
			p.profissao
        else        
			pr.profissao
	end as profissao,
	pr.idFunil,
    pr.funil,
    p.idGestor, 
    case 
		when pr.idDestinatario is not null then
			pr.idDestinatario
		else
			g.idFunil
	end as idPipe,
    g.nomGestor,
    p.motivoRecusa,
    p.observacao,
    p.latitude,
    p.longitude,
    p.indSituacao
    ,u.nomUsuario as motirista
    ,u.login as cpf
from parceiros p 
    inner join visitas v on (v.id = p.codVisita)
                        -- and (v.id >= 480)
	inner join rotas_cidades rc on (rc.id = v.codCidade)
	inner join rotas r on (r.id = rc.codRota)    
	left join usuarios u on (u.codUsuario = p.codusuario)
	left join cidades c on (c.cidade = p.cidade)
					    and (c.uf = p.uf)
    left join profissoes pr on (pr.id = p.idProfissao)
    left join gestorFunil g on (g.codProfissao = p.idProfissao)
						   and (g.id = p.idGestor)
where p.indSync is not null;
 
  
  
  