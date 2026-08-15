const API_URL =
    "https://script.google.com/macros/s/AKfycbyv0CO3K-ECRwKSdQAZ3JKH3Qu7giV2EQdZRE4w6T7rSni-JU-h3XPHKmZXfHbZ38gtZw/exec";


const form = document.getElementById("feedbackForm");

const submitButton =
    document.getElementById("submitButton");

const buttonText =
    document.getElementById("buttonText");

const buttonLoader =
    document.getElementById("buttonLoader");

const successMessage =
    document.getElementById("successMessage");

const errorMessage =
    document.getElementById("errorMessage");

const errorText =
    document.getElementById("errorText");

const newFeedbackButton =
    document.getElementById("newFeedbackButton");

const progressFill =
    document.getElementById("progressFill");

const progressText =
    document.getElementById("progressText");

const description =
    document.getElementById("description");

const charCount =
    document.getElementById("charCount");

const contactField =
    document.getElementById("contactField");

const contactInput =
    document.getElementById("contact");


/* CHARACTER COUNTER */

description.addEventListener("input", function() {

    charCount.textContent =
        description.value.length;

    updateProgress();

});


/* CONTACT FIELD */

document
    .querySelectorAll(
        'input[name="contactPermission"]'
    )
    .forEach(function(radio) {

        radio.addEventListener("change", function() {

            if (this.value === "Yes") {

                contactField.classList.remove("hidden");

                contactInput.required = true;

            } else {

                contactField.classList.add("hidden");

                contactInput.required = false;

                contactInput.value = "";

            }

            updateProgress();

        });

    });


/* PROGRESS */

form.addEventListener("input", updateProgress);
form.addEventListener("change", updateProgress);


function updateProgress() {

    const requiredFields =
        form.querySelectorAll(
            "[required]"
        );

    let completed = 0;

    requiredFields.forEach(function(field) {

        if (
            field.type === "radio"
        ) {

            const name = field.name;

            if (
                form.querySelector(
                    'input[name="' +
                    name +
                    '"]:checked'
                )
            ) {
                completed++;
            }

        } else if (
            field.value.trim() !== ""
        ) {

            completed++;

        }

    });


    let percentage = 0;

    if (requiredFields.length > 0) {

        percentage =
            Math.round(
                (completed /
                    requiredFields.length) *
                    100
            );

    }


    progressFill.style.width =
        percentage + "%";

    progressText.textContent =
        percentage + "%";
}


/* SUBMIT */

form.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        if (!form.checkValidity()) {

            form.reportValidity();

            return;

        }


        setLoading(true);

        hideMessages();


        const formData =
            new FormData(form);


        const data = {

            name:
                formData.get("name") || "",

            department:
                formData.get("department") || "",

            level:
                formData.get("level") || "",

            issueType:
                formData.get("issueType") || "",

            description:
                formData.get("description") || "",

            frequency:
                formData.get("frequency") || "",

            seriousness:
                formData.get("seriousness") || "",

            suggestedSolution:
                formData.get("suggestedSolution") || "",

            contactPermission:
                formData.get("contactPermission") || "",

            contact:
                formData.get("contact") || ""

        };


        try {

            const response =
                await fetch(API_URL, {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "text/plain;charset=utf-8"
                    },

                    body:
                        JSON.stringify(data)

                });


            const result =
                await response.json();


            if (
                result.success
            ) {

                form.classList.add("hidden");

                successMessage.classList.remove("hidden");

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            } else {

                throw new Error(
                    result.error ||
                    "Unable to submit feedback."
                );

            }


        } catch (error) {

            errorText.textContent =
                error.message ||
                "Unable to connect to the feedback server.";

            errorMessage.classList.remove("hidden");

        } finally {

            setLoading(false);

        }

    }
);


/* LOADING STATE */

function setLoading(loading) {

    submitButton.disabled =
        loading;

    if (loading) {

        buttonText.textContent =
            "Submitting...";

        buttonLoader.classList.remove(
            "hidden"
        );

    } else {

        buttonText.textContent =
            "Submit Feedback";

        buttonLoader.classList.add(
            "hidden"
        );

    }

}


/* HIDE MESSAGES */

function hideMessages() {

    successMessage.classList.add(
        "hidden"
    );

    errorMessage.classList.add(
        "hidden"
    );

}


/* NEW FEEDBACK */

newFeedbackButton.addEventListener(
    "click",
    function() {

        form.reset();

        contactField.classList.add(
            "hidden"
        );

        contactInput.required = false;

        charCount.textContent = "0";

        progressFill.style.width =
            "0%";

        progressText.textContent =
            "0%";

        successMessage.classList.add(
            "hidden"
        );

        form.classList.remove(
            "hidden"
        );

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }
);


/* INITIAL */

updateProgress();