window.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-data") as HTMLFormElement;
  const userName = document.getElementById("userName") as HTMLInputElement;
  const password = document.getElementById("password") as HTMLInputElement;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const emailValue = userName.value;
    const passwordValue = password.value;
    if (!emailValue || !passwordValue) {
      alert("Please fill out both fields");
      return;
    }
    try {
      const response = await fetch("/api/appActivitats/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email: emailValue, password: passwordValue }),
      });
      if (!response.ok) {
        throw new Error("Error accedint");
      }
      const data = await response.json();
      localStorage.setItem("email", emailValue);
      localStorage.setItem("id", data.user.id);
      localStorage.setItem("userDisplayFirstName", data.user.firstName);
      window.location.href = "/api/appActivitats/main";
    } catch (error) {
      alert("Error accedint al sistema");
      console.error(error);
      password.value = "";
      userName.focus();
      return;
    }
  });
});
