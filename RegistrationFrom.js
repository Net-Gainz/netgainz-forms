function nextPhase(phase) {
    if (!validatePhase(phase - 1)) {
        alert("Please fill in all required fields before proceeding.");
        return;
    }

    document.getElementById("phase1").classList.add("hidden");
    document.getElementById("phase2").classList.add("hidden");
    document.getElementById("phase3").classList.add("hidden");
    document.getElementById("phase" + phase).classList.remove("hidden");

    if (phase === 3) {
        generatePreview();
    }
}

function nextPhase(phase) {
    let errorContainer = document.getElementById("error-message");
    errorContainer.innerHTML = ""; // Clear previous errors

    if (!validatePhase(phase - 1)) {
        errorContainer.innerHTML = "<p style='color: red;'>Please fill in all fields before proceeding</p>";
        return;
    }

    document.getElementById("phase1").classList.add("hidden");
    document.getElementById("phase2").classList.add("hidden");
    document.getElementById("phase3").classList.add("hidden");
    document.getElementById("phase" + phase).classList.remove("hidden");

    if (phase === 3) {
        generatePreview();
    }
}

function validatePhase(phase) {
    let isValid = true;

    if (phase === 1) {
        let fields = ["name", "applicant_name", "mobile", "batch"];
        fields.forEach(id => {
            let element = document.getElementById(id);
            if (!element.value.trim()) {
                isValid = false;
            }
        });
    } else if (phase === 2) {
        let numRegistrations = document.getElementById("num_registrations").value;
        if (!numRegistrations) return false;

        for (let i = 0; i < numRegistrations; i++) {
            let demat = document.getElementById(`demat_name_${i}`);
            let screenshot = document.getElementById(`screenshot_${i}`);

            if (!demat.value.trim() || !screenshot.files.length) {
                isValid = false;
            }
        }
    }

    return isValid;
}



function generateRegistrationFields() {
    let count = document.getElementById("num_registrations").value;
    let container = document.getElementById("registrationFields");
    container.innerHTML = "";

    for (let i = 0; i < count; i++) {
        let div = document.createElement("div");

        div.innerHTML = `
                    <label>Demat Account Name</label>
                    <select id="demat_name_${i}" required><option value="" disabled selected>Select</option>
                        <option value="MStock">MStock</option>
                        <option value="Upstox">Upstox</option>
                        <option value="AngelOne">Angel One</option>
                        <option value="5 Paisa">5 Paisa</option>
                        <option value="MotilalOswal">Motilal Oswal</option>
                        <option value="ShareMarket">ShareMarket</option>
                        <option value="AdityaBirla">Aditya Birla</option>
                        <option value="Groww">Groww</option>
                        <option value="Lemonn">Lemonn</option>
                        <option value="Bajaj Finserv">Bajaj Finserv</option>
                        <option value="Tide">Tide</option>
                    </select>

                    <label>Last Page Screenshot</label>
                    <input type="file" id="screenshot_${i}" accept="image/*" required onchange="previewImage(event, ${i})">
                    <img id="preview_screenshot_${i}" class="screenshot-preview hidden">
                `;
        container.appendChild(div);
    }
}

function previewImage(event, index) {
    let file = event.target.files[0];
    if (file) {
        let reader = new FileReader();
        reader.onload = function (e) {
            let imgElement = document.getElementById(`preview_screenshot_${index}`);
            imgElement.src = e.target.result;
            imgElement.classList.remove("hidden");
        };
        reader.readAsDataURL(file);
    }
}

function generatePreview() {
    let preview = document.getElementById("preview");
    let name = document.getElementById("name").value;
    let applicantName = document.getElementById("applicant_name").value;
    let mobile = document.getElementById("mobile").value;
    let batch = document.getElementById("batch").value;
    let numRegistrations = document.getElementById("num_registrations").value;

    let registrationDetails = "";
    for (let i = 0; i < numRegistrations; i++) {
        let dematName = document.getElementById(`demat_name_${i}`).value;
        let screenshotSrc = document.getElementById(`preview_screenshot_${i}`).src;

        registrationDetails += `<p><strong>Demat Account:</strong> ${dematName}</p>`;
        if (screenshotSrc) {
            registrationDetails += `<img src="${screenshotSrc}" class="screenshot-preview"><br>`;
        }
    }

    preview.innerHTML = `
                <p><strong>Intorducer Name:</strong> ${name}</p>
                <p><strong>Enter Your Name:</strong> ${applicantName}</p>
                <p><strong>Mobile:</strong> ${mobile}</p>
                <p><strong>Batch:</strong> ${batch}</p>
                <p><strong>Number of Registrations:</strong> ${numRegistrations}</p>
                ${registrationDetails}
            `;
}

async function submitForm() {
    let submitButton = document.getElementById("submit-btn");
    let statusMessage = document.getElementById("status");
    let fillElement = document.getElementById("fill");


    // Start progressive fill
    fillElement.style.width = "55%";
    statusMessage.innerText = "Submitting...";
    submitButton.classList.add("filling");


    // Simulate form submission delay (remove if using real API)
    setTimeout(async () => {
        let formData = new URLSearchParams();
        formData.append("name", document.getElementById("name").value);
        formData.append("applicant_name", document.getElementById("applicant_name").value);
        formData.append("mobile", document.getElementById("mobile").value);
        formData.append("batch", document.getElementById("batch").value);
        formData.append("num_registrations", document.getElementById("num_registrations").value);
        formData.append("consent", document.getElementById("consent").checked ? "Yes" : "No");

        let numRegistrations = document.getElementById("num_registrations").value;
        for (let i = 0; i < numRegistrations; i++) {
            formData.append(`demat_${i}`, document.getElementById(`demat_name_${i}`).value);
            let screenshotInput = document.getElementById(`screenshot_${i}`);
            if (screenshotInput && screenshotInput.files.length > 0) {
                let file = screenshotInput.files[0];
                let base64String = await convertToBase64(file); // Convert image to Base64
                formData.append(`screenshot_${i}`, base64String);
            }
        }
        fillElement.style.width = "99%";


        try {
            let response = await fetch("https://script.google.com/macros/s/AKfycbwGGfhINIORY8OORS-Nx6PLN_gwo4JAGvJ_qUNoFur83RMQwQV9HevU72yDPnue6nf6cQ/exec", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: formData.toString()
            });


            if (response.ok) {
                fillElement.style.width = "100%";
                submitButton.classList.add("success");
                statusMessage.innerText = "Form Submitted Successfully!";
            } else {
                statusMessage.innerText = "Submission Failed. Try Again!";
                submitButton.classList.remove("filling");
            }
        } catch (error) {
            statusMessage.innerText = "Error submitting the form.";
            submitButton.classList.remove("filling");
        }
    }, 2000); // Simulate API call delay
}


function convertToBase64(file) {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(",")[1]);
        reader.onerror = error => reject(error);
    });
}
