const defaultSettings = {
    'autotag-enabled': true,
    'search-enabled': false,
    'autotrackextras-enabled': false,
    'chatbase-enabled': false,
    'box': "#f6ff85",
    'box-enabled': false,
    'outline': "#ff4a4a",
    'outline-enabled': true,
    'execute-script-color': '#FF961E',
    'event-tracking-color': '#61D36F',
    'manage-distribution-list-color': '#1EDEFF',
    'redirect-to-service-color': '#1EA1FF',
    'set-contact-color': '#FF1E90',
    'process-http-color': '#7762E3',
    'set-variable-color': '#FF4A1E',
    'process-command-color': '#FC91AE'
};

const possibleActions = [{
    name: 'Event tracking',
    alias: ['Registro de eventos', 'TrackEvent']
}, {
    name: 'Execute script',
    alias: ['Executar script', 'ExecuteScript']
}, {
    name: 'Manage distribution list',
    alias: ['Gerenciar lista de distribuição', 'ManageList']
}, {
    name: 'Redirect to service',
    alias: ['Redirecionar a um serviço', 'Redirect']
}, {
    name: 'Set contact',
    alias: ['Definir contato', 'MergeContact']
}, {
    name: 'Process HTTP',
    alias: ['Requisição HTTP', 'ProcessHttp']
}, {
    name: 'Set variable',
    alias: ['Definir variável', 'SetVariable']
}, {
    name: 'Process command',
    alias: ['Processar comando', 'ProcessCommand']
}];