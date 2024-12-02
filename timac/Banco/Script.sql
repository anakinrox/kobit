select IND_ATIVO, *  from TIM_STOP_METAS tsm where tsm.LOGIN  = 'ana.nunes';
select * from TIM_FLUIG_USUARIOS tfu ;

select * from vw_FLUIG_USUARIOS;
select * from VW_FLUIG_CARGO;

select distinct CARGO from vw_FLUIG_USUARIOS;
select distinct AREA from vw_FLUIG_USUARIOS;

UPDATE TIM_STOP_METAS SET IND_ATIVO = 'S' where CARGO  = 'ASSISTENTE';


update TIM_STOP_METAS

select * from corporerm.dbo.VW_FLUIG_CARGO;

select * from [POA-SRV-BDRM].[CorporeRM].[dbo].VW_FLUIG_CARGO;''

INSERT INTO TIM_STOP_METAS (CARGO, AREA, LOGIN, META_01, META_02, META_03, META_04, META_05, META_06, META_07, META_08, META_09, META_10, META_11, META_12, DAT_ATUALIZACAO, MATRICULA, ANO_VIGENCIA) VALUES('','','',1, 2,3,4, 5, 6, 7,8, 9, 10, 11, 12, '2021-08-04', 'ariberto.kobit', 2021)

select * from TIM_STOP_METAS where ANO_VIGENCIA = 2021 and LOGIN = '' and AREA = '' and CARGO = '';
delete from TIM_STOP_METAS where  LOGIN = 'marcela.bueno';