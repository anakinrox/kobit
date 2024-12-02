create table kbt_lista_preco(
	id integer,
	descricao varchar(255),
	validade_de date,
	validade_ate date
);
create unique index pk_kbt_lista_preco on kbt_lista_preco (id);

create table kbt_lista_preco_cotacao(
	id integer,
    cod_moeda integer,
	val_cotacao decimal(15,5)
);
create unique index pk_kbt_lista_preco_cotacao on kbt_lista_preco_cotacao (id, cod_moeda);	


create table kbt_lista_preco_item(
	id integer,
	cod_item char(15),
	tipo_produdo char(15), //(Imp/Text/Nac/Fac)
    cod_moeda integer,
	val_base decimal(15,5),
	perc_comiss decimal(15,5),
	perc_desc_adic decimal(15,5)
);
create unique index pk_kbt_lista_preco_item on kbt_lista_preco_item (id, cod_item);	

drop table kbt_lista_preco_aen;
create table kbt_lista_preco_aen(
	id integer,
	cod_aen_n1 integer,
	cod_aen_n2 integer,
	cod_aen_n3 integer,
	cod_aen_n4 integer,
	tipo_produdo char(15), //(Imp/Text/Nac/Fac)
	tipo_embalagem char(1), //(Caixa, Saco, Fardo)
    cod_moeda integer,
	val_base decimal(15,5),
	perc_comiss decimal(15,5),
	perc_desc_adic decimal(15,5)
	
);
create unique index pk_kbt_lista_preco_aen on kbt_lista_preco_aen (id, cod_aen_n1, cod_aen_n2, cod_aen_n3, cod_aen_n4);	

create table kbt_lista_preco_parametro(
	id integer,
	parametro char(15), //(tributo/prazo/peso)
	tipo_produdo char(15), //(Imp/Text/Nac/Fac)
	descricao varchar(255),
	aplicacao varchar(255),
	val_de decimal(15,5),
	val_ate decimal(15,5),
	tipo_acres char(1), //(%/R$)
	val_acres char(1), //(+/-)
	perc_desc_comiss decimal(15,5),
	perc_desc_adic decimal(15,5)
);
create unique index pk_kbt_lista_preco_parametro on kbt_lista_preco_parametro (id, parametro, tipo_produdo );	