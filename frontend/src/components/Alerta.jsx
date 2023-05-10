const Alerta = ({alerta}) => {
  const claseTipo = {
    'error': 'from-red-400 to-red-400',
    'info': 'from-sky-400 to-sky-600',
    'success': 'from-green-400 to-green-600',
    'warning': 'from-orange-400 to-orange-600'
  }

  return (
    <div className={`${claseTipo[alerta.tipo]} from bg-gradient-to-br text-center p-3 rounded-xl uppercase text-white font-bold text-sm my-10`}>
      {alerta.msg}
    </div>
  )
}

export default Alerta