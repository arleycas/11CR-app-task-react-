import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import usuarioRoutes from './routes/v1/usuario.routes.js';
import projectRoutes from './routes/v1/project.routes.js';
import taskRoutes from './routes/v1/task.routes.js';

const app = express();
app.use(express.json()); // esta configuración permite que en los endpoints se puedan leer la data enviada por el cliente, mediante req.body

dotenv.config();

connectDB();

// configurar CORS
const whiteList = [process.env.FRONTEND_URL];
const corsOptions = {
  origin: function (origin, callback) {
    if (whiteList.includes(origin)) {
      // puede consultar api
      callback(null, true);
    } else {
      // no está permitido consultar API
      callback(new Error('Error de Cors'));
    }
  }
}

app.use(cors(corsOptions));


// definir rutas
app.use('/api/usuario/v1', usuarioRoutes);
app.use('/api/project/v1', projectRoutes);
app.use('/api/task/v1', taskRoutes);

const PORT = process.env.PORT || 4000;

const servidor = app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});

// Socket.io

import { Server } from 'socket.io';

const io = new Server(servidor, {
  pingTimeout: 60000, // si no se recibe nada, se cierra la conexión en  1 minuto
  cors: {
    origin: process.env.FRONTEND_URL, // de donde van a venir las peticiones
  },
});

io.on('connection', (socket) => {
  // console.log('Conectado a socket.io');
  // Definir los eventos de socket.io
  socket.on('client:abrir_proyecto', (idProject) => { // recibe info del frontend
    // console.log('Se ha conectado cliente a proyecto', idProject);
    socket.join(idProject); // unirse a un canal (si más de 1 persona está en la misma página, es como si entraran en un "room")
    // socket.emit('server:respuesta')
  });

  socket.on('client:nueva_tarea', newTask => {

    const idProject = newTask.project;
    // se crea room con el id del proyecto
    socket.join(idProject);  // unirse a un canal (si más de 1 persona está en la misma página, es como si entraran en un "room") Le pusimos como nombre al room el id del proyecto
    socket.to(idProject).emit('server:tarea_agregada', newTask);
  });

  socket.on('client:eliminar_tarea', removedTask => {
    const idProject = removedTask.project._id;
    socket.to(idProject).emit('server:tarea_eliminada', removedTask);
  });

  socket.on('client:actualizar_tarea', updatedTask => {
    const idProject = updatedTask.project._id;
    socket.to(idProject).emit('server:tarea_actualizada', updatedTask);
  });

  socket.on('client:cambiar_estado_tarea', updatedTask => {
    const idProject = updatedTask.project._id;
    socket.to(idProject).emit('server:nuevo_estado_tarea', updatedTask);
  });

});