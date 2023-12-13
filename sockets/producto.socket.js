export default (io) => {
    const namespaceWebAdmin = io.of('/products/webadmin');
    const namespaceClient = io.of('/products/client');

    namespaceWebAdmin.on('connection', (socket) => {

        socket.on('disponible', (message) => {
          namespaceClient.emit('actualizar-disponibilidad', message);
        });
      
        socket.on('disconnect', () => {
          console.log('UN USUARIO SE DESCONECTÓ DE SOCKET IO');
        });
    });
};