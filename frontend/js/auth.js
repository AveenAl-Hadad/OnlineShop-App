$(document).ready(function() {
    // Registrierung
    $('#registerForm').submit(function(e) {
        e.preventDefault();  // Verhindert normales Formular-Absenden

        const username = $('#registerUsername').val();
        const email = $('#registerEmail').val();
        const password = $('#registerPassword').val();

    
        $.ajax({
            url: 'http://localhost:5000/api/auth/register',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ username, email, password }),
            success: function(response) {
                alert('Registrierung erfolgreich! ✅');
                
                window.location.href = 'login.html';  // Nach Registrierung zur Login-Seite
            },
            error: function(xhr, status, error) {
                alert('❌ Fehler bei der Registrierung: ' + xhr.responseText);
            }
        });
    });

    // Login
    $('#loginForm').submit(function(e) {
        e.preventDefault();  // Verhindert normales Formular-Absenden

        const email = $('#loginEmail').val();
        const password = $('#loginPassword').val();

        $.ajax({
            url: 'http://localhost:5000/api/auth/login',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ email, password }),
            success: function(response) {
                alert('Login erfolgreich! ✅');
                // Du kannst z.B. das Token speichern:
                localStorage.setItem('token', response.token);
                localStorage.setItem('role', response.role);
                // Nach Login z.B. auf index.html weiterleiten
                window.location.href = 'index.html';
            },
            error: function(xhr, status, error) {
                alert('❌ Fehler beim Login: ' + xhr.responseText);
            }
        });
    });
});
