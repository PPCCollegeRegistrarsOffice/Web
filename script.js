
  // Highlight active nav link and show selected section
  function changeView(viewId) {
    document.querySelectorAll("main section").forEach(section => {
      section.style.display = section.id === viewId ? "block" : "none";
    });

    document.querySelectorAll("nav ul li a").forEach(link => {
      const hrefView = new URL(link.href).searchParams.get("view");
      link.classList.toggle("active", hrefView === viewId);
    });
  }

  // Handle page load, navigation, and form logic
  window.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const view = params.get("view") || "home";
    changeView(view);

    // Handle logo click
    const logo = document.getElementById("homeLogo");
    if (logo) {
      logo.addEventListener("click", () => {
        changeView("home");
        history.replaceState(null, "", "?view=home");
      });
    }

    // Handle 'Others' input visibility
    const otherCheckbox = document.getElementById("otherRequest");
    const otherInput = document.getElementById("otherRequestInput");
    if (otherCheckbox && otherInput) {
      otherCheckbox.addEventListener("change", () => {
        otherInput.style.display = otherCheckbox.checked ? "block" : "none";
        if (!otherCheckbox.checked) {
          otherInput.value = "";
        }
      });
    }

    // Handle form submission
    const form = document.getElementById("requestForm");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const formData = new FormData(form);

        let requestTypes = Array.from(
          form.querySelectorAll('input[name="requestType"]:checked')
        ).map(cb => cb.value);

        // Handle 'Others' validation
        if (requestTypes.includes("Others")) {
          const otherText = formData.get("otherRequestDetail")?.trim();
          if (!otherText) {
            alert("Please specify your 'Others' request.");
            return;
          }
          const index = requestTypes.indexOf("Others");
          requestTypes[index] = `Others: ${otherText}`;
        }

        if (requestTypes.length === 0) {
          alert("Please select at least one type of request.");
          return;
        }

        const params = new URLSearchParams({
  studentName: formData.get("studentName"),
  studentNo: formData.get("studentNo"),
  email: formData.get("email"),
  program: formData.get("program"),
  block: formData.get("block"),
  semester: formData.get("semester"),
  year: formData.get("year"),
  requestType: requestTypes.join(", ")
});


        fetch("https://script.google.com/macros/s/AKfycbzKYCP73RLjRedXh7v9UcZ2eO3L1fmdBshDtlijcRxwb4UeL-WbpbaVxP9BXF4BBzW_/exec?" + params.toString())
  .then(response => response.json())
  .then(data => {
    if (data.result === "success") {
      alert("Request submitted successfully!");
      form.reset();
      if (otherInput) otherInput.style.display = "none";
      changeView("home");
      history.replaceState(null, "", "?view=home");
    } else {
      alert("Submission failed: " + data.message);
    }
  })
  .catch(error => {
    console.error("Error:", error);
    alert("An error occurred. Please try again later.");
  });

      });
    }
  });
  
