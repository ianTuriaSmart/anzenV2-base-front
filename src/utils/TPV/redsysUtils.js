export const sendRedsysForm = (form) => {
  try {
    // Por si ya se ha insertado un formulario anterior
    const previousForm = document.getElementById("redsys-payment-form");
    if (previousForm) {
      previousForm.remove();
    }

    const formulario = document.createElement("form");
    formulario.id = "redsys-payment-form";
    formulario.method = "POST";
    formulario.action = form.url;
    formulario.style.display = "none"; // Evita flashes visuales

    const campos = {
      Ds_SignatureVersion: form.signatureVersion,
      Ds_MerchantParameters: form.merchantParameters,
      Ds_Signature: form.signature,
    };

    for (const [name, value] of Object.entries(campos)) {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = name;
      input.value = value;
      formulario.appendChild(input);
    }

    document.body.appendChild(formulario);
    formulario.submit();
  } catch (err) {
    console.error("❌ Error al enviar formulario Redsys:", err);
  }
};
