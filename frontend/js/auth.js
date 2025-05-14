/**
 * Registrierung: Benutzerdaten per POST an API senden → Bei Erfolg Weiterleitung zu login.html.
 * 
 * Login: Login-Daten senden → Bei Erfolg Token & Rolle speichern → Weiterleitung zu index.html startseite.

 */

// Dieser Block wird ausgeführt, sobald das HTML-Dokument komplett geladen wurde
$(document).ready(function() {

     // Wenn das Registrierungsformular abgeschickt wird...
    $('#registerForm').submit(function(e) {
        e.preventDefault();  // Verhindert, dass das Formular normal abgeschickt wird (kein Seiten-Neuladen)
        // Eingabewerte aus den Formularfeldern lesen
        const username = $('#registerUsername').val();
        const email = $('#registerEmail').val();
        const password = $('#registerPassword').val();

         // AJAX-POST-Anfrage an die API senden
        $.ajax({
            url: 'http://localhost:5000/api/auth/register',  // ➜ Backend-Route für Registrierung
            method: 'POST',
            contentType: 'application/json', // Der Server erwartet JSON
            data: JSON.stringify({ username, email, password }), // Daten im JSON-Format senden

            success: function(response) {
                // Wenn die Registrierung erfolgreich ist:
                alert('Registrierung erfolgreich! ✅');                
                window.location.href = 'login.html';  // Nach Registrierung zur Login-Seite
            },
            error: function(xhr, status, error) {
                // Falls ein Fehler auftritt (z. B. E-Mail schon registriert)
                alert('❌ Fehler bei der Registrierung: ' + xhr.responseText);
            }
        });
    });

     // Wenn das Login-Formular abgeschickt wird...
    $('#loginForm').submit(function(e) {
        e.preventDefault();  // Verhindert normales Formular-Absenden
        // Eingabewerte aus dem Login-Formular lesen
        const email = $('#loginEmail').val();
        const password = $('#loginPassword').val();

        $.ajax({
            url: 'http://localhost:5000/api/auth/login',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ email, password }),
            success: function(response) {
                alert('Login erfolgreich! ✅');
                // Speichere das Token und die Rolle lokal im Browser
                localStorage.setItem('token', response.token);// Für Authentifizierung bei späteren API-Aufrufen
                localStorage.setItem('role', response.role); // z. B. 'admin' oder 'user'
                // Weiterleitung zur Startseite
                window.location.href = 'index.html';
              
            },
            error: function(xhr, status, error) {
                 // Bei Loginfehler (z. B. falsches Passwort oder nicht registrierte E-Mail)
                alert('❌ Fehler beim Login: ' + xhr.responseText);
            }
        });
    });
});
