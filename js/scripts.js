document.addEventListener("DOMContentLoaded", () => {
    
    const quizForm = document.querySelector("#quiz-form");
    const registrationForm = document.querySelector("#registration-form")
    const phoneInputField = document.querySelector("#phone");
    const errorMessage = document.querySelector("#error-message");
    let answers = {}

    const iti = intlTelInput(phoneInputField, {
        initialCountry: "auto",
        geoIpLookup: function (callback) {
            fetch("https://ipapi.co/json/", { mode: 'no-cors' })
            .then((response) => response.json())
            .then((data) => callback(data.country_code))
            .catch(() => callback("UA")); 
        },
        utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.19/js/utils.js",
    });

    quizForm.addEventListener("submit", (event) => {
        event.preventDefault(); 

        const questions = document.querySelectorAll(".question");
        let isComplete = true;
        const a = {};

        questions.forEach((question, index) => {
            const questionName = `q${index + 1}`;
            const selected = question.querySelector(`input[name="${questionName}"]:checked`);
            if (!selected) {
                isComplete = false;
            } else {
                a[questionName] = selected.value;
            }
        });

        if (!isComplete) {
            errorMessage.textContent = "Please answer all the questions before submitting.";
        } else {
            errorMessage.textContent = "";
            answers = { ...a }
            quizForm.classList.add("d-none")
            registrationForm.classList.remove("d-none")
        }
    });


    registrationForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const { name, email, password, phone } = registrationForm.elements;

        const nameVal = name.value.trim();
        const emailVal = email.value.trim();
        const passwordVal = password.value.trim();
        const phoneVal = phone.value.trim();

        const validateFields = () => {
            if (!iti.isValidNumber()) {
                errorMessage.textContent = "The phone number is incorrect.";
                return false;
            }
    
            if (!nameVal || nameVal.length < 6 ) {
                errorMessage.textContent = "Name must be at least 6 characters long.";
                return false;
            }
    
            if (!emailVal || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
                errorMessage.textContent = "Please enter a valid email address.";
                return false;
            }
    
            if (!passwordVal || passwordVal.length < 6) {
                errorMessage.textContent = "Password must be at least 6 characters long.";
                return false;
            }
            return true;
        }

        const dataIsValid = validateFields();
    
        if (dataIsValid){
            const data = {
                name: nameVal,
                email: emailVal,
                password: passwordVal,
                phone: phoneVal,
                answers
            };

            fetch("https://jsonplaceholder.typicode.com/posts", {
                method: "POST",
                headers: {"Content-Type": "application/json",},
                body: JSON.stringify(data),
            })
            .then((response) => {
                if (response.status === 201) {
                    errorMessage.textContent = "Data has been sent";
                    registrationForm.reset();
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });
        }
    });
});
