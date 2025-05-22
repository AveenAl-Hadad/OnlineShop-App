/**
 * Registrierung: Benutzerdaten per POST an API senden → Bei Erfolg Weiterleitung zu login.html.
 * 
 * Login: Login-Daten senden → Bei Erfolg Token & Rolle speichern → Weiterleitung zu index.html startseite.
 */

// Dieser Block wird ausgeführt, sobald das HTML-Dokument komplett geladen wurde
$(document).ready(function () {

  $('#register-container').load('register.html', function () {
    // Passwort anzeigen
    $('#togglePassword').on('change', function () {
      const type = this.checked ? 'text' : 'password';
      $('#registerPassword').attr('type', type);
      $('#confirmPassword').attr('type', type);
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
          //window.location.href = 'login.html';
          $('#registerModal').fadeOut(function () {
            $('#loginModal').fadeIn();
          });
        },
        error: function (xhr) {
          alert('❌ Fehler bei der Registrierung: ' + xhr.responseText);
        }
      });
    });

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
  });

  $('#login-container').load('login.html', function () {
    // Passwort anzeigen/ausblenden
    $('#showPassword').on('change', function () {
      const passwordField = $('#loginPassword');
      const type = $(this).is(':checked') ? 'text' : 'password';
      passwordField.attr('type', type);
    });
    // Jetzt ist das HTML geladen – also hier Event-Handler registrieren
    $('#loginForm').submit(function (e) {
      e.preventDefault();

      const email = $('#loginEmail').val();
      const password = $('#loginPassword').val();

      $.ajax({
        url: 'http://localhost:5000/api/auth/login',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ email, password }),
        success: function (response) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('role', response.role);

          // Modal schließen
          $('#loginModal').fadeOut();

          // Seite aktualisieren oder weiterleiten
          window.location.href = 'index.html';
        },
        error: function (xhr) {
          alert('❌ Fehler beim Login: ' + xhr.responseText);
        }
      });
    });

    // Modal öffnen
    $('#loginLink').on('click', function (e) {
      e.preventDefault();
      $('#loginModal').fadeIn();
    });
    $('#openRegisterModal').on('click', function (e) {
      e.preventDefault(); // Verhindert die Standardaktion des Links
      $('#loginModal').fadeOut(function () {
        $('#registerModal').fadeIn();
      });
    });

    // Modal schließen
    $('#closeLoginModal').on('click', function () {
      $('#loginModal').fadeOut();
    });

    // Modal schließen beim Klicken außerhalb
    $(window).on('click', function (e) {
      if ($(e.target).is('#loginModal')) {
        $('#loginModal').fadeOut();
      }
    });
  });
});