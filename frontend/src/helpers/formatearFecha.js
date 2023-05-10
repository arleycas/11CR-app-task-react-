export const formatearFecha = fecha => {

  // toca hacer esto para solucionar el error pedorro de las fechas que se salta un dia y cosas por el estilo
  const nuevaFecha = new Date(fecha.split('T')[0].split('-'));

  const config = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }

  return nuevaFecha.toLocaleDateString('es-ES', config);
}