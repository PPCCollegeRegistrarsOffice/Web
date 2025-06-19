// Change the visible section and highlight the active nav link
function changeView(viewId) {
  document.querySelectorAll("main section").forEach(section => {
    section.style.display = section.id === viewId ? "block" : "none";
  });

  document.querySelectorAll("nav ul li a").forEach(link => {
    const hrefView = new URL(link.href).searchParams.get("view");
    if (hrefView === viewId) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

// Handle page load
window.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const view = params.get("view") || "home";
  changeView(view);

  // Logo click returns to home
  const logo = document.getElementById("homeLogo");
  if (logo) {
    logo.addEventListener("click", () => {
      changeView("home");
      history.replaceState(null, "", "?view=home");
    });
  }

  // Handle request form submission
  const form = document.getElementById("requestForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const formData = new FormData(form);
      const name = formData.get("studentName");
      const studentNo = formData.get("studentNo");
      const email = formData.get("email");
      const program = formData.get("program");
      const block = formData.get("block");
      const semester = formData.get("semester");
      const year = formData.get("year");

      const selectedTypes = Array.from(document.querySelectorAll('input[name="requestType"]:checked'))
        .map(cb => cb.value);

      if (selectedTypes.length === 0) {
        alert("Please select at least one type of request.");
        return;
      }

      const requestData = {
        studentName: name,
        studentNo: studentNo,
        email: email,
        program: program,
        block: block,
        semester: semester,
        year: year,
        requestType: selectedTypes
      };

      // Send data to Google Apps Script
      fetch("https://script.google.com/macros/s/AKfycbwiHtz_kK5Px9x93MrpUbOq54v2p5tvE0qg1xpHutZdsZQYKknXoaA8UeNw9I8KD2nbvA/exec", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestData)
      })
      .then(response => response.json())
      .then(result => {
        console.log("Server response:", result);
        alert(`Thank you, ${name}. Your request has been submitted.`);
        form.reset();
      })
      .catch(error => {
        console.error("Submission error:", error);
        alert("There was an error submitting your request. Please try again later.");
      });
    });
  }

  // Optional services form
  const servicesForm = document.getElementById("servicesForm");
  if (servicesForm) {
    servicesForm.addEventListener("submit", function (e) {
      e.preventDefault();
      alert("Your service request has been submitted. Thank you!");
      this.reset();
    });
  }
});
