var debug = false;
function defineStructure() {
    addColumn('status');
}

function onSync(lastSyncDate) {
    try {
        var newDataset;
        newDataset = DatasetBuilder.newDataset();
        newDataset.addColumn('retorno');

        var constraints = new Array();
        var dataset = DatasetFactory.getDataset("dsk_velis_pedidos", null, constraints, null);


    } catch (error) {

    } finally {
        return newDataset;
    }
}

function createDataset(fields, constraints, sortFields) {

}

function onMobileSync(user) {

}

