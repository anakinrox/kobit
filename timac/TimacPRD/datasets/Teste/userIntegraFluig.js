function defineStructure() {}

function onSync(lastSyncDate) {}

function createDataset(fields, constraints, sortFields) {

    var dataset = DatasetBuilder.newDataset();
    dataset.addColumn( "user_fluig" );
    dataset.addColumn( "pass_fluig" );
    
    var dados = new Array();
	dados.push( "robo" );
	dados.push( "r0b0flu1g@2021" );
	dataset.addRow( dados );		
		
    return dataset;
    
}