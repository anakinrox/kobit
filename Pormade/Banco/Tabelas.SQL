
CREATE TABLE public.kbt_t_unidadesMedidas (
  codUnidade int4 NOT NULL,
  nomUnidade VARCHAR(15) NOT NULL,
  indSituacao VARCHAR(1) NULL DEFAULT 'A',
  PRIMARY KEY (codUnidade))
go
insert into kbt_t_unidadesMedidas (codUnidade, nomunidade) values (1,'Centrimetro')
go
insert into kbt_t_unidadesMedidas (codUnidade, nomunidade) values (2,'Milimetro')
go
insert into kbt_t_unidadesMedidas (codUnidade, nomunidade) values (3,'Metro')
go
insert into kbt_t_unidadesMedidas (codUnidade, nomunidade) values (4,'Polegada')
go

CREATE TABLE public.kbt_t_medidas (
  codMedida int4 NOT NULL,
  codUnidade int4 NULL DEFAULT NULL,
  numLargura int4 NULL DEFAULT NULL,
  numAltura int4 NULL DEFAULT NULL,
  numEspessura int4 NULL DEFAULT NULL,
  indSituacao VARCHAR(1) NULL DEFAULT 'A',
  PRIMARY KEY (codMedida))
go

CREATE TABLE public.kbt_t_cores (
  codCor int4 NOT NULL,
  nomCor VARCHAR(45) NULL DEFAULT NULL,
  indSituacao VARCHAR(1) NULL DEFAULT 'A',
  PRIMARY KEY (codCor))
go

CREATE TABLE public.kbt_t_tipoPorta (
  codTipoPorta int4 NOT NULL,
  descPorta VARCHAR(55) NULL DEFAULT NULL,
  portaDupla VARCHAR(1) NULL DEFAULT 'N',
  indSituacao VARCHAR(1) NULL DEFAULT 'A',
  PRIMARY KEY (codTipoPorta))
go

CREATE TABLE public.kbt_t_materiais (
  codMaterial int4 NOT NULL,
  descMaterial VARCHAR(45) NULL DEFAULT NULL,
  indSituacao VARCHAR(1) NULL DEFAULT 'A',
  PRIMARY KEY (codMaterial))
go
insert into kbt_t_materiais (codmaterial, descmaterial) values (1,'PVC')
go
insert into kbt_t_materiais (codmaterial, descmaterial) values (2,'Madeira')
go

CREATE TABLE public.kbt_t_ambientes (
  codAmbiente int4 NOT NULL,
  descAmbiente VARCHAR(45) NULL DEFAULT NULL,
  indSituacao VARCHAR(1) NULL DEFAULT 'A',
  PRIMARY KEY (codAmbiente))
go
insert into kbt_t_ambientes (codambiente, descambiente) values (1,'Interno')
go
insert into kbt_t_ambientes (codambiente, descambiente) values (2,'Externo')
go

CREATE TABLE public.kbt_t_acabamentos (
  codAcabamento int4 NOT NULL,
  descAcabemento VARCHAR(45) NULL DEFAULT NULL,
  indSituacao VARCHAR(1) NULL DEFAULT 'A',
  PRIMARY KEY (codAcabamento))
go

CREATE TABLE public.kbt_t_acabamentoCores (
  codAcabemento int4 NOT NULL,
  codCor int4 NOT NULL,
  PRIMARY KEY (codAcabemento, codCor))
go

ALTER TABLE public.kbt_t_acabamentoCores
	ADD CONSTRAINT fk_acabamento
	FOREIGN KEY(codAcabemento)
	REFERENCES public.kbt_t_acabamentos(codAcabamento)
go

CREATE TABLE public.kbt_t_enchimentos (
  codEnchimento int4 NOT NULL,
  descEnchimento VARCHAR(45) NULL DEFAULT NULL,
  indSituacao VARCHAR(1) NULL DEFAULT 'A',
  PRIMARY KEY (codEnchimento))
go

CREATE TABLE public.kbt_t_enchimentoAcabamento (
  codEnchimento int4 NOT NULL,
  codAcabamento int4 NOT NULL,
  PRIMARY KEY (codEnchimento, codAcabamento))
go

CREATE TABLE public.kbt_t_enchimentosMedidas (
  codEnchimento int4 NOT NULL,
  codMedida int4 NOT NULL,
  PRIMARY KEY (codEnchimento, codMedida))
go

ALTER TABLE public.kbt_t_enchimentosmedidas
	ADD CONSTRAINT fk_enchMedidas
	FOREIGN KEY(codmedida)
	REFERENCES public.kbt_t_medidas(codmedida)
go

CREATE TABLE public.kbt_t_modeloPorta (
  codModelo int4 NOT NULL,
  descPorta VARCHAR(60) NULL DEFAULT NULL,
  indSitucao VARCHAR(1) NULL DEFAULT 'A',
  PRIMARY KEY (codModelo))
go

CREATE TABLE public.kbt_t_BasePortaTipo (
  codTipoPorta int4 NOT NULL,
  codBasePorta int4 NOT NULL,
  PRIMARY KEY (codTipoPorta, codBasePorta))
go

CREATE TABLE public.kbt_t_BasePortaMedidas (
  codTipoPorta int4 NOT NULL,
  codMedida int4 NOT NULL,
  PRIMARY KEY (codTipoPorta, codBasePorta))
go

CREATE TABLE public.kbt_t_acessorios (
  codAcessorio int4 NOT NULL,
  indTipo VARCHAR(1) NULL DEFAULT NULL,
  descAcessorio VARCHAR(45) NULL DEFAULT NULL,
  indSituacao VARCHAR(1) NULL DEFAULT 'A',
  PRIMARY KEY (codAcessorio))
go
insert into kbt_t_acessorios (codacessorio, indtipo, descacessorio) values (1,1, 'Item Avulso')
go
insert into kbt_t_acessorios (codacessorio, indtipo, descacessorio) values (2,2, 'Marco')
go
insert into kbt_t_acessorios (codacessorio, indtipo, descacessorio) values (3,3, 'Montagem')
go
insert into kbt_t_acessorios (codacessorio, indtipo, descacessorio) values (4,4, 'Alizar')
go
insert into kbt_t_acessorios (codacessorio, indtipo, descacessorio) values (5,5, 'Rodapé')
go

CREATE TABLE public.kbt_t_tipoMarcoTipoPorta (
  codMarco int4 NOT NULL,
  codTipoPorta int4 NOT NULL,
  PRIMARY KEY (codMarco, codTipoPorta))
go

CREATE TABLE public.kbt_t_marcoAcabamento (
  codMarco int4 NOT NULL,
  codAcabamento int4 NOT NULL,
  PRIMARY KEY (codMarco, codAcabamento))
go

CREATE TABLE public.kbt_t_marco (
  codTipoMarco int4 NOT NULL,
  indAcessorio VARCHAR(1) NULL DEFAULT '2',
  codMaterial int4 NULL DEFAULT NULL,
  descMarco VARCHAR(55) NULL DEFAULT NULL,
  indSituacao VARCHAR(1) NULL DEFAULT 'A',
  PRIMARY KEY (codTipoMarco))
go

CREATE TABLE public.kbt_t_tipoMarcoMedidas (
  codMarco int4 NOT NULL,
  codMedida int4 NOT NULL,
  PRIMARY KEY (codMarco, codMedida))
go

CREATE TABLE public.kbt_t_montagem (
  codMontagem int4 NOT NULL,
  indAcessorios VARCHAR(1) NULL DEFAULT '3',
  descMontagem VARCHAR(75) NULL DEFAULT NULL,
  indSituacao VARCHAR(1) NULL DEFAULT 'A',
  PRIMARY KEY (codMontagem))
go

CREATE TABLE public.kbt_t_alizar (
  codAlizar int4 NOT NULL,
  indAcessorio VARCHAR(1) NULL DEFAULT '4',
  descAlizar VARCHAR(55) NULL DEFAULT NULL,
  indSituacao VARCHAR(1) NULL DEFAULT 'A',
  PRIMARY KEY (codAlizar))
go

CREATE TABLE public.kbt_t_alizarAcabamento (
  codAlizar int4 NOT NULL,
  codAcabamento int4 NOT NULL,
  PRIMARY KEY (codAlizar, codAcabamento))
go

CREATE TABLE public.kbt_t_alizarMedidas (
  codAlizar int4 NOT NULL,
  codMedida int4 NOT NULL,
  PRIMARY KEY (codAlizar, codMedida))
go

CREATE TABLE public.kbt_t_rodape (
  codRodape int4 NOT NULL,
  indAcessorio VARCHAR(1) NULL DEFAULT '5',
  descRodape VARCHAR(60) NULL DEFAULT NULL,
  indSituacao VARCHAR(1) NULL DEFAULT 'A',
  PRIMARY KEY (codRodape))
go

CREATE TABLE public.kbt_t_rodapeAcabamento (
  codRodape int4 NOT NULL,
  codAcabamento int4 NOT NULL,
  PRIMARY KEY (codRodape, codAcabamento))
go

CREATE TABLE public.kbt_t_rodapeMedidas (
  codRodape int4 NOT NULL,
  codMedida int4 NOT NULL,
  PRIMARY KEY (codRodape, codMedida))
go

CREATE TABLE public.kbt_t_itemAvulso (
  codItem int4 NOT NULL,
  indAcessorio VARCHAR(1) NULL DEFAULT '1',
  DescItem VARCHAR(55) NULL DEFAULT NULL,
  indSituacao VARCHAR(1) NULL DEFAULT 'A',
  PRIMARY KEY (codItem))
go

CREATE TABLE public.kbt_t_baseAcessorios (
  codBase int4 NOT NULL,
  codAcessorio int4 NOT NULL,
  codComponente int4 NOT NULL,
  PRIMARY KEY (codBase, codAcessorio, codComponente))
go

CREATE TABLE public.kbt_t_listaPrecoMestre (
  NumLista int4 NOT NULL,
  numVersao int4 NULL DEFAULT NULL,
  DescLista VARCHAR(45) NULL DEFAULT NULL,
  precoFSC float8 NULL DEFAULT NULL,
  datValidade DATE NULL DEFAULT NULL,
  IndSituacao VARCHAR(1) NULL DEFAULT 'A',
  PRIMARY KEY (NumLista))
go


CREATE TABLE public.kbt_t_listaMarcoMedAcab (
  numLista int4 NOT NULL,
  codMarco int4 NOT NULL,
  codMedida int4 NOT NULL,
  codAcabamento int4 NOT NULL,
  valTabela float8 NOT NULL,
  PRIMARY KEY (numLista, codMedida, codAcabamento, codMarco))
go

CREATE TABLE public.kbt_t_basePorta (
  codBase int4 NOT NULL,
  codAmbiente int4 NULL DEFAULT NULL,
  codMaterial int4 NULL DEFAULT NULL,
  indSituacao VARCHAR(1) NULL DEFAULT 'A',
  PRIMARY KEY (codBase))
go

CREATE TABLE public.kbt_t_modeloBase (
  codModelo int4 NOT NULL,
  codBase int4 NOT NULL,
  PRIMARY KEY (codModelo, codBase))
go

CREATE TABLE public.kbt_t_listaModelPortaEnchAcess (
  numLista int4 NOT NULL,
  codModeloPorta int4 NOT NULL,
  codTipoPorta int4 NOT NULL,
  codEnchimento int4 NOT NULL,
  codAcessorio int4 NOT NULL,
  codComponente int4 NOT NULL,
  valTabela float8 NOT NULL,
  PRIMARY KEY (codModeloPorta, codTipoPorta, codEnchimento, codAcessorio, codComponente, numLista))
go

CREATE TABLE public.kbt_t_listaMedAcab (
  numLista int4 NOT NULL,
  codMedida int4 NOT NULL,
  codAcabamento int4 NOT NULL,
  valTabela float8 NOT NULL,
  PRIMARY KEY (numLista, codMedida, codAcabamento))
go

CREATE TABLE public.kbt_t_listaMarcoMontagem (
  numLista int4 NOT NULL,
  codMarco int4 NOT NULL,
  codMontagem int4 NOT NULL,
  valTabela float8 NOT NULL,
  PRIMARY KEY (numLista, codMontagem, codMarco))
go

CREATE TABLE public.kbt_t_listaAlizarMedAcab (
  numLista int4 NOT NULL,
  codAlizar int4 NOT NULL,
  codMedida int4 NOT NULL,
  codAcabamento int4 NOT NULL,
  valTabela float8 NOT NULL,
  PRIMARY KEY (numLista, codAlizar, codMedida, codAcabamento))
go

CREATE TABLE public.kbt_t_listaAlizar (
  numLista int4 NOT NULL,
  codAlizar int4 NOT NULL,
  valTabela float8 NOT NULL,
  PRIMARY KEY (numLista, codAlizar))
go

CREATE TABLE public.kbt_t_listaRodape (
  numLista int4 NOT NULL,
  codRodape int4 NOT NULL,
  valTabela float8 NOT NULL,
  PRIMARY KEY (numLista, codRodape))
go

CREATE TABLE public.kbt_t_listaRodapeMedAcab (
  numLista int4 NOT NULL,
  codRodape int4 NOT NULL,
  codMedida int4 NOT NULL,
  codAcabamento int4 NOT NULL,
  valTabela float8 NOT NULL,
  PRIMARY KEY (numLista, codRodape, codMedida, codAcabamento))
