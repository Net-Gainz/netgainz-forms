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
    errorContainer.innerHTML = "";

    const validation = validatePhase(phase - 1);

    if (validation !== true) {
        // Show the error returned from validatePhase
        errorContainer.innerHTML = `<p style="color:red;">${validation}</p>`;
        return;
    }

    // Hide all phases
    document.getElementById("phase1").classList.add("hidden");
    document.getElementById("phase2").classList.add("hidden");
    document.getElementById("phase3").classList.add("hidden");

    // Show the next phase
    document.getElementById("phase" + phase).classList.remove("hidden");

    if (phase === 3) {
        generatePreview();
    }
}


function validatePhase(phase) {
    if (phase === 1) {
        const name = document.getElementById("name").value.trim();
        const applicantName = document.getElementById("applicant_name").value.trim();
        const mobile = document.getElementById("mobile").value.trim();
        const batch = document.getElementById("batch").value.trim();
        const consent = document.getElementById("consent").checked;

const nameRegex = /^[A-Za-z\s]{2,}$/;
        const mobileRegex = /^[6-9]\d{9}$/;

        if (!name || !nameRegex.test(name)) {
            return "Please enter a valid Introducer Name (letters only)";
        }

        if (!applicantName || !nameRegex.test(applicantName)) {
            return "Please enter a valid Applicant Name (letters only)";
        }

        if (!mobile || !mobileRegex.test(mobile)) {
            return "Please enter a valid 10-digit mobile number";
        }

        if (!batch) {
            return "Please enter your Batch";
        }
    }

    if (phase === 2) {
        let numRegistrations = document.getElementById("num_registrations").value;
        if (!numRegistrations || isNaN(numRegistrations) || parseInt(numRegistrations) <= 0) {
            return "Please enter a valid number of registrations";
        }

        for (let i = 0; i < numRegistrations; i++) {
            let demat = document.getElementById(`demat_name_${i}`);
            let screenshot = document.getElementById(`screenshot_${i}`);

            if (!demat.value.trim()) {
                return `Please select a demat account at index ${i + 1}`;
            }

            if (!screenshot || !screenshot.files.length) {
                return `Please upload a screenshot for demat ${i + 1}`;
            }
        }
    }

    return true; // All good
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
document.getElementById("error-message").innerHTML = "";
    let submitButton = document.getElementById("submit-btn");
    let statusMessage = document.getElementById("status");
    let fillElement = document.getElementById("fill");
      submitButton.disabled = true;

    let consentBox = document.getElementById("consent");
    if (!consentBox.checked) {
        isValid = false;
        document.getElementById("error-message").innerHTML = "<p style='color: red;'>Please accept the consent to proceed.</p>";
              submitButton.disabled = false;

        return;
    }

    fillElement.style.width = "30%";
    statusMessage.innerText = "Submitting...";
    submitButton.classList.add("filling");

    setTimeout(async () => {
        let formData = new URLSearchParams();
        
        formData.append("name", document.getElementById("name").value);
        formData.append("applicant_name", document.getElementById("applicant_name").value);
        formData.append("mobile", document.getElementById("mobile").value.trim());
        formData.append("batch", document.getElementById("batch").value);
        formData.append("num_registrations", document.getElementById("num_registrations").value);
        formData.append("consent", document.getElementById("consent").checked ? "Yes" : "No");

const urlParams = new URLSearchParams(window.location.search);
const src = urlParams.get("src") || "";
console.log(formData);
console.log("SRC from URL:", src);
formData.append("src", src);

        let numRegistrations = document.getElementById("num_registrations").value;
        for (let i = 0; i < numRegistrations; i++) {
            formData.append(`demat_${i}`, document.getElementById(`demat_name_${i}`).value);
            let screenshotInput = document.getElementById(`screenshot_${i}`);
            if (screenshotInput && screenshotInput.files.length > 0) {
                let file = screenshotInput.files[0];
                let base64String = await convertToBase64(file);
                formData.append(`screenshot_${i}`, base64String);
            }
        }

        fillElement.style.width = "90%";

        try {
            let response = await fetch("https://script.google.com/macros/s/AKfycbzRwgOm0vtXGKfkIaA5nxUELdiFp7NwWDxvrNuDwa67gRrQngxWy-ZNFgHbBzXhEt_7/exec", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: formData.toString()
            });

            let result = await response.json(); // Parse JSON response

            if (result.status === "success") {
                fillElement.style.width = "100%";
                submitButton.classList.add("success");
                statusMessage.innerText = "✅ Form Submitted Successfully!";
            } 
            else if(result.message === "Duplicate entry: Mobile number already exists.")
            {
                statusMessage.innerText = "❌ You are Already Registered";
                document.getElementById("consent").disabled = true;
                submitButton.remove();

            }
            else {
                // Backend returned error (like duplicate)
                statusMessage.innerText = "❌ " + result.message;
            }

        } catch (error) {
            statusMessage.innerText = "❌ Submission failed. Please try again.";
            submitButton.classList.remove("filling");
            fillElement.style.width = "0%";
        }
    }, 1000); // Optional animation delay
}




function convertToBase64(file) {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(",")[1]);
        reader.onerror = error => reject(error);
    });

}



