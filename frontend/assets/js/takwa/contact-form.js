/* ==========================================================================
   Contact form delivery via Web3Forms.

   Every "Get in Touch" form on the site -- the one on the contact page and
   the copy in the footer of every other page -- used to POST to
   takwaweb.designersidhost.com/store-contact-message. That endpoint belonged
   to the old Laravel CMS and is gone: on takwafoods.com it returns 404, so
   every message a visitor sent was lost without either side being told.

   This script takes those forms over and posts them to Web3Forms instead,
   which emails them straight to the address the access key is registered to.
   No backend and no database, which suits a static site on cPanel.

   TO SWITCH IT ON: put the Web3Forms access key in ACCESS_KEY below.
   Get one free at https://web3forms.com -- enter the address the messages
   should arrive at and they email the key straight back.

   Until that key is filled in, the form deliberately refuses to send and
   tells the visitor to phone or email instead. That is on purpose: showing
   somebody "Message sent!" when nothing was sent is worse than telling them
   the truth.
   ========================================================================== */
(function () {
    "use strict";

    /* Registered to info@takwafoods.com as "Takwa Foods Website".
       Access keys are public by design -- this one identifies the inbox to
       deliver to, it is not a secret and cannot be used to read anything. */
    var ACCESS_KEY = "f1d677a1-5d5f-415a-86c8-3dd90adedebb";

    var ENDPOINT = "https://api.web3forms.com/submit";

    /* The site is bilingual, so messages follow whichever version the
       visitor is reading. */
    var STRINGS = {
        en: {
            sending: "Sending…",
            sent: "Thank you — your message has been sent. We'll reply within 24 hours.",
            failed: "Sorry, your message could not be sent. Please email info@takwafoods.com or call +963 942002287.",
            offline: "Please email info@takwafoods.com or call +963 942002287 — we'll get straight back to you.",
            send: "Send Message"
        },
        ar: {
            sending: "جارٍ الإرسال…",
            sent: "شكراً لكم — تم إرسال رسالتكم، وسنرد خلال 24 ساعة.",
            failed: "نعتذر، تعذّر إرسال رسالتكم. يرجى مراسلتنا على info@takwafoods.com أو الاتصال على +963 942002287.",
            offline: "يرجى مراسلتنا على info@takwafoods.com أو الاتصال على +963 942002287 — وسنعود إليكم فوراً.",
            send: "إرسال الرسالة"
        }
    };

    var t = STRINGS[document.documentElement.lang === "ar" ? "ar" : "en"];

    function statusNode(form) {
        /* the contact page ships one of these; the footer copy does not */
        var el = form.querySelector("#msgSubmit, .form-status");
        if (!el) {
            el = document.createElement("div");
            el.className = "form-status";
            form.appendChild(el);
        }
        el.className = "form-status";
        el.style.marginTop = "14px";
        el.style.fontSize = "16px";
        el.style.lineHeight = "1.6";
        return el;
    }

    function say(form, message, ok) {
        var el = statusNode(form);
        el.textContent = message;
        el.style.color = ok ? "#1a7f5a" : "#c0392b";
    }

    function handle(form) {
        form.addEventListener("submit", function (event) {
            event.preventDefault();

            if (!ACCESS_KEY) {
                say(form, t.offline, false);
                return;
            }

            /* the browser's own required/type=email checks first */
            if (typeof form.checkValidity === "function" && !form.checkValidity()) {
                form.reportValidity();
                return;
            }

            var button = form.querySelector('button[type="submit"], .btn-default');
            var label = button ? button.textContent : null;
            if (button) {
                button.disabled = true;
                button.textContent = t.sending;
            }
            say(form, t.sending, true);

            var data = { access_key: ACCESS_KEY };
            new FormData(form).forEach(function (value, key) {
                /* _token is a leftover Laravel CSRF field and means nothing now */
                if (key !== "_token") { data[key] = value; }
            });
            data.from_name = "Takwa Foods website";
            if (!data.subject) { data.subject = "New message from takwafoods.com"; }

            fetch(ENDPOINT, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(data)
            }).then(function (response) {
                return response.json();
            }).then(function (result) {
                if (result && result.success) {
                    form.reset();
                    say(form, t.sent, true);
                } else {
                    say(form, t.failed, false);
                }
            }).catch(function () {
                say(form, t.failed, false);
            }).then(function () {
                if (button) {
                    button.disabled = false;
                    button.textContent = label || t.send;
                }
            });
        });
    }

    function init() {
        var forms = document.querySelectorAll('form[action*="store-contact-message"], form[data-contact-form]');
        for (var i = 0; i < forms.length; i++) { handle(forms[i]); }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
