function sendForm() {
    const name = document.getElementById('name').value
    const email = document.getElementById('email').value
    const phone = document.getElementById('phone').value
    const subject = document.getElementById('subject').value
    const message = document.getElementById('message').value



    if (name == ''){
        return alert('Name tidak boleh kosong')
    } else if (email == ''){
        return alert('Email tidak boleh kosong')
    } else if (phone == ''){
        return alert('Phone number tidak boleh kosong')
    } else if (subject == ''){
        return alert('Subject tidak boleh kosong')
    }  else if (message == ''){
        return alert('Message tidak boleh kosong')
    }

    console.log(name);
    console.log(email);
    console.log(phone);
    console.log(subject);
    console.log(message);

    // alert(`${name} \n ${email} \n ${phone} \n ${subject} \n ${message}`)  ${message}, nama saya adalah ${name}, berikut nomor telepon saya ${phone}

    let a = document.createElement('a')
    a.href = `mailto:${email}?subject=${subject}&body=${encodeURIComponent(`${message}, nama saya adalah ${name}, berikut nomor telepon saya ${phone}`)}`

    a.click()

}