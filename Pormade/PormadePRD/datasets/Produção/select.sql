select 
    distinct 1 
FROM " + tPai + "  sc  
join documento dc on (dc.cod_empresa = sc.companyid      
        and dc.nr_documento = sc.documentid      
        and dc.nr_versao = sc.version 
        and dc.versao_ativa = 1) 
where 1=1 
  and sc.documentid = 
  and (sc.lat_visita is null and sc.long_visita is null)