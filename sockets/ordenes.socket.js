export default (io) => {
    const namespaceWebAdmin = io.of('/orders/status/webadmin');
    const namespaceClient = io.of('/orders/status/client');

    namespaceWebAdmin.on('connection', (socket) => {

        /*
        socket.on('en-proceso', (message) => {
          namespaceClient.emit('actualizar-orden', message.id_orden, message.nuevoEstado);
        });
        */
    
        socket.on('en-proceso', (message) => {
          namespaceClient.emit('actualizar-orden', message);
        });

        socket.on('preparado', (message) => {
          namespaceClient.emit('actualizar-orden', message);
        });

        socket.on('en-camino', (message) => {
          namespaceClient.emit('actualizar-orden', message);
        });

        socket.on('completado', (message) => {
          namespaceClient.emit('actualizar-orden', message);
        });

        socket.on('pendiente', (message) => {
          namespaceClient.emit('listar-ordenes', message);
        });
      
        socket.on('disconnect', () => {
          console.log('UN USUARIO SE DESCONECTÓ DE SOCKET IO');
        });
    });

    namespaceClient.on('connection', (socket) => {
    
        socket.on('nueva-orden-pendiente', (message) => {
          namespaceWebAdmin.emit('listar-orden', message);
        });

        socket.on('nueva-orden-en-proceso', (message) => {
          namespaceWebAdmin.emit('listar-orden', message);
        });

        socket.on('nueva-orden-preparada', (message) => {
          namespaceWebAdmin.emit('listar-orden', message);
        });
        
        socket.on('nueva-orden-en-camino', (message) => {
          namespaceWebAdmin.emit('listar-orden', message);
        });

      
        socket.on('disconnect', () => {
          console.log('UN USUARIO SE DESCONECTÓ DE SOCKET IO');
        });
    });
};