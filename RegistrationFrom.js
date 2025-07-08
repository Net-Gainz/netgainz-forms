function nextPhase(phase) {
    let errorContainer = document.getElementById("error-message");
    errorContainer.innerHTML = ""; // Clear previous errors

    // if (!validatePhase(phase - 1)) {
    //     return;
    // }
    

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

    function validate(id, condition, message) {
        let el = document.getElementById(id), err = document.getElementById(id + "-error");
        if (!err) el.insertAdjacentHTML("afterend", `<div id="${id}-error" class="error"></div>`);
        document.getElementById(id + "-error").textContent = condition ? "" : message;
        if (!condition) isValid = false;
    }

    if (phase === 1) {
        validate("name", document.getElementById("name").value.trim().length >= 2, "Enter a valid name");
        validate("applicant_name", document.getElementById("applicant_name").value.trim().length >= 2, "Enter a valid applicant name");
        validate("mobile", /^[6-9]\d{9}$/.test(document.getElementById("mobile").value.trim()), "Enter a valid 10-digit mobile number");
        validate("batch", document.getElementById("batch").value.trim(), "Select Your Batch");
        // validate("consent", document.getElementById("consent").checked, "You must agree to proceed.");
    } else if (phase === 2) {
        let num = parseInt(document.getElementById("num_registrations").value, 10);
        validate("num_registrations", num > 0, "Select Number of Registration");
        for (let i = 0; i < num; i++) {
            validate(`demat_name_${i}`, document.getElementById(`demat_name_${i}`).value.trim(), "Select a Demat account");
            validate(`screenshot_${i}`, document.getElementById(`screenshot_${i}`).files.length > 0, "Upload a screenshot");
        }
    }

    return isValid;
}
// Ensure unique selections across all dropdowns
function updateDropdowns() {
    let dropdowns = document.querySelectorAll(".demat-dropdown");
    let selectedValues = new Set();

    // Collect selected values
    dropdowns.forEach(dropdown => {
        if (dropdown.value) {
            selectedValues.add(dropdown.value);
        }
    });
    

    // Disable selected options in other dropdowns
    dropdowns.forEach(dropdown => {
        let currentValue = dropdown.value;
        let options = dropdown.querySelectorAll("option");

        options.forEach(option => {
            if (option.value === "") {
                // Keep 'Select' disabled
                option.disabled = true;
            } else {
                // Disable other selected values except for the current selection
                option.disabled = selectedValues.has(option.value) && option.value !== currentValue;
            }
        });
    });
}



function generateRegistrationFields() {
    let count = document.getElementById("num_registrations").value;
    let container = document.getElementById("registrationFields");
    container.innerHTML = "";

    for (let i = 0; i < count; i++) {
        let div = document.createElement("div");

        div.innerHTML = `
                    <label>Demat Account Name</label>
            <select id="demat_name_${i}" class="demat-dropdown" required onchange="updateDropdowns()">
                        <option value="" disabled selected>Select</option>
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
    updateDropdowns(); // Ensure initial state is correct

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
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Applicant Name:</strong> ${applicantName}</p>
                <p><strong>Mobile:</strong> ${mobile}</p>
                <p><strong>Batch:</strong> ${batch}</p>
                <p><strong>Number of Registrations:</strong> ${numRegistrations}</p>
                ${registrationDetails}
            `;
}

async function submitForm() {
    let errorContainer = document.getElementById("error-message");
    let consent = document.getElementById("consent");
        if (!consent.checked) {
            errorContainer.innerHTML = "<p style='color: red; text-align: center'>You must agree to the terms before submitting</p>";
            return;
        }
    errorContainer.innerHTML = "";
    document.getElementById("submit-btn").disabled = true;
    let submitButton = document.getElementById("submit-btn");
    let fillElement = document.getElementById("fill");
    let buttonText = document.getElementById("buttontext");


    // Start progressive fill
    buttonText.innerText = "Submitting...";
    submitButton.classList.add("filling");
    fillElement.style.width = "55%";


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
            let response = await fetch("https://script.google.com/macros/s/AKfycbxCPjwExZoSD-e8BxtmFoXyabIaShLPBdECS_04LBDwA_-v4s7mKKOoudv2T4Hq4kX-Dg/exec", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: formData.toString()
            });


            if (response.ok) {
                fillElement.style.width = "100%";
                submitButton.classList.add("success");
                buttonText.innerText = "Form Submitted Successfully!";
            } else {
                buttonText.innerText = "Submission Failed. Try Again!";
                submitButton.classList.remove("filling");
            }
        } catch (error) {
            buttonText.innerText = "Error submitting the form.";
            submitButton.classList.remove("filling");
        }
    }, 100); // Simulate API call delay
}


function convertToBase64(file) {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(",")[1]);
        reader.onerror = error => reject(error);
    });
}