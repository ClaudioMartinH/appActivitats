window.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-data") as HTMLFormElement;
  const userName = document.getElementById("userName") as HTMLInputElement;
  const password = document.getElementById("password") as HTMLInputElement;
  const backendURL =
    window.location.hostname === "localhost"
      ? "http://localhost:3000"
      : "https://app-activitats.vercel.app";
  const mainURL =
    window.location.hostname === "localhost"
      ? "/api/appActivitats/main"
      : "https://app-activitats.vercel.app/api/appActivitats/main";

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const emailValue = userName.value;
    const passwordValue = password.value;
    if (!emailValue || !passwordValue) {
      alert("Please fill out both fields");
      return;
    }
    try {
      const response = await fetch(
        `${backendURL}/api/appActivitats/user/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ email: emailValue, password: passwordValue }),
        }
      );
      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error desconocido");
        } else {
          const errorText = await response.text();
          throw new Error(`Error del servidor: ${errorText}`);
        }
      }
      const data = await response.json();
      localStorage.setItem("email", emailValue);
      localStorage.setItem("id", data.user.id);
      localStorage.setItem("userDisplayFirstName", data.user.firstName);
      window.location.href = `${mainURL}`;
    } catch (error) {
      alert("Error accedint al sistema");
      console.error(error);
      password.value = "";
      userName.focus();
      return;
    }
  });
});
