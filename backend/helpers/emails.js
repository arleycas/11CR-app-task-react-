import nodemailer from 'nodemailer';

export const emailRegister = async (data) => {
  const { email, name, token } = data;

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  // info del email
  const info = await transport.sendMail({
    from: '"UpTask - Adiminsitrador de Proyectos <cuentas@uptask.com>"',
    to: email,
    subject: "UpTask - Comprueba tu cuenta",
    text: "Comprueba tu cuenta en UpTask",
    html: `
    <div 
      style="
        width: 90%;
        margin: 2rem auto;
        background-color: #f7f7f7;
        border-radius: 8px;
        padding: 1rem;
        font-family: sans-serif;">

      <p>Hola <b>${name}</b></p>
      <p>
        Tu cuenta ya está casi lista, solo falta confirmar tu cuenta. 
        <a 
          href="${process.env.FRONTEND_URL}/confirmar/${token}"
          style="
            display: inline-block;
            padding: 1rem;
            background-color: #0369A1;
            color: white;
            text-decoration: none;
            text-transform: uppercase;
            margin: 1rem auto;
            width: 100%;
            box-sizing: border-box;
            border-radius: 8px;
            text-align: center;">
          Confirmar cuenta
        </a>
      </p>
      
      <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>
    </div>
    
    `
  });
}

export const emailForgotPassword = async (data) => {
  const { email, name, token } = data;

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  // info del email
  const info = await transport.sendMail({
    from: '"UpTask - Adiminsitrador de Proyectos <cuentas@uptask.com>"',
    to: email,
    subject: "UpTask - Reestablece tu password",
    text: "Reestablece tu password",
    html: `
    <div 
      style="
        width: 90%;
        margin: 2rem auto;
        background-color: #f7f7f7;
        border-radius: 8px;
        padding: 1rem;
        font-family: sans-serif;">

      <p>Hola <b>${name}</b> has solicitado reestablecer tu password</p>
      <p>
        Haz clic en el siguiente enlace para generar un nuevo password.
        <a 
          href="${process.env.FRONTEND_URL}/olvide-password/${token}"
          style="
            display: inline-block;
            padding: 1rem;
            background-color: #0369A1;
            color: white;
            text-decoration: none;
            text-transform: uppercase;
            margin: 1rem auto;
            width: 100%;
            box-sizing: border-box;
            border-radius: 8px;
            text-align: center;">
          Reestablecer password
        </a>
      </p>
      
      <p>Si no generaste esta solicitud, puedes ignorar el mensaje</p>
    </div>
    
    `
  });
}
