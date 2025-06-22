
// Función que valida un email y en caso erroneo devuelve el texto "El email no es válido"
export const validateEmail = (email, t) => {
  //if (email.length === 0) return true;

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email) || t('valEmail');
};

// Función que valida una contraseña de longitud mínima 4 , una mayuscula y un carácter especial y en caso de error devuelve el texto "La contraseña debe tener al menos 4 caracteres y una mayúscula y un caracter especial"
export const validatePassword = (password, t) => {
  //if (password.length === 0) return true;

  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{4,}$/;
  return (
    passwordPattern.test(password) || t('valPassword')
  );
};

// Permite que el password sea vacio para la ventana de editar usuario
export const validatePasswordEmpty = (password, t) => {
  if (password.length === 0) return true;

  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{4,}$/;
  return passwordPattern.test(password) || t("valPassword");
};

export const validatePhone = (phone, t) => {
  const digits = phone.replace(/[^\d]/g, ""); // Elimina todo excepto números
  const valid = digits.length >= 9;
  return valid || t("valTelefono");
};

export const validateId = (id, t) => {
  const idTrimmed = id.trim();

  // Formato DNI español
  const dniPattern = /^\d{8}[a-zA-Z]$/;

  // Formato NIE español
  const niePattern = /^[XYZ]\d{7}[a-zA-Z]$/;

  // Formato genérico internacional (letras y números, 5-15 caracteres)
  const genericPattern = /^[a-zA-Z0-9]{5,15}$/;

  const valid =
    dniPattern.test(idTrimmed) ||
    niePattern.test(idTrimmed) ||
    genericPattern.test(idTrimmed);

  return valid || t("valDNI");
};