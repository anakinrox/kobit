CREATE TABLE public.kbt_t_tipo_cadastro ( 
    id         	int4 NOT NULL,
    descricao  	varchar(25) NULL,
    indsituacao	varchar(1) NOT NULL DEFAULT 'A'::character varying,
    PRIMARY KEY(id)
)
GO
CREATE UNIQUE INDEX kbt_t_tipo_cadastro_pkey
    ON public.kbt_t_tipo_cadastro(id)
GO



CREATE TABLE "public"."kbt_t_parametros" ( 
	"id"             	int NOT NULL,
	"codtipocadastro"	int NOT NULL,
	"descricao"      	varchar(25) NULL,
	"tipodados"      	varchar(2) NULL,
	"valorpadrao"    	varchar(25) NULL,
	"indsituacao"    	varchar(1) NULL DEFAULT 'A',
	PRIMARY KEY("id")
)



CREATE TABLE "public"."kbt_t_tipo_niveis" ( 
	"id"         	int NOT NULL,
	"descricao"  	varchar(50) NOT NULL,
	"indsituacao"	varchar(1) NULL DEFAULT 'A',
	PRIMARY KEY("id")
)


CREATE TABLE "public"."kbt_t_categorias" ( 
	"id"         	int NOT NULL,
	"descricao"  	varchar(50) NOT NULL,
	"indsituacao"	varchar(1) NULL DEFAULT 'A',
	PRIMARY KEY("id")
)

CREATE TABLE "public"."kbt_t_categoria_item" ( 
	"idcategoria" 	    int NOT NULL,
    "idparametro"  	    int NOT NULL,
	"valorparametro"    varchar(50) NULL,
	"indsituacao"	    varchar(1) NULL DEFAULT 'A',
	PRIMARY KEY("idcategoria", "idparametro")
)


CREATE TABLE "public"."kbt_t_perfil" ( 
	"id"         	int NOT NULL,
	"descricao"  	varchar(50) NOT NULL,
	"indsituacao"	varchar(1) NULL DEFAULT 'A',
	PRIMARY KEY("id")
)


CREATE TABLE "public"."kbt_t_perfil_categoria" ( 
	"idperfil"         	int NOT NULL,
	"idcategoria" 	    int NOT NULL,
	"idparametro"  	    int NOT NULL,
	"valorparametro"    varchar(50) NULL,
	"indsituacao"	varchar(1) NULL DEFAULT 'A',
	PRIMARY KEY("idperfil","idcategoria","idparametro")
)

CREATE TABLE "public"."kbt_t_perfil_nivel_categoria" ( 
	"idperfil"         	int NOT NULL,
	"idnivel"         	int NOT NULL,
	"idcategoria" 	    int NOT NULL,
	"idparametro"  	    int NOT NULL,
	"valorparametro"    varchar(50) NULL,
	"indsituacao"	varchar(1) NULL DEFAULT 'A',
	PRIMARY KEY("idperfil","idnivel","idcategoria","idparametro")
)


CREATE TABLE "public"."kbt_t_usuario_param" ( 
	"idusuario"        	int NOT NULL,
	"idperfil"         	int NOT NULL,
	"idnivel"         	int NOT NULL,
	"indsituacao"	varchar(1) NULL DEFAULT 'A',
	PRIMARY KEY("idusuario")
)

CREATE TABLE "public"."kbt_t_usuario_param_categoria" ( 
	"idusuario"         int NOT NULL,
	"idcategoria" 	    int NOT NULL,
	"idparametro"  	    int NOT NULL,
	"valorparametro"    varchar(50) NULL,
	"indsituacao"	varchar(1) NULL DEFAULT 'A',
	PRIMARY KEY("idusuario","idcategoria","idparametro")
)

CREATE TABLE "public"."kbt_t_usuario_param_perfil_nivel_categoria" ( 
	"idusuario"         int NOT NULL,
	"idperfil"         	int NOT NULL,
	"idnivel"         	int NOT NULL,
	"idcategoria" 	    int NOT NULL,
	"idparametro"  	    int NOT NULL,
	"valorparametro"    varchar(50) NULL,
	"indsituacao"	varchar(1) NULL DEFAULT 'A',
	PRIMARY KEY("idusuario","idperfil","idcategoria","idparametro")
)

select * 