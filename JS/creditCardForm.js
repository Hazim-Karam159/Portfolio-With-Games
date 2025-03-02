
const scrollToTopButton = document.getElementById('scroll-to-top');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollToTopButton.style.display = 'block';
    } else {
        scrollToTopButton.style.display = 'none';
    }
});

scrollToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});


document.getElementById("validateBtn").addEventListener("click", function() {
    let email = document.getElementById("email").value;
    let mobile = document.getElementById("mob").value;
    let credit = document.getElementById("credit").value;
    let messageBox = document.getElementById("tarea");

    let emailError = document.getElementById("emailError");
    let mobError = document.getElementById("mobError");
    let creditError = document.getElementById("creditError");

    let isValid = true;

    
    let emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
        emailError.textContent = "Invalid Email Format";
        isValid = false;
    } else {
        emailError.textContent = "";
    }

    
    let mobPattern = /^[0-9]{11}$/;
    if (!mobPattern.test(mobile)) {
        mobError.textContent = "Mobile must be 11 digits";
        isValid = false;
    } else {
        mobError.textContent = "";
    }

    
    let creditPattern = /^[0-9]{16}$/;
    if (!creditPattern.test(credit)) {
        creditError.textContent = "Credit card must be 16 digits";
        isValid = false;
    } else {
        creditError.textContent = "";
    }

    
    let formattedCredit = credit.replace(/(\d{4})/g, "$1\n").trim();

   
    if (isValid) {
        messageBox.value = `Credit Card Numbers Are:\n${formattedCredit}`;
    } else {
        messageBox.value = "Validation Failed!";
    }
});