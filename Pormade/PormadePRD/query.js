select distinct usc.usuario_id as id
    , uss.usr_nome as name
    , COALESCE(usc.email_corporativo, '') as email
    , COALESCE(uss.usr_telefone, '') as phone
    , COALESCE(uss.usr_celular, '') as celphone
    , COALESCE(uss.usr_cpf, '') as document
    , pt.equipe
from crm.tb_usuario usc
	join fr_usuario uss on(uss.usr_codigo = usc.usuario_id)
    join online.pon_cargos_funcionario pcf on(pcf.usr_codigo = uss.usr_codigo)
and(pcf.id_responsavel is not null)

    left join online.pon_pessoa_patrocinador pt on(pt.id_pessoa = pcf.id_pessoa)

    join crm.tb_funil_usuario fu on(fu.usuario_id = usc.usuario_id)
    join crm.tb_funil fn on(fn.id = fu.funil_id)  
    AND fu.funil_id = 5  

order by
pt.equipe,
    uss.usr_nome