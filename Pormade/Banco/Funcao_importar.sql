CREATE OR REPLACE FUNCTION "public"."kbt_f_importardados" (in codigo int8) RETURNS int8 AS
$BODY$
DECLARE 
    PAR_ID_TABELA 		ALIAS FOR $1;
	VAR_SQL				TEXT;	
	VAR_ITENS			RECORD;
	
BEGIN
    if PAR_ID_TABELA = 1 then
        DELETE FROM kbt_t_medidas;

        VAR_SQL:='select                
                    tam_largura,
                    tam_altura,
                    tam_espessura
                  from pmd_prc_medida_porta';

                FOR VAR_ITENS IN EXECUTE VAR_SQL
                LOOP

                    insert into kbt_t_medidas (codmedida, codunidade, numlargura, numaltura, numespessura) values
                           ((select coalesce((max(codMedida)+1),1) from kbt_t_medidas),1,VAR_ITENS.tam_largura,VAR_ITENS.tam_altura, VAR_ITENS.tam_espessura);

                END LOOP;
    end if;

    if PAR_ID_TABELA = 2 then
        DELETE FROM kbt_t_modeloPorta;
        VAR_SQL:='select    
                        descricao_modelo
                    from pmd_prc_modelo_porta';

                FOR VAR_ITENS IN EXECUTE VAR_SQL
                LOOP

                    insert into kbt_t_modeloPorta (codModelo, descporta) values
                           ((select coalesce((max(codModelo)+1),1) from kbt_t_modeloPorta),VAR_ITENS.descricao_modelo);

                END LOOP;
    end if;

    if PAR_ID_TABELA = 3 then
        DELETE FROM kbt_t_montagem;
        VAR_SQL:='select    
                        descricao_montagem
                    from pmd_prc_montagem';

                FOR VAR_ITENS IN EXECUTE VAR_SQL
                LOOP

                    insert into kbt_t_montagem (codmontagem, descmontagem) values
                           ((select coalesce((max(codmontagem)+1),1) from kbt_t_montagem),VAR_ITENS.descricao_montagem);

                END LOOP;
    end if;

    if PAR_ID_TABELA = 4 then
        DELETE FROM kbt_t_tipoporta;
        VAR_SQL:='select    
                    distinct
                        descricao_tipoporta,
                        porta_dupla
                    from pmd_prc_tipo_porta';

                FOR VAR_ITENS IN EXECUTE VAR_SQL
                LOOP

                    insert into kbt_t_tipoporta (codtipoporta, descporta, portadupla) values
                           ((select coalesce((max(codtipoporta)+1),1) from kbt_t_tipoporta),VAR_ITENS.descricao_tipoporta, VAR_ITENS.porta_dupla);

                END LOOP;
    end if;


	RETURN 1;
	
END;
   $BODY$
LANGUAGE 'plpgsql'