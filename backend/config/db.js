import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    const url = `${connection.connection.host}:${connection.connection.port}`;
    console.log(`MongoDB conectado en: ${url}`);

  } catch (error) {
    console.error(`error: ${error.message}`);
    process.exit(1); // fuerza que el proceso termine de forma asincrona (o sea no se espera a que otro procesos terminen)
  }
}

export default connectDB;