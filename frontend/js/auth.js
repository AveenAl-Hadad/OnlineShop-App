$(document).ready(function() {

    $('#login-container').load('login.html', function() {
        // Passwort anzeigen/ausblenden
        $('#showPassword').on('change', function() {
            const passwordField = $('#loginPassword');
            const type = $(this).is(':checked') ? 'text' : 'password';
            passwordField.attr('type', type);
        });

        // Login-Formular absenden
        $('#loginForm').submit(function(e) {
            e.preventDefault();

            const email = $('#loginEmail').val();
            const password = $('#loginPassword').val();
            const rememberMe = $('#rememberMe').is(':checked');

            $.ajax({
            url: 'http://localhost:5000/api/auth/login',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ email, password }),
            success: function(response) {
                // Token und Rolle speichern
                console.log("Login erfolgreich:", response); // NEU
                if (rememberMe) {
                localStorage.setItem('token', response.token);
                localStorage.setItem('role', response.role);
                } else {
                sessionStorage.setItem('token', response.token);
                sessionStorage.setItem('role', response.role);
                }
                // Modal schließen
                $('#loginModal').fadeOut();
                // Weiterleitung zur Startseite
                window.location.href = 'index.html';
            },
            error: function(xhr) {
                alert('❌ Fehler beim Login: ' + xhr.responseText);
            }
            });// ajax ende
        }); // loginForm Ende

        // Modal öffnen
        $('#loginLink').on('click', function(e) {
            e.preventDefault();
            $('#loginModal').fadeIn();
        });

        // Modal schließen
        $('#closeLoginModal').on('click', function() {
            $('#loginModal').fadeOut();
        });

        // Schließen beim Klicken außerhalb des Modals
        $(window).on('click', function(e) {
            if ($(e.target).is('#loginModal')) {
            $('#loginModal').fadeOut();
            }
        });
       
        // Öffnet das Registrierungs-Modal
        $('#openRegisterModal').on('click', function(e) {
            e.preventDefault();
            $('#loginModal').fadeOut();
            $('#registerModal').fadeIn();
        });


    });// Ende load login container 

        
    //Registierung
    $('#register-container').load('register.html', function() {  

        // Passwörter anzeigen/ausblenden
        $('#showRegisterPassword').on('change', function() {
            const type = $(this).is(':checked') ? 'text' : 'password';
            $('#registerPassword, #confirmPassword').attr('type', type);
        });

        // Passwortbestätigung prüfen
        $('#registerPassword, #confirmPassword').on('keyup', function() {
            // Passwörter anzeigen/ausblenden
            $('#showRegisterPassword').on('change', function() {
                const type = $(this).is(':checked') ? 'text' : 'password';
                $('#registerPassword, #confirmPassword').attr('type', type);
            });
        });

        // Passwortbestätigung prüfen
        $('#registerPassword, #confirmPassword').on('keyup', function() {
            const password = $('#registerPassword').val();
            const confirmPassword = $('#confirmPassword').val();
            const message = $('#passwordMatchMessage');

            if (password === confirmPassword) {
                message.text('Passwörter stimmen überein').css('color', 'green');
            } else {
                message.text('Passwörter stimmen nicht überein').css('color', 'red');
            }
        });
      
        // Registrierung absenden
        $('#registerForm').submit(function (e) {
            e.preventDefault();

            const username = $('#registerUsername').val();
            const email = $('#registerEmail').val();
            const password = $('#registerPassword').val();
            const confirmPassword = $('#confirmPassword').val();

            // Passwort-Vergleich
            if (password !== confirmPassword) {
            alert('❌ Die Passwörter stimmen nicht überein.');
            return;
            }

            // AJAX-POST
            $.ajax({
                url: 'http://localhost:5000/api/auth/register',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ username, email, password }),
                success: function (response) {
                    alert('✅ Registrierung erfolgreich!');
                    $('#registerModal').fadeOut();
                    $('#loginModal').fadeIn();
                },
                error: function (xhr) {
                    alert('❌ Fehler bei der Registrierung: ' + xhr.responseText);
                }
            }); // ende ajax
        }); // ende registerForm

        // Modal öffnen
        $('#registerLink').on('click', function (e) {
            e.preventDefault();
            $('#registerModal').fadeIn();
        });
      
            // Modal schließen
        $('#closeRegisterModal').on('click', function () {
            $('#registerModal').fadeOut();
        });

        $(window).on('click', function (e) {
            if ($(e.target).is('#registerModal')) {
            $('#registerModal').fadeOut();            
            }
        });   
       
 });  // ende load registerLink
}); // ende Ready
