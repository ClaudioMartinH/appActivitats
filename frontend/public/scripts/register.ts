window.addEventListener("DOMContentLoaded", () => {
  const firstNameInput = document.getElementById(
    "firstName"
  ) as HTMLInputElement;
  const lastNameInput = document.getElementById("lastName") as HTMLInputElement;
  const ageInput = document.getElementById("age") as HTMLInputElement;
  const emailInput = document.getElementById("email") as HTMLInputElement;
  const passwordInput = document.getElementById("password") as HTMLInputElement;
  const confirmPasswordInput = document.getElementById(
    "confirmPassword"
  ) as HTMLInputElement;
  if (
    !firstNameInput ||
    !lastNameInput ||
    !passwordInput ||
    !ageInput ||
    !emailInput ||
    !confirmPasswordInput
  ) {
    throw new Error("Missing required form elements");
  }
  const signupForm = document.getElementById("form-data") as HTMLFormElement;
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const firstNameInputValue = firstNameInput.value;
    const lastNameInputValue = lastNameInput.value;
    const ageInputValue = parseInt(ageInput.value);
    const emailInputValue = emailInput.value;
    const passwordInputValue = passwordInput.value;
    const confirmPasswordInputValue = confirmPasswordInput.value;

    if (passwordInputValue !== confirmPasswordInputValue) {
      alert("Passwords do not match");
      return;
    }
    const backendURL =
      window.location.hostname === "localhost"
        ? "http://localhost:3000"
        : "https://app-activitats.vercel.app";
    const userData = {
      firstName: firstNameInputValue,
      lastName: lastNameInputValue,
      age: ageInputValue,
      email: emailInputValue,
      password: passwordInputValue,
    };

    try {
      const response = await fetch(`${backendURL}/api/appActivitats/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      const responseBody = await response.text();
      if (!response.ok) {
        let errorData;
        try {
          errorData = JSON.parse(responseBody);
        } catch (jsonError) {
          console.error("Error parseando la respuesta JSON", jsonError);
          throw new Error(`Error al crear el usuario ${responseBody}`);
        }
        throw new Error(
          `Error al crear el usuario: ${errorData.error || "Unexpected error"}`
        );
      }
      let data;
      try {
        data = JSON.parse(responseBody);
      } catch (jsonError) {
        console.error("Error al parsear respuesta JSON exitosa:", jsonError);
        throw new Error(
          `Unexpected format of success response: ${responseBody}`
        );
      }
      console.log("Usuario creado correctamente:", data);
      window.location.href = `${backendURL}/login`;
    } catch (error) {
      console.error("Error al crear el usuario:", error);
    }

    firstNameInput.value = "";
    lastNameInput.value = "";
    ageInput.value = "";
    emailInput.value = "";
    passwordInput.value = "";
    confirmPasswordInput.value = "";
  });
});
